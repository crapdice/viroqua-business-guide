// These UUIDs must match your Supabase database 'categories' table.
// In a production env, fetch these dynamically at runtime to ensure sync.

export const CATEGORY_MAP: Record<string, string> = {
    // Top Level Aliases (for quick lookup)
    'Dining & Hospitality': 'bfca9124-a932-4532-bc6b-7ffc87538b59',
    'Coffee Shops & Roasteries': '6d1652c9-052c-4f3e-a711-edd9ff28da60',
    'Shopping & Retail': '5b1d9adc-8d23-4bd1-8439-e6ce12d9cbfd',
    'Professional Services': '7cd04104-0841-406a-9463-8e818bdea291',
    'Health and Wellness': 'fcc1bf03-f224-4ff5-8bd5-bf0dd1fe461e',
    'Arts, Culture & Entertainment': '4cbc2621-d336-4cae-9a6d-88e6fe593fe4',
    'Trade & Maintenance': 'ffa5ff7a-434a-4811-87bc-7aa05d760f46',

    // Default Fallbacks
    'FALLBACK_SERVICES': '7cd04104-0841-406a-9463-8e818bdea291',
    'FALLBACK_RETAIL': '5b1d9adc-8d23-4bd1-8439-e6ce12d9cbfd'
};

export interface CategoryRule {
    name: string;
    id: string;
    keywords: string[];
}

