import { EnrichedBusiness, ProcessedBusiness } from './types';
import { CATEGORY_MAP, CATEGORY_RULES, VIROQUA_CONFIG } from './config';

export function cleanAndNormalize(biz: EnrichedBusiness): ProcessedBusiness {
    // 1. Normalize Phone
    let cleanPhone: string | null = null;
    if (biz.raw_phone) {
        const digits = biz.raw_phone.replace(/\D/g, '');
        if (digits.length === 10) {
            cleanPhone = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        } else {
            cleanPhone = biz.raw_phone; // Keep original if not 10 digits
        }
    }

    // 2. Map Category (Scoring System)
    const catId = resolveCategory(biz.raw_category, biz.name, biz.description);

    // 3. Address Cleanup
    let fullAddr = biz.raw_address;
    if (fullAddr && !fullAddr.toLowerCase().includes('viroqua')) {
        fullAddr = `${fullAddr}, ${VIROQUA_CONFIG.city}, ${VIROQUA_CONFIG.state} ${VIROQUA_CONFIG.zip}`;
    }

    return {
        name: biz.name,
        slug: biz.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category_id: catId,
        address: fullAddr,
        city: VIROQUA_CONFIG.city,
        state: VIROQUA_CONFIG.state,
        zip: VIROQUA_CONFIG.zip,
        phone: cleanPhone,
        website: biz.website,
        description: biz.description,
        opening_hours: null, // Default null
        owner_principal: biz.dfi_principal || null,
        social_links: {
            facebook: biz.facebook_url,
            instagram: biz.instagram_url
        },
        logo_url: biz.logo_url
    };
}

export function resolveCategory(rawCat: string, name: string, description: string | null): string {
    // 1. Try Exact Match First in the Map
    if (CATEGORY_MAP[rawCat]) return CATEGORY_MAP[rawCat];

    // 2. Keyword Scoring against all CATEGORY_RULES
    const scoring = CATEGORY_RULES.map(rule => ({
        id: rule.id,
        score: 0,
        keywords: rule.keywords
    }));

    const rawCatLower = rawCat.toLowerCase();
    const nameLower = name.toLowerCase();
    const descLower = description?.toLowerCase() || '';

    for (const rule of scoring) {
        for (const kw of rule.keywords) {
            if (rawCatLower.includes(kw)) rule.score += 5;
            if (nameLower.includes(kw)) rule.score += 3;
            if (descLower.includes(kw)) rule.score += 1;
        }
    }

    // Sort by Score DESC
    scoring.sort((a, b) => b.score - a.score);

    if (scoring[0].score > 0) {
        return scoring[0].id;
    }

    // 3. Fallback
    return CATEGORY_MAP['FALLBACK_SERVICES'];
}
