# Category Mapping & Taxonomy

This document outlines the strategy for mapping raw data from various sources (Chamber, VEDA, Viroqua Public Market) to our standardized database taxonomy.

## Database Taxonomy

The following categories are currently defined in the `categories` table. Each business must be associated with exactly one of these IDs.

| Name | Slug | UUID |
| :--- | :--- | :--- |
| Accounting and Tax Services | accounting | `8c5dcfe7-eb11-4771-a5d3-796ac08b557a` |
| Agri-Business | agri-business | `5f30d35d-b248-4691-b9d6-2008b6f97be4` |
| Agriculture & Food Systems | agriculture | `fb1f5ff2-a615-4162-ae30-5215b8c076b8` |
| Antiques & Collectibles | antiques | `c7c633ff-1d77-4e97-96d6-c48f6fb64aaa` |
| Arts, Culture & Entertainment | arts-culture | `4cbc2621-d336-4cae-9a6d-88e6fe593fe4` |
| Automotive Sales/Repair | automotive | `f6874e62-87e6-4418-b252-399b42fdd024` |
| Bookstores | bookstores | `93d7bf73-8630-40a4-965e-21e3a424f7b0` |
| Boutiques & Fashion | fashion | `2ada8ad8-cc15-46e4-ba1b-1f6aa74512e8` |
| Business Development & Consulting | consulting | `4ffb378a-b6c7-4ecc-8b49-839ea94c5bf8` |
| Catering | catering | `44a6eb22-8a8d-48bf-83a4-c7787da86921` |
| Civic & Institutional | civic | `2f07e554-b2ba-4c16-942f-be843be7a765` |
| Cleaning & Laundry Services | cleaning | `cda536d5-4a23-4a75-95c3-354c3fb3b888` |
| Cocktails & Bars | bars | `0f38e4cb-6821-4cd7-878f-2ff7bb01b2eb` |
| Coffee Shops & Roasteries | coffee | `6d1652c9-052c-4f3e-a711-edd9ff28da60` |
| Community | community | `a9e53d32-9bc6-46b5-b9ef-bd63cd50521b` |
| Computers & IT | it | `87ec64f0-8bab-4a0a-8d87-0f23eb75df23` |
| Construction | construction | `0cc2f779-b87e-4c52-b5f1-aa924a648ae7` |
| Dental Clinics | dental | `7995ef49-7681-4279-8472-a4f664539665` |
| Dining (Full Service) | dining | `3361e27a-e450-4bad-a092-e30df154b1db` |
| Dining & Hospitality | hospitality | `bfca9124-a932-4532-bc6b-7ffc87538b59` |
| Eat & Drink | eat-drink | `4293998b-bc99-4f9d-8371-4969f1771d71` |
| Elder Care & Nursing | elder-care | `44a6eb22-8a8d-48bf-83a4-c7787da86921` |
| Energy & Utilities | energy | `8f28-4444-a7bc-06d146a90d89` |
| Family Services | family | `e450-4bad-a092-e30df154b1db` |
| Farm, Home, and Garden | farm-garden | `c7c633ff-1d77-4e97-96d6-c48f6fb64aaa` |
| Financial Management | financial | `8c5dcfe7-eb11-4771-a5d3-796ac08b557a` |
| Galleries | galleries | `4cbc2621-d336-4cae-9a6d-88e6fe593fe4` |
| Health and Wellness | health | `fcc1bf03-f114-4bb7-be9f-114bb7be9fe` |
| Home & Lifestyle | lifestyle | `5b1d9adc-8d23-4bd1-8439-e6ce12d9cbfd` |
| Home Goods | home-goods | `5b1d9adc-8d23-4bd1-8439-e6ce12d9cbfd` |
| Hospitals & Specialized Clinics | hospitals | `fcc1bf03-f114-4bb7-be9f-114bb7be9fe` |
| Insurance Agencies | insurance | `9cd3eed4-79ad-47ad-9261-66c2583dab85` |
| Legal Services | legal | `7cd04104-0841-406a-9463-8e818bdea291` |
| Local Food Producers | producers | `fb1f5ff2-a615-4162-ae30-5215b8c076b8` |
| Media & Marketing | media | `afb5dec9-03e0-4fc8-8517-44574e10e651` |
| Museums | museums | `4cbc2621-d336-4cae-9a6d-88e6fe593fe4` |
| Non-Profits | non-profits | `a9e53d32-9bc6-46b5-b9ef-bd63cd50521b` |
| Nurseries & Greenhouse | nurseries | `fb1f5ff2-a615-4162-ae30-5215b8c076b8` |
| Organic Cooperatives | organic-coops | `fb1f5ff2-a615-4162-ae30-5215b8c076b8` |
| Outdoor Recreation & Gear | outdoor | `5b1d9adc-8d23-4bd1-8439-e6ce12d9cbfd` |
| Personal Care & Wellness | wellness | `fcc1bf03-f114-4bb7-be9f-114bb7be9fe` |
| Pet Care & Veterinary | pets | `30a4-965e-21e3a424f7b0` |
| Print and Copy Services | print | `3855df31-fbac-46b5-929e-e1728d4c28fd` |
| Professional Services | professional-services | `7cd04104-0841-406a-9463-8e818bdea291` |
| Real Estate Agencies | real-estate | `9cd3eed4-79ad-47ad-9261-66c2583dab85` |
| Salons & Spas | spas | `587ad48b-3d02-41b4-8747-ed4405b48120` |
| Schools & Colleges | schools | `212e90ed-47b3-475e-a94f-21d5d4e2d5a8` |
| Services | services | `27017832-0a9d-47aa-984d-e5c4a6a3c1e2` |
| Shopping & Retail | shopping-and-retail | `5b1d9adc-8d23-4bd1-8439-e6ce12d9cbfd` |
| Software & Web Development | software | `2235d3fc-bfb7-41fb-b381-a902a6cfa291` |
| Specialty Retail | specialty-retail | `5a742634-7567-4687-ad89-56c3408ac9de` |
| Sweets & Bakeries | bakeries | `d1d3635e-aabb-45b3-92cb-79bba15c1a08` |
| Technology | technology | `afb5dec9-03e0-4fc8-8517-44574e10e651` |
| Telecommunications | telecom | `a69b986d-8f28-4444-a7bc-06d146a90d89` |
| Theatres | theatres | `1e13b689-9d84-44a9-b4fa-d5a7dcbbd031` |
| Trade & Maintenance | trade | `ffa5ff7a-434a-4811-87bc-7aa05d760f46` |
| Viroqua Public Market Merchants | public-market | `00a0ccaa-71df-406c-bde6-c73184ab7aba` |
| Wholesale Distribution | wholesale | `2a5f9042-4b9d-4635-bcb3-c96356dabf15` |
| Wineries & Distilleries | wineries | `0323298b-bc99-4f9d-8371-4969f1771d71` |

## Mapping Logic

The mapping is handled in `src/scraper/config.ts` via the `CATEGORY_MAP` constant.

### 1. Exact Match
If the raw category string exactly matches a key in `CATEGORY_MAP`, that UUID is used.

### 2. Multi-Pass Scoring Heuristic
If no exact match is found, the `resolveCategory` function in `src/scraper/3-clean.ts` uses keywords from the business name and description to assign a category based on weightings.

### 3. Fallbacks
- If a business looks like a retail shop but doesn't have a specific category, it defaults to `Shopping & Retail`.
- If a business looks like a service provider, it defaults to `Professional Services`.
- Total failure results in `Uncategorized` (mapped to `Services` or `Professional Services` depending on setup).

## Improvement Plan

Currently, many specific categories are empty because the Chamber's raw taxonomy is broad (e.g., "Services"). To populate empty categories:
1. Identify high-frequency keywords for empty categories (e.g., "Accountant", "Tax" for `Accounting and Tax Services`).
2. Add these to the heuristic resolver.
3. Update `CATEGORY_MAP` to include common aliases found in raw data.