// Comprehensive Ruleset derived from docs/CATEGORY_MAPPING.md
export const CATEGORY_RULES: CategoryRule[] = [
    { name: "Accounting and Tax Services", id: "8c5dcfe7-eb11-4771-a5d3-796ac08b557a", keywords: ["accountant", "cpa", "tax", "bookkeeping", "payroll", "audit", "financial report"] },
    { name: "Agri-Business", id: "5f30d35d-b248-4691-b9d6-2008b6f97be4", keywords: ["farm", "agriculture", "supply", "feed", "seed", "tractor", "implement", "agronomy"] },
    { name: "Agriculture & Food Systems", id: "fb1f5ff2-a615-4162-ae30-5215b8c076b8", keywords: ["food system", "sustainable", "regenerative", "organic", "grower", "producer", "food hub"] },
    { name: "Antiques & Collectibles", id: "c7c633ff-1d77-4e97-96d6-c48f6fb64aaa", keywords: ["antique", "vintage", "collectible", "retro", "thrift", "historic items", "memorabilia"] },
    { name: "Arts, Culture & Entertainment", id: "4cbc2621-d336-4cae-9a6d-88e6fe593fe4", keywords: ["art", "music", "entertainment", "culture", "creative", "performance", "studio"] },
    { name: "Automotive Sales/Repair", id: "f6874e62-87e6-4418-b252-399b42fdd024", keywords: ["auto", "car", "truck", "repair", "mechanic", "oil change", "tire", "dealership", "collision"] },
    { name: "Bookstores", id: "93d7bf73-8630-40a4-965e-21e3a424f7b0", keywords: ["book", "read", "literature", "novel", "textbook", "magazine", "library"] },
    { name: "Boutiques & Fashion", id: "2ada8ad8-cc15-46e4-ba1b-1f6aa74512e8", keywords: ["boutique", "clothing", "fashion", "apparel", "wear", "dress", "shirt", "style"] },
    { name: "Business Development & Consulting", id: "4ffb378a-b6c7-4ecc-8b49-839ea94c5bf8", keywords: ["consulting", "strategy", "business", "development", "management", "coaching", "advisor"] },
    { name: "Catering", id: "44a6eb22-8a8d-48bf-83a4-c7787da86921", keywords: ["cater", "event food", "wedding food", "party platter", "buffet", "private chef"] },
    { name: "Civic & Institutional", id: "2f07e554-b2ba-4c16-942f-be843be7a765", keywords: ["government", "city", "county", "public", "library", "post office", "chamber", "association"] },
    { name: "Cleaning & Laundry Services", id: "cda536d5-4a23-4a75-95c3-354c3fb3b888", keywords: ["cleaning", "laundry", "dry clean", "maid", "janitorial", "wash", "housekeeping"] },
    { name: "Cocktails & Bars", id: "0f38e4cb-6821-4cd7-878f-2ff7bb01b2eb", keywords: ["bar", "pub", "cocktail", "lounge", "drink", "tavern", "saloon", "beer"] },
    { name: "Coffee Shops & Roasteries", id: "6d1652c9-052c-4f3e-a711-edd9ff28da60", keywords: ["coffee", "cafe", "roastery", "espresso", "latte", "bean", "brew", "tea"] },
    { name: "Community", id: "a9e53d32-9bc6-46b5-b9ef-bd63cd50521b", keywords: ["community", "center", "gathering", "local", "neighbors", "social"] },
    { name: "Computers & IT", id: "87ec64f0-8bab-4a0a-8d87-0f23eb75df23", keywords: ["computer", "it", "tech", "repair", "network", "software", "hardware", "data"] },
    { name: "Construction & Manufacturing", id: "0cc2f779-b87e-4c52-b5f1-aa924a648ae7", keywords: ["construction", "build", "contractor", "manufacturing", "industrial", "fabrication", "concrete"] },
    { name: "Dental Clinics", id: "282d3a9a-9ed7-4e67-8d2a-3a8afb0c6387", keywords: ["dentist", "dental", "teeth", "orthodontist", "oral", "smile", "hygiene"] },
    { name: "Dining (Full Service)", id: "6638885d-d230-4fe4-8114-d114bb7be9fe", keywords: ["restaurant", "dining", "dinner", "supper club", "steakhouse", "bistro", "sit down"] },
    { name: "Dining & Hospitality", id: "bfca9124-a932-4532-bc6b-7ffc87538b59", keywords: ["hospitality", "hotel", "inn", "motel", "bed and breakfast", "lodging", "stay", "accommodation"] },
    { name: "Eat & Drink", id: "79a9626d-6812-4a28-87c3-3f65a9d08ecf", keywords: ["eat", "food", "drink", "snack", "meal", "beverage", "fast food"] },
    { name: "Family Services", id: "e111ab4d-58b7-4736-a765-d526a1ce0981", keywords: ["family", "child", "care", "youth", "senior", "support", "counseling"] },
    { name: "Farm, Home, and Garden", id: "aa514871-49c6-43e7-ab4f-6467fe363eeb", keywords: ["garden", "lawn", "mower", "landscape", "tools", "home improvement", "hardware store"] },
    { name: "Financial Management", id: "9105d98f-1a34-4b10-afe2-fb2b64ea5028", keywords: ["finance", "bank", "wealth", "investment", "money", "loan", "advising"] },
    { name: "Galleries", id: "bd7d6848-eda0-4e34-918a-e2396d1d55b8", keywords: ["gallery", "art display", "exhibit", "painting", "sculpture", "artist"] },
    { name: "Health and Wellness", id: "fcc1bf03-f224-4ff5-8bd5-bf0dd1fe461e", keywords: ["health", "wellness", "fitness", "gym", "yoga", "therapy", "holistic", "healing", "wellness"] },
    { name: "Home & Lifestyle", id: "56c2a212-0dd2-443d-b6a9-7e46a0bacdd6", keywords: ["home", "decor", "lifestyle", "interior", "design", "furniture"] },
    { name: "Home Goods", id: "97c33a12-1905-447d-9a09-a1a807c08128", keywords: ["kitchen", "bath", "bedding", "appliance", "utensil", "housewares"] },
    { name: "Insurance Agencies", id: "4dd4a68e-c8a0-4d42-8191-3290b63dacec", keywords: ["insurance", "policy", "agent", "coverage", "auto insurance", "home insurance", "life insurance"] },
    { name: "Legal Services", id: "7d01743d-c288-48a2-bb41-7c5f1b05b175", keywords: ["law", "legal", "attorney", "lawyer", "firm", "litigation", "court", "counsel"] },
    { name: "Local Food Producers", id: "f1a56e10-0e45-44f4-9f29-63ddae5755a6", keywords: ["local food", "producer", "maker", "artisan food", "specialty food", "jam", "syrup"] },
    { name: "Media & Marketing", id: "e561a6ea-5e64-4ae7-b190-f08d9675c0f2", keywords: ["marketing", "media", "social media", "advertising", "seo", "web design", "signage"] },
    { name: "Medical Clinics", id: "75903f7e-1317-48f8-b32b-93ca1c5c06fe", keywords: ["clinic", "medical", "doctor", "physician", "hospital", "urgent care", "patient"] },
    { name: "Museums", id: "c3650dec-c1d5-44a6-bdab-178afced0d37", keywords: ["museum", "history", "exhibition", "heritage", "historical"] },
    { name: "Non-Profits", id: "d1a5ffce-fcd0-4db8-8be7-f603766d063f", keywords: ["non-profit", "charity", "foundation", "volunteer", "donate", "cause", "mission"] },
    { name: "Nurseries & Greenhouse", id: "8be46d33-3bbf-4dad-a283-56915eba115e", keywords: ["nursery", "greenhouse", "plants", "flowers", "sapling", "gardening"] },
    { name: "Organic Cooperatives", id: "83f6bf70-bf4a-45f0-bd4f-602245c9c707", keywords: ["co-op", "cooperative", "organic", "member-owned", "natural food"] },
    { name: "Outdoor Recreation & Gear", id: "b9372d7d-037a-46f8-b02f-e2ec89b14402", keywords: ["outdoor", "recreation", "gear", "bike", "hike", "kayak", "canoe", "camping", "ski"] },
    { name: "Personal Care & Wellness", id: "ce48899e-171d-49f4-86f3-29b2eb77866e", keywords: ["personal care", "soap", "body", "cosmetics", "skin", "hair", "beauty"] },
    { name: "Pet Care & Veterinary", id: "ddae8b50-3cf3-416f-92dc-88143de3576b", keywords: ["pet", "vet", "veterinary", "dog", "cat", "animal", "grooming", "boarding"] },
    { name: "Print and Copy Services", id: "3855df31-fbac-46b5-929e-e1728d4c28fd", keywords: ["print", "copy", "fax", "scan", "design", "brochure", "business card"] },
    { name: "Professional Services", id: "7cd04104-0841-406a-9463-8e818bdea291", keywords: ["professional", "service", "consultant", "expert", "specialist"] },
    { name: "Real Estate Agencies", id: "9cd3eed4-79ad-47ad-9261-66c2583dab85", keywords: ["real estate", "realtor", "home for sale", "property", "broker", "agent", "housing"] },
    { name: "Salons & Spas", id: "587ad48b-3d02-41b4-8747-ed4405b48120", keywords: ["salon", "spa", "haircut", "nails", "massage", "facial", "barber"] },
    { name: "Schools & Colleges", id: "212e90ed-47b3-475e-a94f-21d5d4e2d5a8", keywords: ["school", "college", "university", "education", "student", "class", "teach"] },
    { name: "Services", id: "27017832-0a9d-47aa-984d-e5c4a6a3c1e2", keywords: ["general service", "miscellaneous", "other"] },
    { name: "Shopping & Retail", id: "5b1d9adc-8d23-4bd1-8439-e6ce12d9cbfd", keywords: ["shop", "store", "buy", "retail", "market", "mall", "purchase"] },
    { name: "Software & Web Development", id: "2235d3fc-bfb7-41fb-b381-a902a6cfa291", keywords: ["software", "web dev", "app", "programming", "coding", "developer", "saas"] },
    { name: "Specialty Retail", id: "5a742634-7567-4687-ad89-56c3408ac9de", keywords: ["specialty", "unique", "gift", "hobby", "niche"] },
    { name: "Sweets & Bakeries", id: "d1d3635e-aabb-45b3-92cb-79bba15c1a08", keywords: ["bakery", "sweet", "candy", "dessert", "cake", "cookie", "donut", "pastry"] },
    { name: "Technology", id: "afb5dec9-03e0-4fc8-8517-44574e10e651", keywords: ["technology", "tech", "digital", "electronic", "innovation"] },
    { name: "Telecommunications", id: "a69b986d-8f28-4444-a7bc-06d146a90d89", keywords: ["telecom", "phone", "internet", "wireless", "cable", "communication"] },
    { name: "Theatres", id: "1e13b689-9d84-44a9-b4fa-d5a7dcbbd031", keywords: ["theatre", "theater", "cinema", "movie", "play", "stage", "acting"] },
    { name: "Trade & Maintenance", id: "ffa5ff7a-434a-4811-87bc-7aa05d760f46", keywords: ["plumber", "electrician", "hvac", "maintenance", "repair", "handyman", "trade"] },
    { name: "Viroqua Public Market Merchants", id: "00a0ccaa-71df-406c-bde6-c73184ab7aba", keywords: ["public market", "market vendor", "merchant", "stall"] },
    { name: "Wholesale Distribution", id: "2a5f9042-4b9d-4635-bcb3-c96356dabf15", keywords: ["wholesale", "distribution", "distributor", "supply chain", "bulk"] },
    { name: "Wineries & Distilleries", id: "0323298b-bc99-4f9d-8371-4969f1771d71", keywords: ["winery", "distillery", "vineyard", "wine", "spirits", "brewery", "tasting"] }
];

export const VIROQUA_CONFIG = {
    city: 'Viroqua',
    state: 'WI',
    zip: '54665',
    geo: {
        lat: 43.5566,
        lng: -90.8887
    }
};
