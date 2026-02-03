import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { RawBusiness, EnrichedBusiness } from './types';
import { enrichBusiness } from './2-enrich';
import { cleanAndNormalize } from './3-clean';
import path from 'path';

// Load environment variables manually if needed
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- Utilities ---

function parseMapUrl(src: string): { lat: number, lng: number } | null {
    // Typical Google Maps Embed format: ...!2d-90.8782829!3d43.557609...
    const latMatch = src.match(/!3d([-\d\.]+)/);
    const lngMatch = src.match(/!2d([-\d\.]+)/);

    if (latMatch && lngMatch) {
        return {
            lat: parseFloat(latMatch[1]),
            lng: parseFloat(lngMatch[1])
        };
    }
    return null;
}

function parseHours(text: string): Record<string, string> | null {
    // Very basic parser, returns raw text in a key for now if complex
    // Ideally, parse "Mon-Fri: 9am-5pm" -> { mon: "09:00-17:00", ... }
    // For this task, we will just capture the raw text line-by-line or return a simple object
    if (!text) return null;
    return { "raw": text.trim() };
}

// --- Main Deep Scrape Logic ---

export async function deepScrapeAndRepair() {
    console.log('🚀 Starting Deep Scrape & Repair...');

    // 1. Fetch incomplete businesses from Supabase
    // We target those with NULL latitude
    const { data: businesses, error } = await supabase
        .from('businesses')
        .select('id, name, address, city, state, zip, phone, website, description, latitude, longitude') // Fetch all potential raw fields
        .or('latitude.is.null,address.ilike.%Viroqua%WI%') // Targeted filter
        .order('name');

    if (error || !businesses) {
        console.error('❌ Error fetching businesses:', error);
        return;
    }

    console.log(`📋 Found ${businesses.length} incomplete records. Processing first 5 for verification...`);
    const batch = businesses.slice(0, 5); // Take top 5 for the test run

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    const page = await context.newPage();

    // 2. We need to FIND the profile URL for each business.
    // Strategy: Go to the main directory, search or find the link matching the name.
    // Since the directory is paginated/searchable, it might be faster to just crawl the WHOLE directory once to build a Name->URL map,
    // then use that map for the targeted updates.

    console.log('🕷️  Crawling Directory to build Name->URL Map...');
    const nameToUrl = new Map<string, string>();

    // Viroqua Chamber Directory URL
    const directoryUrl = 'https://www.viroquachamber.com/business/member-directory/';
    await page.goto(directoryUrl);

    // Initial naive loop through pagination could take too long.
    // Let's try to just use the search box if available? Or assume single page list?
    // Viroqua Chamber is usually a "MnM" (MemberClicks or similar) system or wordpress.
    // Let's scrape the first page and see if we can find names.
    // Actually, for "Harvest", we usually iterate pages.
    // Let's assume there are multiple pages.
    // For this "Optimization" task, I will iterate all pages quickly to get the map.

    let hasNextPage = true;
    let pageNum = 1;
    const maxPages = 20; // Safety break

    while (hasNextPage && pageNum < maxPages) {
        console.log(`   Scraping Directory Page ${pageNum}...`);

        // Selectors specific to Viroqua Chamber (Wordpress / Business Directory Plugin?)
        // Based on typical structures, look for directory items.
        // I need to be generic or robust.
        // Selector for items: `.mn-listing` or `.gd-post-item` depending on plugin.
        // Let's try to find links that *contain* the text of our businesses?
        // No, better to extract ALL directory links and fuzzy match.

        // Generic "Member Directory" link extractor
        const listings = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('a'));
            // Filter for links that look like profile pages (usually deeper path)
            return items.map(a => ({
                text: a.innerText.trim(),
                href: a.href
            })).filter(x => x.text.length > 2 && x.href.includes('/business/')); // Filter for probable profile links
        });

        listings.forEach(l => {
            if (!nameToUrl.has(l.text)) {
                nameToUrl.set(l.text.toLowerCase(), l.href);
            }
        });

        // Check for "Next" button
        // Common labels: "Next", ">", ">>", "Next Page"
        const nextButton = await page.$('a:has-text("Next")');
        if (nextButton) {
            await Promise.all([
                page.waitForURL(url => url.toString().includes('page') || url !== page.url()),
                nextButton.click()
            ]).catch(() => { hasNextPage = false; });
            pageNum++;
        } else {
            hasNextPage = false;
        }

        // For this specific test, if we have matches for our batch, we can stop early?
        // No, let's just do a few pages to get coverage.
        // Actually, Viroqua Chamber might list ALL on one page or 2-3 pages.
        if (pageNum > 3) break; // Short circuit for testing speed
    }

    console.log(`🗺️  Built map with ${nameToUrl.size} entries.`);

    // 3. Process Batch
    const updatedRecords = [];

    // 3. Process Batch
    for (const biz of batch) {
        console.log(`\n🔧 Processing: ${biz.name}`);

        // Construct Raw Business from DB
        const raw: RawBusiness = {
            source_id: biz.id,
            name: biz.name,
            raw_address: biz.address || '',
            raw_phone: biz.phone,
            website: biz.website,
            raw_category: '', // Not critical for geo/address repair
            description: biz.description,
            source_url: '', // We don't have this unless we stored it. 
            lat: biz.latitude,
            lng: biz.longitude
        };

        // ENRICH (Geocode + Web Crawl)
        // This handles the "Deep Click" implicitly if we had the profile URL, 
        // BUT wait - enrichBusiness assumes we have a `website` to crawl or an `address` to geocode.
        // It does NOT scrape the Chamber Directory to find the profile link!
        // My previous deep-scrape logic DID that (Name->URL Map).
        // So I must KEEP the Name->URL Map logic, harvest the Chamber Profile data, MERGE it, THEN calling enrichBusiness?

        // Actually, enrichBusiness mainly does Nominatim + Website crawl.
        // It does NOT scrape the aggregator (Chamber).
        // So I should keep the aggregator scraping part here.

        // Let's perform the Chamber lookup first (using the Map we built).
        const searchName = biz.name.toLowerCase();
        let profileUrl = nameToUrl.get(searchName);
        if (!profileUrl) {
            // Exact match failed, try fuzzy
            for (const [key, url] of nameToUrl.entries()) {
                if (key.includes(searchName) || searchName.includes(key)) {
                    profileUrl = url;
                    break;
                }
            }
        }

        // Chamber Harvest (Single Page Visit)
        if (profileUrl) {
            console.log(`   🔗 Chamber Profile match: ${profileUrl}`);
            try {
                // We should probably visit this page to get the "Raw Address" if our DB address is bad ("Viroqua, WI")
                await page.goto(profileUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

                // Extract Address from Chamber Profile
                const chamberData = await page.evaluate(() => {
                    const addr = document.querySelector('.wpbdp-field-address .value')?.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '').trim();
                    const phone = document.querySelector('.wpbdp-field-phone .value')?.textContent?.trim();
                    const web = document.querySelector('.wpbdp-field-website .value a')?.getAttribute('href');
                    const desc = document.querySelector('.wpbdp-field-description .value')?.textContent?.trim();
                    const fb = document.querySelector('.wpbdp-listing a[href*="facebook.com"]')?.getAttribute('href');
                    const insta = document.querySelector('.wpbdp-listing a[href*="instagram.com"]')?.getAttribute('href');
                    const mapSrc = document.querySelector('iframe[src*="maps.google"]')?.getAttribute('src');

                    return { addr, phone, web, desc, fb, insta, mapSrc };
                });

                // Merge Chamber Data into Raw
                if (chamberData.addr && chamberData.addr.length > raw.raw_address.length) raw.raw_address = chamberData.addr;
                if (chamberData.phone) raw.raw_phone = chamberData.phone;
                if (chamberData.web) raw.website = chamberData.web;
                if (chamberData.desc) raw.description = chamberData.desc;
                if (chamberData.fb) raw.facebook_url = chamberData.fb;
                if (chamberData.insta) raw.instagram_url = chamberData.insta;

                // Map Lat/Lng from Iframe if available (Strong Signal)
                if (chamberData.mapSrc) {
                    const coords = parseMapUrl(chamberData.mapSrc);
                    if (coords) {
                        raw.lat = coords.lat;
                        raw.lng = coords.lng;
                    }
                }

            } catch (e) { console.error('   Chamber scrape error: ', e); }
        }

        // NOW run Definitive Enrich (Nominatim + Website Socials)
        const enriched = await enrichBusiness(raw);

        // Clean & Normalize
        const final = cleanAndNormalize(enriched);

        // Update Supabase
        // Only update fields that are meaningful and NEW
        const updates: any = { updated_at: new Date().toISOString() };

        if (final.address && final.address !== biz.address) updates.address = final.address;
        if (final.phone && final.phone !== biz.phone) updates.phone = final.phone;
        if (final.website && final.website !== biz.website) updates.website = final.website;
        if (final.description && (!biz.description || final.description.length > biz.description.length)) updates.description = final.description;
        if (enriched.lat && enriched.lng && (!biz.latitude || !biz.longitude)) {
            updates.latitude = enriched.lat;
            updates.longitude = enriched.lng;
        }
        if (final.social_links.facebook) updates.facebook_url = final.social_links.facebook;
        if (final.social_links.instagram) updates.instagram_url = final.social_links.instagram;
        if (final.logo_url) updates.logo_url = final.logo_url;

        console.log(`   📝 Saving updates for ${biz.name}...`);
        // console.log(updates); // debug

        const { error: upErr } = await supabase.from('businesses').update(updates).eq('id', biz.id);
        if (upErr) console.error('   ❌ DB Update Failed:', upErr.message);
        else console.log('   ✅ DB Updated.');
    }

    await browser.close();

    console.log('\n✨ Batch Report: Successfully Repaired Records ✨');
    console.log(JSON.stringify(updatedRecords, null, 2));
}

deepScrapeAndRepair();
