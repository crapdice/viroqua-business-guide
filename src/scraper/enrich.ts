/**
 * Business Enrichment Script
 * 
 * Visits each business website and extracts:
 * - Email addresses
 * - Descriptions (from meta tags or hero text)
 * - Logo URLs
 * - Taglines
 * - Opening hours
 * - Year established
 * - Owner name
 * - Booking/menu URLs
 * - Certifications
 * - Hero images
 * - Coordinates (via Nominatim geocoding)
 */

import { chromium, Browser, Page } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    batchSize: 10,
    delayBetweenRequests: { min: 2000, max: 4000 },
    timeout: 15000,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

// ============================================
// TYPES
// ============================================

interface BusinessToEnrich {
    id: string;
    name: string;
    website: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    description: string | null;
    email: string | null;
    latitude: number | null;
}

interface EnrichedData {
    description?: string;
    email?: string;
    logo_url?: string;
    tagline?: string;
    opening_hours?: Record<string, string>;
    year_established?: number;
    owner_name?: string;
    booking_url?: string;
    menu_url?: string;
    certifications?: string[];
    hero_image_url?: string;
    instagram_url?: string;
    facebook_url?: string;
    latitude?: number;
    longitude?: number;
}

// ============================================
// UTILITIES
// ============================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = () => delay(
    CONFIG.delayBetweenRequests.min +
    Math.random() * (CONFIG.delayBetweenRequests.max - CONFIG.delayBetweenRequests.min)
);

async function geocodeAddress(address: string, city: string, state: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const query = encodeURIComponent(`${address}, ${city}, ${state}`);
        const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

        const res = await fetch(url, {
            headers: { 'User-Agent': 'ViroquaBusinessGuide/1.0 (enrichment@viroqua.guide)' }
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
// EXTRACTION FUNCTIONS
// ============================================

async function extractEmail(page: Page): Promise<string | null> {
    try {
        // Try mailto links first
        const mailtoHref = await page.$eval('a[href^="mailto:"]', (el) =>
            el.getAttribute('href')
        ).catch(() => null);

        if (mailtoHref) {
            const email = mailtoHref.replace('mailto:', '').split('?')[0];
            if (email.includes('@')) return email;
        }

        // Try footer text containing @
        const footerText = await page.$eval('footer', el => el.textContent || '').catch(() => '');
        const emailMatch = footerText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) return emailMatch[0];

        // Try schema.org
        const schemaEmail = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script[type="application/ld+json"]');
            for (const script of scripts) {
                try {
                    const data = JSON.parse(script.textContent || '{}');
                    if (data.email) return data.email;
                    if (data['@graph']) {
                        for (const item of data['@graph']) {
                            if (item.email) return item.email;
                        }
                    }
                } catch { }
            }
            return null;
        });
        if (schemaEmail) return schemaEmail;

    } catch (e) {
        // Silently fail
    }
    return null;
}

async function extractDescription(page: Page): Promise<string | null> {
    try {
        // Priority 1: Meta description
        const metaDesc = await page.$eval('meta[name="description"]', el =>
            el.getAttribute('content')
        ).catch(() => null);
        if (metaDesc && metaDesc.length > 50) return metaDesc;

        // Priority 2: OG description
        const ogDesc = await page.$eval('meta[property="og:description"]', el =>
            el.getAttribute('content')
        ).catch(() => null);
        if (ogDesc && ogDesc.length > 50) return ogDesc;

        // Priority 3: First meaningful paragraph
        const heroP = await page.$eval('main p, [class*="hero"] p, [class*="about"] p', el =>
            el.textContent?.trim()
        ).catch(() => null);
        if (heroP && heroP.length > 50 && heroP.length < 500) return heroP;

    } catch (e) { }
    return null;
}

async function extractLogo(page: Page): Promise<string | null> {
    try {
        // Try header logo
        const headerLogo = await page.$eval('header img[alt*="logo" i], header img[class*="logo"]', el =>
            el.getAttribute('src')
        ).catch(() => null);
        if (headerLogo) return new URL(headerLogo, page.url()).href;

        // Try any logo class
        const anyLogo = await page.$eval('img[class*="logo"], img[alt*="logo" i]', el =>
            el.getAttribute('src')
        ).catch(() => null);
        if (anyLogo) return new URL(anyLogo, page.url()).href;

        // Try favicon as fallback
        const favicon = await page.$eval('link[rel*="icon"]', el =>
            el.getAttribute('href')
        ).catch(() => null);
        if (favicon) return new URL(favicon, page.url()).href;

    } catch (e) { }
    return null;
}

async function extractTagline(page: Page): Promise<string | null> {
    try {
        // Try subtitle near logo
        const subtitle = await page.$eval('header h2, [class*="tagline"], [class*="subtitle"], [class*="slogan"]', el =>
            el.textContent?.trim()
        ).catch(() => null);
        if (subtitle && subtitle.length > 10 && subtitle.length < 150) return subtitle;

    } catch (e) { }
    return null;
}

