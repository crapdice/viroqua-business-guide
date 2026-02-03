# Category Mapping & Keyword Guide

This document serves as the primary reference for the `directory-scraper` skill. It maps Supabase category IDs to their human-readable names and provides keyword associations for fuzzy matching logic.

## 🧠 Fuzzy Match Logic

When a scraped business does not have an exact category match in the `RawBusiness` object:
1.  **Normalize** the input text (combine name, raw category, and description).
2.  **Score** the text against the `associated_keywords` for each category below.
    *   Exact keyword match: +5 points
    *   Partial match: +1 point
3.  **Assign** the `category_id` with the highest score.
4.  **Fallback**: If no score > 0, assign to `Professional Services` (ID: `7cd04104-0841-406a-9463-8e818bdea291`).

## 📂 Category Map (JSON)

```json
[
  {
    "slug": "accounting-tax-services",
    "name": "Accounting and Tax Services",
    "id": "8c5dcfe7-eb11-4771-a5d3-796ac08b557a",
    "associated_keywords": ["accountant", "cpa", "tax", "bookkeeping", "payroll", "audit", "financial report"]
  },
  {
    "slug": "agri-business",
    "name": "Agri-Business",
    "id": "5f30d35d-b248-4691-b9d6-2008b6f97be4",
    "associated_keywords": ["farm", "agriculture", "supply", "feed", "seed", "tractor", "implement", "agronomy"]
  },
  {
    "slug": "agriculture-food-systems",
    "name": "Agriculture & Food Systems",
    "id": "fb1f5ff2-a615-4162-ae30-5215b8c076b8",
    "associated_keywords": ["food system", "sustainable", "regenerative", "organic", "grower", "producer", "food hub"]
  },
  {
    "slug": "antiques-collectibles",
    "name": "Antiques & Collectibles",
    "id": "c7c633ff-1d77-4e97-96d6-c48f6fb64aaa",
    "associated_keywords": ["antique", "vintage", "collectible", "retro", "thrift", "historic items", "memorabilia"]
  },
  {
    "slug": "arts-culture-entertainment",
    "name": "Arts, Culture & Entertainment",
    "id": "4cbc2621-d336-4cae-9a6d-88e6fe593fe4",
    "associated_keywords": ["art", "music", "entertainment", "culture", "creative", "performance", "studio"]
  },
  {
    "slug": "automotive-sales-repair",
    "name": "Automotive Sales/Repair",
    "id": "f6874e62-87e6-4418-b252-399b42fdd024",
    "associated_keywords": ["auto", "car", "truck", "repair", "mechanic", "oil change", "tire", "dealership", "collision"]
  },
  {
    "slug": "bookstores",
    "name": "Bookstores",
    "id": "93d7bf73-8630-40a4-965e-21e3a424f7b0",
    "associated_keywords": ["book", "read", "literature", "novel", "textbook", "magazine", "library"]
  },
  {
    "slug": "boutiques-fashion",
    "name": "Boutiques & Fashion",
    "id": "2ada8ad8-cc15-46e4-ba1b-1f6aa74512e8",
    "associated_keywords": ["boutique", "clothing", "fashion", "apparel", "wear", "dress", "shirt", "style"]
  },
  {
    "slug": "business-development-consulting",
    "name": "Business Development & Consulting",
    "id": "4ffb378a-b6c7-4ecc-8b49-839ea94c5bf8",
    "associated_keywords": ["consulting", "strategy", "business", "development", "management", "coaching", "advisor"]
  },
  {
    "slug": "catering",
    "name": "Catering",
    "id": "44a6eb22-8a8d-48bf-83a4-c7787da86921",
    "associated_keywords": ["cater", "event food", "wedding food", "party platter", "buffet", "private chef"]
  },
  {
    "slug": "civic-institutional",
    "name": "Civic & Institutional",
    "id": "2f07e554-b2ba-4c16-942f-be843be7a765",
    "associated_keywords": ["government", "city", "county", "public", "library", "post office", "chamber", "association"]
  },
  {
    "slug": "cleaning-laundry-services",
    "name": "Cleaning & Laundry Services",
    "id": "cda536d5-4a23-4a75-95c3-354c3fb3b888",
    "associated_keywords": ["cleaning", "laundry", "dry clean", "maid", "janitorial", "wash", "housekeeping"]
  },
  {
    "slug": "cocktails-bars",
    "name": "Cocktails & Bars",
    "id": "0f38e4cb-6821-4cd7-878f-2ff7bb01b2eb",
    "associated_keywords": ["bar", "pub", "cocktail", "lounge", "drink", "tavern", "saloon", "beer"]
  },
  {
    "slug": "coffee-shops-roasteries",
    "name": "Coffee Shops & Roasteries",
    "id": "6d1652c9-052c-4f3e-a711-edd9ff28da60",
    "associated_keywords": ["coffee", "cafe", "roastery", "espresso", "latte", "bean", "brew", "tea"]
  },
  {
    "slug": "community",
    "name": "Community",
    "id": "a9e53d32-9bc6-46b5-b9ef-bd63cd50521b",
    "associated_keywords": ["community", "center", "gathering", "local", "neighbors", "social"]
  },
  {
    "slug": "computers-it",
    "name": "Computers & IT",
    "id": "87ec64f0-8bab-4a0a-8d87-0f23eb75df23",
    "associated_keywords": ["computer", "it", "tech", "repair", "network", "software", "hardware", "data"]
  },
  {
    "slug": "construction-manufacturing",
    "name": "Construction & Manufacturing",
    "id": "0cc2f779-b87e-4c52-b5f1-aa924a648ae7",
    "associated_keywords": ["construction", "build", "contractor", "manufacturing", "industrial", "fabrication", "concrete"]
  },
  {
    "slug": "dental-clinics",
    "name": "Dental Clinics",
    "id": "282d3a9a-9ed7-4e67-8d2a-3a8afb0c6387",
    "associated_keywords": ["dentist", "dental", "teeth", "orthodontist", "oral", "smile", "hygiene"]
  },
  {
    "slug": "dining-full-service",
    "name": "Dining (Full Service)",
    "id": "6638885d-d230-4fe4-8114-d114bb7be9fe",
    "associated_keywords": ["restaurant", "dining", "dinner", "supper club", "steakhouse", "bistro", "sit down"]
  },
  {
    "slug": "dining-hospitality",
    "name": "Dining & Hospitality",
    "id": "bfca9124-a932-4532-bc6b-7ffc87538b59",
    "associated_keywords": ["hospitality", "hotel", "inn", "motel", "bed and breakfast", "lodging", "stay", "accommodation"]
  },
  {
    "slug": "eat-drink",
    "name": "Eat & Drink",
    "id": "79a9626d-6812-4a28-87c3-3f65a9d08ecf",
    "associated_keywords": ["eat", "food", "drink", "snack", "meal", "beverage", "fast food"]
  },
  {
    "slug": "family-services",
    "name": "Family Services",
    "id": "e111ab4d-58b7-4736-a765-d526a1ce0981",
    "associated_keywords": ["family", "child", "care", "youth", "senior", "support", "counseling"]
  },
  {
    "slug": "farm-home-garden",
    "name": "Farm, Home, and Garden",
    "id": "aa514871-49c6-43e7-ab4f-6467fe363eeb",
    "associated_keywords": ["garden", "lawn", "mower", "landscape", "tools", "home improvement", "hardware store"]
  },
  {
    "slug": "financial-management",
    "name": "Financial Management",
    "id": "9105d98f-1a34-4b10-afe2-fb2b64ea5028",
    "associated_keywords": ["finance", "bank", "wealth", "investment", "money", "loan", "advising"]
  },
  {
    "slug": "galleries",
    "name": "Galleries",
    "id": "bd7d6848-eda0-4e34-918a-e2396d1d55b8",
    "associated_keywords": ["gallery", "art display", "exhibit", "painting", "sculpture", "artist"]
  },
  {
    "slug": "health-wellness",
    "name": "Health and Wellness",
    "id": "fcc1bf03-f224-4ff5-8bd5-bf0dd1fe461e",
    "associated_keywords": ["health", "wellness", "fitness", "gym", "yoga", "therapy", "holistic", "healing"]
  },
  {
    "slug": "home-lifestyle",
    "name": "Home & Lifestyle",
    "id": "56c2a212-0dd2-443d-b6a9-7e46a0bacdd6",
    "associated_keywords": ["home", "decor", "lifestyle", "interior", "design", "furniture"]
  },
  {
    "slug": "home-goods",
    "name": "Home Goods",
    "id": "97c33a12-1905-447d-9a09-a1a807c08128",
    "associated_keywords": ["kitchen", "bath", "bedding", "appliance", "utensil", "housewares"]
  },
  {
    "slug": "insurance-agencies",
    "name": "Insurance Agencies",
    "id": "4dd4a68e-c8a0-4d42-8191-3290b63dacec",
    "associated_keywords": ["insurance", "policy", "agent", "coverage", "auto insurance", "home insurance", "life insurance"]
  },
  {
    "slug": "legal-services",
    "name": "Legal Services",
    "id": "7d01743d-c288-48a2-bb41-7c5f1b05b175",
    "associated_keywords": ["law", "legal", "attorney", "lawyer", "firm", "litigation", "court", "counsel"]
  },
  {
    "slug": "local-food-producers",
    "name": "Local Food Producers",
    "id": "f1a56e10-0e45-44f4-9f29-63ddae5755a6",
    "associated_keywords": ["local food", "producer", "maker", "artisan food", "specialty food", "jam", "syrup"]
  },
  {
    "slug": "media-marketing",
    "name": "Media & Marketing",
    "id": "e561a6ea-5e64-4ae7-b190-f08d9675c0f2",
    "associated_keywords": ["marketing", "media", "social media", "advertising", "seo", "web design", "signage"]
  },
  {
    "slug": "medical-clinics",
    "name": "Medical Clinics",
    "id": "75903f7e-1317-48f8-b32b-93ca1c5c06fe",
    "associated_keywords": ["clinic", "medical", "doctor", "physician", "hospital", "urgent care", "patient"]
  },
  {
    "slug": "museums",
    "name": "Museums",
    "id": "c3650dec-c1d5-44a6-bdab-178afced0d37",
    "associated_keywords": ["museum", "history", "exhibition", "heritage", "historical"]
  },
  {
    "slug": "non-profits",
    "name": "Non-Profits",
    "id": "d1a5ffce-fcd0-4db8-8be7-f603766d063f",
    "associated_keywords": ["non-profit", "charity", "foundation", "volunteer", "donate", "cause", "mission"]
  },
  {
    "slug": "nurseries-greenhouse",
    "name": "Nurseries & Greenhouse",
    "id": "8be46d33-3bbf-4dad-a283-56915eba115e",
    "associated_keywords": ["nursery", "greenhouse", "plants", "flowers", "sapling", "gardening"]
  },
  {
    "slug": "organic-cooperatives",
    "name": "Organic Cooperatives",
    "id": "83f6bf70-bf4a-45f0-bd4f-602245c9c707",
    "associated_keywords": ["co-op", "cooperative", "organic", "member-owned", "natural food"]
  },
  {
    "slug": "outdoor-recreation-gear",
    "name": "Outdoor Recreation & Gear",
    "id": "b9372d7d-037a-46f8-b02f-e2ec89b14402",
    "associated_keywords": ["outdoor", "recreation", "gear", "bike", "hike", "kayak", "canoe", "camping", "ski"]
  },
  {
    "slug": "personal-care-wellness",
    "name": "Personal Care & Wellness",
    "id": "ce48899e-171d-49f4-86f3-29b2eb77866e",
    "associated_keywords": ["personal care", "soap", "body", "cosmetics", "skin", "hair", "beauty"]
  },
  {
    "slug": "pet-care-veterinary",
    "name": "Pet Care & Veterinary",
    "id": "ddae8b50-3cf3-416f-92dc-88143de3576b",
    "associated_keywords": ["pet", "vet", "veterinary", "dog", "cat", "animal", "grooming", "boarding"]
  },
  {
    "slug": "print-copy-services",
    "name": "Print and Copy Services",
    "id": "3855df31-fbac-46b5-929e-e1728d4c28fd",
    "associated_keywords": ["print", "copy", "fax", "scan", "design", "brochure", "business card"]
  },
  {
    "slug": "professional-services",
    "name": "Professional Services",
    "id": "7cd04104-0841-406a-9463-8e818bdea291",
    "associated_keywords": ["professional", "service", "consultant", "expert", "specialist"]
  },
  {
    "slug": "real-estate-agencies",
    "name": "Real Estate Agencies",
    "id": "9cd3eed4-79ad-47ad-9261-66c2583dab85",
    "associated_keywords": ["real estate", "realtor", "home for sale", "property", "broker", "agent", "housing"]
  },
  {
    "slug": "salons-spas",
    "name": "Salons & Spas",
    "id": "587ad48b-3d02-41b4-8747-ed4405b48120",
    "associated_keywords": ["salon", "spa", "haircut", "nails", "massage", "facial", "barber"]
  },
  {
    "slug": "schools-colleges",
    "name": "Schools & Colleges",
    "id": "212e90ed-47b3-475e-a94f-21d5d4e2d5a8",
    "associated_keywords": ["school", "college", "university", "education", "student", "class", "teach"]
  },
  {
    "slug": "services",
    "name": "Services",
    "id": "27017832-0a9d-47aa-984d-e5c4a6a3c1e2",
    "associated_keywords": ["general service", "miscellaneous", "other"]
  },
  {
    "slug": "shopping-retail",
    "name": "Shopping & Retail",
    "id": "5b1d9adc-8d23-4bd1-8439-e6ce12d9cbfd",
    "associated_keywords": ["shop", "store", "buy", "retail", "market", "mall", "purchase"]
  },
  {
    "slug": "software-web-development",
    "name": "Software & Web Development",
    "id": "2235d3fc-bfb7-41fb-b381-a902a6cfa291",
    "associated_keywords": ["software", "web dev", "app", "programming", "coding", "developer", "saas"]
  },
  {
    "slug": "specialty-retail",
    "name": "Specialty Retail",
    "id": "5a742634-7567-4687-ad89-56c3408ac9de",
    "associated_keywords": ["specialty", "unique", "gift", "hobby", "niche"]
  },
  {
    "slug": "sweets-bakeries",
    "name": "Sweets & Bakeries",
    "id": "d1d3635e-aabb-45b3-92cb-79bba15c1a08",
    "associated_keywords": ["bakery", "sweet", "candy", "dessert", "cake", "cookie", "donut", "pastry"]
  },
  {
    "slug": "technology",
    "name": "Technology",
    "id": "afb5dec9-03e0-4fc8-8517-44574e10e651",
    "associated_keywords": ["technology", "tech", "digital", "electronic", "innovation"]
  },
  {
    "slug": "telecommunications",
    "name": "Telecommunications",
    "id": "a69b986d-8f28-4444-a7bc-06d146a90d89",
    "associated_keywords": ["telecom", "phone", "internet", "wireless", "cable", "communication"]
  },
  {
    "slug": "theatres",
    "name": "Theatres",
    "id": "1e13b689-9d84-44a9-b4fa-d5a7dcbbd031",
    "associated_keywords": ["theatre", "theater", "cinema", "movie", "play", "stage", "acting"]
  },
  {
    "slug": "trade-maintenance",
    "name": "Trade & Maintenance",
    "id": "ffa5ff7a-434a-4811-87bc-7aa05d760f46",
    "associated_keywords": ["plumber", "electrician", "hvac", "maintenance", "repair", "handyman", "trade"]
  },
  {
    "slug": "viroqua-public-market-merchants",
    "name": "Viroqua Public Market Merchants",
    "id": "00a0ccaa-71df-406c-bde6-c73184ab7aba",
    "associated_keywords": ["public market", "market vendor", "merchant", "stall"]
  },
  {
    "slug": "wholesale-distribution",
    "name": "Wholesale Distribution",
    "id": "2a5f9042-4b9d-4635-bcb3-c96356dabf15",
    "associated_keywords": ["wholesale", "distribution", "distributor", "supply chain", "bulk"]
  },
  {
    "slug": "wineries-distilleries",
    "name": "Wineries & Distilleries",
    "id": "0323298b-bc99-4f9d-8371-4969f1771d71",
    "associated_keywords": ["winery", "distillery", "vineyard", "wine", "spirits", "brewery", "tasting"]
  }
]
```
