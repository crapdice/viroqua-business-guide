import { chromium } from 'playwright';
import { RawBusiness } from './types';

const CHAMBER_URL = 'https://www.viroquachamber.com/business/member-directory/';

export async function harvestViroquaChamber(limit?: number): Promise<RawBusiness[]> {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const results: RawBusiness[] = [];

    try {
        console.log(`P1: Navigating to ${CHAMBER_URL}`);
        await page.goto(CHAMBER_URL, { waitUntil: 'domcontentloaded' });

        let hasNext = true;
        while (hasNext) {
            await page.waitForSelector('.wpbdp-listing', { timeout: 10000 }).catch(() => {
                console.log('No listings found on this page.');
                hasNext = false;
            });

            if (!hasNext) break;

            const profileLinks = await page.$$eval('.wpbdp-listing .listing-title a, .wpbdp-listing .wpbdp-field-title .value a',
                links => links.map(a => (a as HTMLAnchorElement).href));

            console.log(`   Found ${profileLinks.length} listings on this page. Visiting profiles...`);

            for (const profileUrl of profileLinks) {
                // Check limit BEFORE visiting
                if (limit && results.length >= limit) {
                    console.log(`      🛑 Limit reached (${limit}). Stopping.`);
                    hasNext = false;
                    break;
                }

                try {
                    console.log(`      ➡️ Visiting: ${profileUrl}`);
                    const profilePage = await browser.newPage();
                    await profilePage.goto(profileUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });

                    // DEEP EXTRACTION
                    // Name: Try H1 first (listing page title), else fallback
                    let name = await profilePage.$eval('h1.entry-title', el => el.textContent?.trim() || '').catch(() => '');
                    if (!name) {
                        name = await profilePage.$eval('.wpbdp-field-title .value', el => el.textContent?.trim() || '').catch(() => '');
                    }

                    const street = await profilePage.$eval('.wpbdp-field-address .value', el => {
                        return el.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '').trim();
                    }).catch(() => '');
                    const city = await profilePage.$eval('.wpbdp-field-city .value, .wpbdp-field-city_state_zip .value', el => el.textContent?.trim() || '').catch(() => '');
                    const state = await profilePage.$eval('.wpbdp-field-state .value', el => el.textContent?.trim() || '').catch(() => '');
                    const zip = await profilePage.$eval('.wpbdp-field-zip .value', el => el.textContent?.trim() || '').catch(() => '');

                    let raw_address = street;
                    if (city) raw_address += `, ${city}`;
                    if (state) raw_address += `, ${state}`;
                    if (zip) raw_address += ` ${zip}`;

                    const raw_phone = await profilePage.$eval('.wpbdp-field-phone .value', el => el.textContent?.trim() || null).catch(() => null);
                    // Use type assertion for href access
                    const website = await profilePage.$eval('.wpbdp-field-website .value a, .visit-website a', el => (el as HTMLAnchorElement).href || null).catch(() => null);
                    const description = await profilePage.$eval('.wpbdp-field-description .value, .wpbdp-field-long_description .value, .wpbdp-field-business_description .value', el => el.textContent?.trim() || null).catch(() => null);
                    const raw_category = await profilePage.$eval('.wpbdp-field-category .value', el => el.textContent?.trim() || 'Uncategorized').catch(() => 'Uncategorized');

                    const fb = await profilePage.$eval('.wpbdp-listing a[href*="facebook.com"]', el => (el as HTMLAnchorElement).href).catch(() => undefined);
                    const insta = await profilePage.$eval('.wpbdp-listing a[href*="instagram.com"]', el => (el as HTMLAnchorElement).href).catch(() => undefined);
                    const hours = await profilePage.$eval('.wpbdp-field-business_hours .value', el => el.textContent?.trim() || undefined).catch(() => undefined);

                    let lat: number | undefined;
                    let lng: number | undefined;

                    const mapLink = await profilePage.$eval('.wpbdp-listing a[href*="maps.google.com"], .wpbdp-listing a[href*="google.com/maps"]', el => (el as HTMLAnchorElement).href).catch(() => null);
                    if (mapLink) {
                        const match = mapLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                        if (match) {
                            lat = parseFloat(match[1]);
                            lng = parseFloat(match[2]);
                        }
                    }

                    results.push({
                        source_id: profileUrl,
                        name: name || 'Unknown',
                        raw_address: raw_address || '',
                        raw_phone,
                        website,
                        raw_category,
                        description,
                        source_url: profileUrl,
                        facebook_url: fb,
                        instagram_url: insta,
                        raw_hours: hours,
                        lat,
                        lng
                    });

                    await profilePage.close();
                    await profilePage.close();

                    // Rate Limit Protection
                    const wait = 2000 + Math.random() * 2000;
                    console.log(`      ⏳ Waiting ${Math.floor(wait)}ms...`);
                    await page.waitForTimeout(wait);

                } catch (e) {
                    console.error(`      ❌ Error visiting profile ${profileUrl}:`, e);
                }
            }

            if (limit && results.length >= limit) break;

            const nextBtn = await page.$('.wpbdp-pagination .next');
            if (nextBtn) {
                await Promise.all([
                    page.waitForLoadState('domcontentloaded'),
                    nextBtn.click()
                ]);
            } else {
                hasNext = false;
            }
        }
    } catch (error) {
        console.error('Harvest Error (Chamber):', error);
    } finally {
        await browser.close();
    }

    return results;
}

