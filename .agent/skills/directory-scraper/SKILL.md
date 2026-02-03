---
name: viroqua-directory-scraper
description: "Specialized logic for harvesting, enriching, and verifying Viroqua, WI business data for the Supabase directory."
---

# Mission
Autonomous extraction and normalization of local business data from diverse sources (Chamber, VEDA, Public Market) while ensuring 100% schema compliance.

# Core Instructions
1. **Source Discovery**: Always reference `docs/SCRAPER_MANIFEST.md` for target URLs and source-specific priorities.
2. **Data Integrity**: 
   - **Hours**: Parse raw strings into structured JSONB: `{"day": "HH:MM-HH:MM"}`. 
   - **Socials**: Deep-crawl business homepages for `facebook.com` and `instagram.com` handles.
   - **Verification**: Cross-reference names against the **Wisconsin DFI** to flag dissolved entities or verify legal owners.
3. **Resilience**: 
   - Use a **1-3 second randomized delay** between requests to avoid IP bans.
   - Capture a screenshot on failure and log the specific CSS selector that failed.

# Constraints
- DO NOT insert duplicate businesses (check `slug` uniqueness via Supabase MCP).
- DO NOT hallucinate geo-coordinates; if a lookup fails, mark as `NULL`.
- Maintain the **Sector -> Group -> Category** hierarchy defined in the `categories` table.
