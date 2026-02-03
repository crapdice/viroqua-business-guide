export interface RawBusiness {
    source_id: string;
    name: string;
    raw_address: string;
    raw_phone: string | null | undefined;
    website: string | null | undefined;
    raw_category: string;
    description: string | null | undefined;
    source_url: string;
    facebook_url?: string;
    instagram_url?: string;
    raw_hours?: string;
    lat?: number;
    lng?: number;
}

export interface EnrichedBusiness extends RawBusiness {
    dfi_principal?: string;
    logo_url?: string;
}

export interface ProcessedBusiness {
    name: string;
    slug: string;
    category_id: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string | null;
    website: string | null | undefined;
    description: string | null | undefined;
    opening_hours: any | null; // Structured object or null
    owner_principal: string | null;
    social_links: {
        facebook?: string;
        instagram?: string;
    };
    logo_url?: string;
}
