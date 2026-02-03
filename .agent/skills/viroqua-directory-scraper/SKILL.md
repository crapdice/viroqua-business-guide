---
name: viroqua-directory-scraper
description: Specialized logic for crawling Viroqua-specific business sources and normalizing data for the Supabase schema.
---

# Logic & Workflow
1. **Targeting**: Use `docs/SCRAPER_MANIFEST.md` as the source of truth for URLs and scraping depth.
2. **Resilience**: 
   - If a page fails to load, retry up to 3 times with exponential backoff.
   - If a selector fails (e.g., a website changed its layout), log the error and move to the next item instead of crashing.
3. **Extraction Rules**:
   - **Hours**: Attempt to parse "Mon-Fri 9-5" into a standard JSONB object. If ambiguous, store the raw string in a `raw_hours` metadata field for review.
   - **Socials**: Look specifically for `facebook.com` and `instagram.com` in the footer or header of business websites.
   - **Geocoding**: If a physical address is found, use a geocoding utility to generate `latitude` and `longitude`.
4. **Data Normalization**:
   - Clean whitespace and HTML tags from descriptions.
   - Ensure all URLs start with `https://`.

# Safety Constraints
- **Rate Limiting**: Wait at least 1-2 seconds between requests to avoid overwhelming local business servers.
- **Privacy**: Only scrape publicly available business data. Do not attempt to bypass login screens or access private contact forms.