async function extractOpeningHours(page: Page): Promise<Record<string, string> | null> {
    try {
        // Try schema.org first
        const schemaHours = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script[type="application/ld+json"]');
            for (const script of scripts) {
                try {
                    const data = JSON.parse(script.textContent || '{}');
                    if (data.openingHours) return { raw: data.openingHours };
                    if (data.openingHoursSpecification) {
                        const hours: Record<string, string> = {};
                        for (const spec of data.openingHoursSpecification) {
                            const days = Array.isArray(spec.dayOfWeek) ? spec.dayOfWeek : [spec.dayOfWeek];
                            for (const day of days) {
                                const dayName = day.replace('http://schema.org/', '').replace('https://schema.org/', '');
                                hours[dayName] = `${spec.opens} - ${spec.closes}`;
                            }
                        }
                        return hours;
                    }
                } catch { }
            }
            return null;
        });
        if (schemaHours) return schemaHours;

    } catch (e) { }
    return null;
}

async function extractYearEstablished(page: Page): Promise<number | null> {
    try {
        const bodyText = await page.evaluate(() => document.body.innerText);

        const patterns = [
            /est\.?\s*(19|20)\d{2}/i,
            /since\s*(19|20)\d{2}/i,
            /founded\s*(19|20)\d{2}/i,
            /established\s*(19|20)\d{2}/i,
        ];

        for (const pattern of patterns) {
            const match = bodyText.match(pattern);
            if (match) {
                const yearMatch = match[0].match(/(19|20)\d{2}/);
                if (yearMatch) return parseInt(yearMatch[0]);
            }
        }

        // Try schema.org
        const schemaYear = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script[type="application/ld+json"]');
            for (const script of scripts) {
                try {
                    const data = JSON.parse(script.textContent || '{}');
                    if (data.foundingDate) return new Date(data.foundingDate).getFullYear();
                } catch { }
            }
            return null;
        });
        if (schemaYear) return schemaYear;

    } catch (e) { }
    return null;
}

async function extractSocialLinks(page: Page): Promise<{ instagram?: string; facebook?: string }> {
    const result: { instagram?: string; facebook?: string } = {};

    try {
        const links = await page.$$eval('a[href]', (anchors) =>
            anchors.map(a => a.getAttribute('href')).filter(Boolean)
        );

        for (const link of links) {
            if (link?.includes('instagram.com') && !result.instagram) {
                result.instagram = link;
            }
            if (link?.includes('facebook.com') && !result.facebook) {
                result.facebook = link;
            }
        }
    } catch (e) { }

    return result;
}

async function extractBookingAndMenu(page: Page): Promise<{ booking?: string; menu?: string }> {
    const result: { booking?: string; menu?: string } = {};

    try {
        const links = await page.$$eval('a[href]', (anchors) =>
            anchors.map(a => ({
                href: a.getAttribute('href'),
                text: (a.textContent || '').toLowerCase()
            }))
        );

        for (const { href, text } of links) {
            if (!href) continue;

            // Booking links
            if ((text.includes('book') || text.includes('reserve') || text.includes('appointment')) && !result.booking) {
                result.booking = new URL(href, page.url()).href;
            }

            // Menu links
            if ((text.includes('menu') || href.includes('menu') || href.endsWith('.pdf')) && !result.menu) {
                result.menu = new URL(href, page.url()).href;
            }
        }
    } catch (e) { }

    return result;
}

async function extractCertifications(page: Page): Promise<string[]> {
    const certs: string[] = [];

    try {
        const bodyText = await page.evaluate(() => document.body.innerText.toLowerCase());

        const certKeywords: Record<string, string> = {
            'usda organic': 'organic',
            'certified organic': 'organic',
            'organic': 'organic',
            'b-corp': 'b-corp',
            'b corporation': 'b-corp',
            'fair trade': 'fair-trade',
            'fairtrade': 'fair-trade',
            'non-gmo': 'non-gmo',
            'woman-owned': 'woman-owned',
            'minority-owned': 'minority-owned',
            'veteran-owned': 'veteran-owned',
            'locally sourced': 'locally-sourced',
            'farm-to-table': 'farm-to-table',
        };

        for (const [keyword, cert] of Object.entries(certKeywords)) {
            if (bodyText.includes(keyword) && !certs.includes(cert)) {
                certs.push(cert);
            }
        }
    } catch (e) { }

    return certs;
}

