import { chromium } from 'playwright';
import { RawBusiness, EnrichedBusiness } from './types';
import { VIROQUA_CONFIG } from './config';

// Simple delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function enrichBusiness(biz: RawBusiness | EnrichedBusiness): Promise<EnrichedBusiness> {
    const enriched: EnrichedBusiness = { ...biz };

    // 1. GEOCODING & ADDRESS DISCOVERY (Nominatim)
    // We try to find the business by Name + City
    // Note: We use 'lat' from EnrichedBusiness interface
    if (!enriched.lat || !enriched.lng) {
        try {
            let query = '';
            if (enriched.raw_address && enriched.raw_address.match(/\d+/)) {
                // High confidence address
                query = enriched.raw_address;
            } else {
                // Fallback to name search
                query = `${biz.name}, ${VIROQUA_CONFIG.city}, ${VIROQUA_CONFIG.state}`;
            }

            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=1`;

            console.log(`      📍 Geocoding: ${query}`);
            const res = await fetch(url, {
                headers: { 'User-Agent': 'ViroquaBusinessGuide/1.0 (bot@viroqua.guide)' }
            });

            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    const place = data[0];
                    enriched.lat = parseFloat(place.lat); // Store in enriched object, need to ensure type supports it or we return it
                    enriched.lng = parseFloat(place.lon);

                    // If we have a specific house number, perform address update
                    if (place.address && place.address.house_number && place.address.road) {
                        enriched.raw_address = `${place.address.house_number} ${place.address.road}`;
                    }
                    console.log(`      ✅ Found: ${enriched.raw_address} (${enriched.lat}, ${enriched.lng})`);
                } else {
                    console.log('      ⚠️  Nominatim found nothing.');
                }
            }
            await delay(2000 + Math.random() * 2000); // Rate Limit Nominatim (2-4s)
        } catch (e) {
            console.error('      ❌ Geocode error:', e);
        }
    }

    // 2. SOCIALS & METADATA (Website Crawl)
    if (enriched.website && (!enriched.facebook_url || !enriched.instagram_url)) {
        try {
            console.log(`      🌐 Crawling: ${enriched.website}`);
            const browser = await chromium.launch({ headless: true });
            const page = await browser.newPage();

            try {
                await page.goto(enriched.website, { waitUntil: 'domcontentloaded', timeout: 15000 });

                // Extract Social links
                // Extract Social links & Logo
                const data = await page.evaluate(() => {
                    const hrefs = Array.from(document.querySelectorAll('a')).map(a => a.href);
                    const fb = hrefs.find(h => h.includes('facebook.com') && !h.includes('sharer') && !h.includes('login'));
                    const insta = hrefs.find(h => h.includes('instagram.com'));

                    // Logo Strategy: OG Image -> Icon -> Img with logo class
                    let logo = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
                    if (!logo) {
                        logo = document.querySelector('link[rel="icon"]')?.getAttribute('href') ||
                            document.querySelector('link[rel="shortcut icon"]')?.getAttribute('href');
                    }
                    if (!logo) {
                        const img = document.querySelector('img[src*="logo"], img[class*="logo"], img[id*="logo"]');
                        if (img) logo = (img as HTMLImageElement).src;
                    }

                    // Normalize Relative URLs (simple logic)
                    if (logo && !logo.startsWith('http')) {
                        // Use base URI of the document
                        logo = new URL(logo, document.baseURI).href;
                    }

                    return { fb, insta, logo };
                });

                if (data.fb && !enriched.facebook_url) enriched.facebook_url = data.fb;
                if (data.insta && !enriched.instagram_url) enriched.instagram_url = data.insta;
                if (data.logo) enriched.logo_url = data.logo;

                console.log(`      ✅ Socials found: FB=${!!data.fb}, IG=${!!data.insta}, Logo=${!!data.logo}`);

            } catch (crawlErr) {
                console.log(`      ⚠️  Crawl timeout/error: ${crawlErr.message}`);
            } finally {
                await browser.close();
            }
        } catch (botErr) {
            // Browser launch error
        }
    }

    return enriched;
}
