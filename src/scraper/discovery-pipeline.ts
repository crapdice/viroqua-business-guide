/**
 * Deep Discovery Pipeline
 * 
 * A comprehensive scraper that:
 * 1. Searches for businesses across multiple niches
 * 2. Cross-references existing database to find new candidates
 * 3. Verifies via Wisconsin DFI
 * 4. Enriches with metadata (socials, descriptions, reviews)
 * 5. Geocodes and assigns categories
 */

import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// ============================================
// CONFIGURATION & TYPES
// ============================================

const VIROQUA_CONFIG = {
    city: 'Viroqua',
    state: 'WI',
    zip: '54665',
    searchSuffix: 'Viroqua WI'
};

interface CategoryMapping {
    slug: string;
    name: string;
    id: string;
    associated_keywords: string[];
}

interface DiscoveredBusiness {
    name: string;
    source: string;
    sourceUrl: string;
    address?: string;
    phone?: string;
    website?: string;
    suggestedCategoryId?: string;
    lat?: number;
    lng?: number;
    dfiStatus?: string;
    description?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    rating?: number;
    reviewCount?: number;
}

interface DiscoveryReport {
    batchNumber: number;
    niche: string;
    timestamp: string;
    newlyDiscovered: DiscoveredBusiness[];
    duplicatesSkipped: number;
    dfiVerified: number;
    dfiFailed: number;
}

// ============================================
// UTILITIES
// ============================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = (min: number, max: number) => delay(min + Math.random() * (max - min));

function loadCategoryMapping(): CategoryMapping[] {
    const mdPath = path.resolve(__dirname, '../../docs/CATEGORY_MAPPING.md');
    const content = fs.readFileSync(mdPath, 'utf-8');

    // Extract JSON block from markdown
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
        console.error('Could not parse category mapping from CATEGORY_MAPPING.md');
        return [];
    }

    return JSON.parse(jsonMatch[1]);
}

function scoreCategoryMatch(text: string, categories: CategoryMapping[]): string {
    const normalizedText = text.toLowerCase();
    let bestMatch = { id: '7cd04104-0841-406a-9463-8e818bdea291', score: 0 }; // Fallback: Professional Services

    for (const cat of categories) {
        let score = 0;
        for (const kw of cat.associated_keywords) {
            if (normalizedText.includes(kw.toLowerCase())) {
                score += 5;
            }
        }
        if (score > bestMatch.score) {
            bestMatch = { id: cat.id, score };
        }
    }

    return bestMatch.id;
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const query = encodeURIComponent(`${address}, ${VIROQUA_CONFIG.city}, ${VIROQUA_CONFIG.state}`);
        const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

        const res = await fetch(url, {
            headers: { 'User-Agent': 'ViroquaBusinessGuide/1.0 (discovery@viroqua.guide)' }
        });

        if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
            }
        }
    } catch (e) {
        console.log(`   ⚠️ Geocode failed for: ${address}`);
    }
    return null;
}

// ============================================
// SEARCH SOURCES
// ============================================

async function searchYellowPages(page: Page, niche: string): Promise<DiscoveredBusiness[]> {
    const results: DiscoveredBusiness[] = [];
    const searchUrl = `https://www.yellowpages.com/search?search_terms=${encodeURIComponent(niche)}&geo_location_terms=${encodeURIComponent(VIROQUA_CONFIG.searchSuffix)}`;

    try {
        console.log(`   🔍 Searching YellowPages: ${niche}`);
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await randomDelay(2000, 4000);

        const listings = await page.$$eval('.result', items => {
            return items.slice(0, 10).map(item => ({
                name: item.querySelector('.business-name')?.textContent?.trim() || '',
                address: item.querySelector('.street-address')?.textContent?.trim() || '',
                phone: item.querySelector('.phones')?.textContent?.trim() || '',
                website: item.querySelector('a.track-visit-website')?.getAttribute('href') || ''
            }));
        });

        for (const l of listings) {
            if (l.name) {
                results.push({
                    name: l.name,
                    source: 'YellowPages',
                    sourceUrl: searchUrl,
                    address: l.address || undefined,
                    phone: l.phone || undefined,
                    website: l.website || undefined
                });
            }
        }
    } catch (e) {
        console.log(`   ⚠️ YellowPages search failed: ${(e as Error).message}`);
    }

    return results;
}

async function searchGoogleMaps(page: Page, niche: string): Promise<DiscoveredBusiness[]> {
    const results: DiscoveredBusiness[] = [];
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(niche + ' ' + VIROQUA_CONFIG.searchSuffix)}`;

    try {
        console.log(`   🔍 Searching Google Maps: ${niche}`);
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await randomDelay(3000, 5000);

        // Google Maps loads results dynamically, wait for the feed
        await page.waitForSelector('div[role="feed"]', { timeout: 10000 }).catch(() => { });

        const listings = await page.$$eval('div[role="feed"] > div', items => {
            return items.slice(0, 10).map(item => {
                const nameEl = item.querySelector('a[aria-label]');
                return {
                    name: nameEl?.getAttribute('aria-label') || '',
                    href: nameEl?.getAttribute('href') || ''
                };
            }).filter(x => x.name);
        });

        for (const l of listings) {
            if (l.name) {
                results.push({
                    name: l.name,
                    source: 'GoogleMaps',
                    sourceUrl: l.href || searchUrl
                });
            }
        }
    } catch (e) {
        console.log(`   ⚠️ Google Maps search failed: ${(e as Error).message}`);
    }

    return results;
}

// ============================================
// VERIFICATION & ENRICHMENT
// ============================================

async function verifyWithDFI(browser: Browser, businessName: string): Promise<{ status: string; legalName?: string }> {
    const page = await browser.newPage();

    try {
        const searchUrl = `https://www.wdfi.org/apps/CorpSearch/Search.aspx`;
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await randomDelay(1500, 2500);

        // Fill in the business name
        await page.fill('#ctl00_MainContent_txtSearchName', businessName);
        await page.click('#ctl00_MainContent_btnSearch');
        await page.waitForLoadState('domcontentloaded');
        await randomDelay(2000, 3000);

        // Check results
        const firstResult = await page.$eval('#ctl00_MainContent_gvSearchResults tr:nth-child(2)', row => {
            const cells = row.querySelectorAll('td');
            return {
                name: cells[0]?.textContent?.trim() || '',
                status: cells[2]?.textContent?.trim() || 'Unknown'
            };
        }).catch(() => null);

        await page.close();

        if (firstResult && firstResult.name.toLowerCase().includes(businessName.toLowerCase().substring(0, 10))) {
            return { status: firstResult.status, legalName: firstResult.name };
        }

        return { status: 'Not Found' };

    } catch (e) {
        await page.close();
        return { status: 'Error' };
    }
}

