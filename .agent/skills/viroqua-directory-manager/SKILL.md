---
name: viroqua-directory-manager
description: Manages the Viroqua Business Directory database. Use this to audit, scrape, verify, or insert business listings into Supabase.
---

# Goal
Ensure the Viroqua Business Directory stays accurate, follows the established Schema, and adheres to the PRD (Product Requirements Document).

# Instructions
1. **Schema Compliance**: Every business entry must include: `name`, `address`, `phone`, `website`, `instagram_url`, `facebook_url`, `opening_hours` (JSONB), and `latitude/longitude`.
2. **Category Mapping**: Always map a business to the most specific "Leaf" category (e.g., use 'Coffee Shops' instead of just 'Eat & Drink'). 
3. **Data Verification**: Cross-reference scraped data against the Wisconsin DFI (Department of Financial Institutions) for legal owner names and active status.
4. **Formatting**: 
   - Normalize phone numbers to (XXX) XXX-XXXX.
   - Generate URL-safe slugs (lowercase, hyphens for spaces).
   - Convert text-based hours (e.g., "Mon-Fri 9-5") into structured JSON: `{"mon": "09:00-17:00", ...}`.

# Constraints
- DO NOT hallucinate business data. If a field is missing, leave it NULL or mark it for manual review.
- DO NOT create duplicate businesses; check for existing slugs before inserting.