// Re-export unimplemented functions to satisfy interface/imports in index.ts
// Hardcoded data derived from VEDA website (Food Enterprise Center)
export async function harvestVEDA(): Promise<RawBusiness[]> {
    console.log('P2: Harvesting VEDA (Food Enterprise Center)...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const sourceUrl = 'https://veda-wi.org/food-enterprise-center/current-tenants/';
    const vedaAddress = '1201 N Main St, Viroqua, WI 54665';
    const results: RawBusiness[] = [];

    try {
        await page.goto(sourceUrl, { waitUntil: 'domcontentloaded' });

        // Strategy: Look for the tenant list. Usually they are headings or list items.
        // Based on visually inspecting VEDA site structure (generic assumption of list structure for now)
        // Adjust selectors: The site often uses Elementor or similar.
        // We will target generic headings or "et_pb_module" content if standard.
        // For resilience, we stick to extracting text blocks that look like businesses.

        // Actually, VEDA tenants are often listed in paragraphs or list items.
        // We will try to extract ANY text inside the main content area that looks like a list.
        // A robust selector for typical business lists:
        const tenants = await page.evaluate(() => {
            const items: any[] = [];
            // Target H3s or H4s which are common for names
            const headings = document.querySelectorAll('h3, h4, strong');
            headings.forEach(h => {
                const name = h.textContent?.trim();
                if (name && name.length > 3 && name.length < 50) {
                    // Try to find description in next sibling
                    let desc = '';
                    let sibling = h.nextElementSibling;
                    if (sibling && sibling.tagName === 'P') {
                        desc = sibling.textContent?.trim() || '';
                    }
                    items.push({ name, desc });
                }
            });
            return items;
        });

        // Filter and Map
        for (const t of tenants) {
            // Exclude common false positives
            if (['Tenant', 'Contact', 'Phone'].includes(t.name)) continue;

            results.push({
                source_id: `VEDA-${t.name.replace(/\s+/g, '-').toLowerCase()}`,
                name: t.name,
                raw_address: vedaAddress,
                raw_phone: null,
                website: 'https://veda-wi.org/food-enterprise-center/',
                raw_category: 'Agriculture & Food Systems', // Default for VEDA
                description: t.desc || 'Food Enterprise Center Tenant',
                source_url: sourceUrl
            });
        }

    } catch (e) {
        console.error('VEDA Harvest Error:', e);
    } finally {
        await browser.close();
    }
    return results;
}

export async function harvestPublicMarket(): Promise<RawBusiness[]> {
    console.log('P3: Harvesting Viroqua Public Market...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const sourceUrl = 'https://www.viroquapublicmarket.com/merchants'; // Likely URL
    const marketAddress = '215 S Main St, Viroqua, WI 54665';
    const results: RawBusiness[] = [];

    try {
        await page.goto('https://www.viroquapublicmarket.com/', { waitUntil: 'domcontentloaded' });

        // Strategy: Navigate to Merchants page if exists or scrape home
        // Typically these sites have a "Merchants" or "Vendors" link.
        const merchantLinks = await page.$$eval('a', links => links.filter(l => l.innerText.includes('Merchants') || l.href.includes('merchants')).map(l => l.href));
        if (merchantLinks.length > 0) {
            await page.goto(merchantLinks[0], { waitUntil: 'domcontentloaded' });
        }

        // Extract items (Generic Grid Items)
        const vendors = await page.evaluate(() => {
            const items: any[] = [];
            // Selectors for Squarespace/Wix/Wordpress grids
            document.querySelectorAll('.sqs-block-content, .card, .merchant-item').forEach(el => {
                const name = el.querySelector('h2, h3, .name')?.textContent?.trim();
                const desc = el.querySelector('p, .description')?.textContent?.trim();
                if (name) items.push({ name, desc });
            });
            return items;
        });

        for (const v of vendors) {
            results.push({
                source_id: `VPM-${v.name.replace(/\s+/g, '-').toLowerCase()}`,
                name: v.name,
                raw_address: marketAddress,
                raw_phone: '608-637-2338',
                website: 'https://www.viroquapublicmarket.com/',
                raw_category: 'Shopping & Retail',
                description: v.desc || 'Viroqua Public Market Merchant',
                source_url: sourceUrl,
                lat: 43.5546,
                lng: -90.8894
            });
        }

    } catch (e) {
        console.error('Market Harvest Error:', e);
    } finally {
        await browser.close();
    }
    return results;
}