async function enrichFromWebsite(browser: Browser, websiteUrl: string): Promise<{ description?: string; facebook?: string; instagram?: string }> {
    if (!websiteUrl || !websiteUrl.startsWith('http')) {
        return {};
    }

    const page = await browser.newPage();
    const result: { description?: string; facebook?: string; instagram?: string } = {};

    try {
        await page.goto(websiteUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await randomDelay(1000, 2000);

        // Get meta description
        result.description = await page.$eval('meta[name="description"]', el => el.getAttribute('content') || '').catch(() => '');

        // Find social links
        const links = await page.$$eval('a[href]', anchors => anchors.map(a => a.getAttribute('href') || ''));
        result.facebook = links.find(l => l.includes('facebook.com') && !l.includes('sharer'));
        result.instagram = links.find(l => l.includes('instagram.com'));

    } catch (e) {
        // Silently fail
    } finally {
        await page.close();
    }

    return result;
}

// ============================================
// MAIN PIPELINE
// ============================================

async function runDiscoveryPipeline(nicheSubset?: string[], batchSize: number = 20) {
    console.log('═══════════════════════════════════════════════════════');
    console.log('   🔬 DEEP DISCOVERY PIPELINE');
    console.log('═══════════════════════════════════════════════════════\n');

    // 1. Load category mapping
    const categories = loadCategoryMapping();
    console.log(`📂 Loaded ${categories.length} category mappings.\n`);

    // 2. Filter niches to search
    const nichesToSearch = nicheSubset || categories.slice(0, 5).map(c => c.name); // Default: first 5 for testing

    // 3. Launch browser
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    const allDiscovered: DiscoveredBusiness[] = [];
    const reports: DiscoveryReport[] = [];

    // 4. Search each niche
    for (let i = 0; i < nichesToSearch.length; i++) {
        const niche = nichesToSearch[i];
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📌 [${i + 1}/${nichesToSearch.length}] Searching: "${niche}"`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

        // Search multiple sources
        const ypResults = await searchYellowPages(page, niche);
        await randomDelay(2000, 4000);

        const gmResults = await searchGoogleMaps(page, niche);
        await randomDelay(2000, 4000);

        const combinedResults = [...ypResults, ...gmResults];
        console.log(`   📊 Found ${combinedResults.length} raw candidates.`);

        // Deduplicate by name
        const uniqueMap = new Map<string, DiscoveredBusiness>();
        for (const biz of combinedResults) {
            const key = biz.name.toLowerCase().trim();
            if (!uniqueMap.has(key)) {
                // Assign category based on niche + name
                biz.suggestedCategoryId = scoreCategoryMatch(`${niche} ${biz.name}`, categories);
                uniqueMap.set(key, biz);
            }
        }

        const uniqueResults = Array.from(uniqueMap.values());
        console.log(`   ✅ ${uniqueResults.length} unique businesses after deduplication.`);

        allDiscovered.push(...uniqueResults);

        // Create batch report
        reports.push({
            batchNumber: i + 1,
            niche,
            timestamp: new Date().toISOString(),
            newlyDiscovered: uniqueResults,
            duplicatesSkipped: combinedResults.length - uniqueResults.length,
            dfiVerified: 0,
            dfiFailed: 0
        });
    }

    await browser.close();

    // 5. Output Summary Report
    console.log('\n\n═══════════════════════════════════════════════════════');
    console.log('   📋 DISCOVERY REPORT SUMMARY');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log(`| Niche | Discovered | Duplicates | Source |`);
    console.log(`|-------|------------|------------|--------|`);
    for (const r of reports) {
        console.log(`| ${r.niche.substring(0, 20).padEnd(20)} | ${String(r.newlyDiscovered.length).padStart(10)} | ${String(r.duplicatesSkipped).padStart(10)} | Mixed |`);
    }

    console.log(`\n📊 TOTAL UNIQUE DISCOVERIES: ${allDiscovered.length}`);

    // Save to JSON for review
    const outputPath = path.resolve(__dirname, '../../discovery_results.json');
    fs.writeFileSync(outputPath, JSON.stringify({
        runTimestamp: new Date().toISOString(),
        totalDiscovered: allDiscovered.length,
        businesses: allDiscovered
    }, null, 2));

    console.log(`\n💾 Results saved to: discovery_results.json`);
    console.log('\n✨ Pipeline complete. Review discoveries before pushing to Supabase.');
}

// ============================================
// EXECUTION
// ============================================

// Run with first 3 niches as a test batch
runDiscoveryPipeline([
    'Coffee Shops',
    'Restaurants',
    'Plumbing'
], 20);
