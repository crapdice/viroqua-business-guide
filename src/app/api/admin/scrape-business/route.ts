import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface ScrapedBusiness {
    name: string | null;
    description: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    phone: string | null;
    email: string | null;
    website: string;
    hero_image_url: string | null;
    instagram_url: string | null;
    facebook_url: string | null;
    suggested_category_id: string | null;
    suggested_category_name: string | null;
}

// Common patterns for extracting data
const PHONE_REGEX = /(?:\+1[-.\s]?)?(?:\(?[0-9]{3}\)?[-.\s]?)?[0-9]{3}[-.\s]?[0-9]{4}/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const ADDRESS_REGEX = /\d+\s+[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Way|Court|Ct|Circle|Cir)[\s,]+(?:Suite|Ste|Apt|#)?[\s\d]*,?\s*[\w\s]+,?\s*(?:WI|Wisconsin)\s*\d{5}/gi;

// Category keywords for suggestion
const CATEGORY_KEYWORDS: Record<string, string[]> = {
    'restaurants': ['restaurant', 'dining', 'food', 'eat', 'cuisine', 'bistro', 'cafe', 'grill', 'kitchen', 'pizza', 'burger', 'sushi', 'mexican', 'italian', 'chinese', 'thai'],
    'coffee-shops': ['coffee', 'espresso', 'cafe', 'latte', 'roast', 'brew', 'tea', 'bakery'],
    'bars': ['bar', 'brewery', 'pub', 'tavern', 'beer', 'wine', 'cocktail', 'spirits', 'taproom'],
    'retail': ['shop', 'store', 'retail', 'boutique', 'gifts', 'clothing', 'apparel', 'jewelry', 'antique'],
    'health-wellness': ['health', 'wellness', 'spa', 'massage', 'yoga', 'fitness', 'gym', 'chiropractic', 'therapy', 'healthcare', 'clinic', 'dental', 'medical'],
    'arts-culture': ['art', 'gallery', 'museum', 'theater', 'music', 'studio', 'creative', 'craft', 'artist'],
    'services': ['service', 'repair', 'cleaning', 'plumbing', 'electric', 'contractor', 'lawyer', 'attorney', 'accounting', 'insurance', 'real estate'],
    'lodging': ['hotel', 'motel', 'inn', 'lodge', 'bed and breakfast', 'b&b', 'cabin', 'vacation rental', 'airbnb', 'accommodation'],
    'outdoor-recreation': ['outdoor', 'hiking', 'biking', 'camping', 'kayak', 'canoe', 'fishing', 'hunting', 'adventure', 'nature', 'trail'],
    'farms-agriculture': ['farm', 'organic', 'produce', 'dairy', 'meat', 'vegetables', 'greenhouse', 'nursery', 'garden', 'csa'],
};

function extractFromHTML(html: string): Partial<ScrapedBusiness> {
    const result: Partial<ScrapedBusiness> = {};

    // Extract JSON-LD structured data (most reliable)
    const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
    if (jsonLdMatch) {
        try {
            const jsonLd = JSON.parse(jsonLdMatch[1]);
            const data = Array.isArray(jsonLd) ? jsonLd[0] : jsonLd;

            if (data['@type'] === 'LocalBusiness' || data['@type'] === 'Restaurant' || data['@type'] === 'Organization') {
                result.name = data.name || null;
                result.description = data.description || null;
                result.phone = data.telephone || null;
                result.email = data.email || null;
                result.hero_image_url = data.image?.url || data.image || null;

                if (data.address) {
                    const addr = typeof data.address === 'string' ? data.address : data.address;
                    if (typeof addr === 'object') {
                        result.address = addr.streetAddress || null;
                        result.city = addr.addressLocality || null;
                        result.state = addr.addressRegion || null;
                        result.zip = addr.postalCode || null;
                    }
                }

                if (data.sameAs) {
                    const socialLinks = Array.isArray(data.sameAs) ? data.sameAs : [data.sameAs];
                    socialLinks.forEach((link: string) => {
                        if (link.includes('instagram.com')) result.instagram_url = link;
                        if (link.includes('facebook.com')) result.facebook_url = link;
                    });
                }
            }
        } catch (e) {
            // JSON-LD parsing failed, continue with other methods
        }
    }

    // Extract Open Graph / Meta tags
    if (!result.name) {
        const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
        const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        result.name = ogTitle?.[1] || titleTag?.[1]?.split('|')[0]?.split('-')[0]?.trim() || null;
    }

    if (!result.description) {
        const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
        const metaDesc = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
        result.description = ogDesc?.[1] || metaDesc?.[1] || null;
    }

    if (!result.hero_image_url) {
        const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
        result.hero_image_url = ogImage?.[1] || null;
    }

    // Extract social links from page
    if (!result.instagram_url) {
        const igMatch = html.match(/https?:\/\/(?:www\.)?instagram\.com\/[a-zA-Z0-9_.]+/i);
        result.instagram_url = igMatch?.[0] || null;
    }

    if (!result.facebook_url) {
        const fbMatch = html.match(/https?:\/\/(?:www\.)?facebook\.com\/[a-zA-Z0-9.]+/i);
        result.facebook_url = fbMatch?.[0] || null;
    }

    // Extract phone and email from page text
    if (!result.phone) {
        const phones = html.match(PHONE_REGEX);
        if (phones && phones.length > 0) {
            result.phone = phones[0].replace(/[^\d]/g, '').replace(/^1/, '');
            if (result.phone.length === 10) {
                result.phone = `(${result.phone.slice(0, 3)}) ${result.phone.slice(3, 6)}-${result.phone.slice(6)}`;
            }
        }
    }

    if (!result.email) {
        const emails = html.match(EMAIL_REGEX);
        result.email = emails?.[0] || null;
    }

    // Try to extract address
    if (!result.address) {
        const addresses = html.match(ADDRESS_REGEX);
        if (addresses && addresses.length > 0) {
            const fullAddr = addresses[0];
            result.address = fullAddr.split(',')[0]?.trim() || null;
            // Basic parsing - could be improved
            const zipMatch = fullAddr.match(/\d{5}/);
            result.zip = zipMatch?.[0] || null;
            result.state = 'WI';
            result.city = 'Viroqua'; // Default for this directory
        }
    }

    return result;
}

async function suggestCategory(text: string, categories: { id: string; name: string; slug: string }[]): Promise<{ id: string; name: string } | null> {
    const lowerText = text.toLowerCase();

    let bestMatch: { id: string; name: string; score: number } | null = null;

    for (const category of categories) {
        const keywords = CATEGORY_KEYWORDS[category.slug] || [];
        let score = 0;

        for (const keyword of keywords) {
            if (lowerText.includes(keyword)) {
                score += 1;
            }
        }

        // Also check category name itself
        if (lowerText.includes(category.name.toLowerCase())) {
            score += 2;
        }

        if (score > 0 && (!bestMatch || score > bestMatch.score)) {
            bestMatch = { id: category.id, name: category.name, score };
        }
    }

    return bestMatch ? { id: bestMatch.id, name: bestMatch.name } : null;
}

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url || typeof url !== 'string') {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Normalize URL
        let normalizedUrl = url.trim();
        if (!normalizedUrl.startsWith('http')) {
            normalizedUrl = 'https://' + normalizedUrl;
        }

        // Fetch the webpage
        const response = await fetch(normalizedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Failed to fetch URL: ${response.status}` }, { status: 400 });
        }

        const html = await response.text();

        // Extract business data
        const extracted = extractFromHTML(html);
        extracted.website = normalizedUrl;

        // Get categories for suggestion
        const { data: categories } = await supabase
            .from('categories')
            .select('id, name, slug');

        // Suggest category based on page content
        const searchText = `${extracted.name || ''} ${extracted.description || ''} ${html.slice(0, 5000)}`;
        const suggestedCategory = categories ? await suggestCategory(searchText, categories) : null;

        const result: ScrapedBusiness = {
            name: extracted.name || null,
            description: extracted.description || null,
            address: extracted.address || null,
            city: extracted.city || 'Viroqua',
            state: extracted.state || 'WI',
            zip: extracted.zip || null,
            phone: extracted.phone || null,
            email: extracted.email || null,
            website: normalizedUrl,
            hero_image_url: extracted.hero_image_url || null,
            instagram_url: extracted.instagram_url || null,
            facebook_url: extracted.facebook_url || null,
            suggested_category_id: suggestedCategory?.id || null,
            suggested_category_name: suggestedCategory?.name || null,
        };

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Scrape error:', error);
        return NextResponse.json({ error: error.message || 'Failed to scrape URL' }, { status: 500 });
    }
}