async function extractHeroImage(page: Page): Promise<string | null> {
    try {
        // Try OG image first
        const ogImage = await page.$eval('meta[property="og:image"]', el =>
            el.getAttribute('content')
        ).catch(() => null);
        if (ogImage) return ogImage;

        // Try first large image
        const heroImg = await page.$eval('main img, [class*="hero"] img, section:first-of-type img', el =>
            el.getAttribute('src')
        ).catch(() => null);
        if (heroImg) return new URL(heroImg, page.url()).href;

    } catch (e) { }
    return null;
}

// ============================================
// MAIN ENRICHMENT FUNCTION
// ============================================

async function enrichBusiness(page: Page, business: BusinessToEnrich): Promise<EnrichedData> {
    const enriched: EnrichedData = {};

    if (!business.website) {
        console.log(`   ⚠️ No website for ${business.name}, skipping web extraction`);

        // Still try geocoding if we have an address
        if (business.address && business.city && business.state && !business.latitude) {
            const coords = await geocodeAddress(business.address, business.city, business.state);
            if (coords) {
                enriched.latitude = coords.lat;
                enriched.longitude = coords.lng;
            }
        }

        return enriched;
    }

    try {
        console.log(`   🌐 Visiting ${business.website}`);
        await page.goto(business.website, { waitUntil: 'domcontentloaded', timeout: CONFIG.timeout });
        await delay(1000); // Let page settle

        // Extract all data
        if (!business.email) {
            enriched.email = await extractEmail(page);
        }

        if (!business.description) {
            enriched.description = await extractDescription(page);
        }

        enriched.logo_url = await extractLogo(page);
        enriched.tagline = await extractTagline(page);
        enriched.opening_hours = await extractOpeningHours(page);
        enriched.year_established = await extractYearEstablished(page);

        const socials = await extractSocialLinks(page);
        enriched.instagram_url = socials.instagram;
        enriched.facebook_url = socials.facebook;

        const bookingMenu = await extractBookingAndMenu(page);
        enriched.booking_url = bookingMenu.booking;
        enriched.menu_url = bookingMenu.menu;

        enriched.certifications = await extractCertifications(page);
        enriched.hero_image_url = await extractHeroImage(page);

        // Geocode if missing
        if (business.address && business.city && business.state && !business.latitude) {
            const coords = await geocodeAddress(business.address, business.city, business.state);
            if (coords) {
                enriched.latitude = coords.lat;
                enriched.longitude = coords.lng;
            }
        }

    } catch (e) {
        console.log(`   ❌ Failed to load ${business.website}: ${(e as Error).message}`);
    }

    return enriched;
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
    console.log('\n🔬 VIROQUA BUSINESS ENRICHMENT SCRIPT');
    console.log('=====================================\n');

    // Fetch businesses that need enrichment
    const { data: businesses, error } = await supabase
        .from('businesses')
        .select('id, name, website, address, city, state, description, email, latitude')
        .or('description.is.null,email.is.null,latitude.is.null')
        .order('name');

    if (error) {
        console.error('❌ Failed to fetch businesses:', error);
        return;
    }

    console.log(`📊 Found ${businesses?.length || 0} businesses needing enrichment\n`);

    if (!businesses || businesses.length === 0) {
        console.log('✅ All businesses are fully enriched!');
        return;
    }

    // Launch browser
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: CONFIG.userAgent,
        viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();

    let enrichedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < businesses.length; i++) {
        const business = businesses[i] as BusinessToEnrich;
        console.log(`\n[${i + 1}/${businesses.length}] ${business.name}`);

        try {
            const enriched = await enrichBusiness(page, business);

            // Only update if we found new data
            const hasNewData = Object.values(enriched).some(v =>
                v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : true)
            );

            if (hasNewData) {
                // Clean up empty values
                const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
                for (const [key, value] of Object.entries(enriched)) {
                    if (value !== undefined && value !== null && (Array.isArray(value) ? value.length > 0 : true)) {
                        updateData[key] = value;
                    }
                }

                const { error: updateError } = await supabase
                    .from('businesses')
                    .update(updateData)
                    .eq('id', business.id);

                if (updateError) {
                    console.log(`   ❌ Update failed: ${updateError.message}`);
                    errorCount++;
                } else {
                    const fields = Object.keys(updateData).filter(k => k !== 'updated_at');
                    console.log(`   ✅ Updated: ${fields.join(', ')}`);
                    enrichedCount++;
                }
            } else {
                console.log(`   ⏭️ No new data found`);
            }

        } catch (e) {
            console.log(`   ❌ Error: ${(e as Error).message}`);
            errorCount++;
        }

        // Rate limiting
        if (i < businesses.length - 1) {
            await randomDelay();
        }
    }

    await browser.close();

    console.log('\n=====================================');
    console.log(`🏁 ENRICHMENT COMPLETE`);
    console.log(`   ✅ Enriched: ${enrichedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   ⏭️ Skipped: ${businesses.length - enrichedCount - errorCount}`);
}

main().catch(console.error);
