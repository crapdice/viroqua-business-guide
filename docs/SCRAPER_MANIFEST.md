# Viroqua Business Guide: Scraper Manifest

## 1. Primary Target: The "Harvest" Source
**URL:** [https://www.viroquachamber.com/business/member-directory/](https://www.viroquachamber.com/business/member-directory/)

**Method:** Paginated crawl of the member directory.

**Data Points to Extract:**
- `name`: Listing Title.
- `raw_category`: Listing Category (to be mapped to our IDs).
- `address`: Physical address (Street, City, State, Zip).
- `phone`: Contact number.
- `website`: External URL.
- `description`: Short/Long descriptions.
- `latitude` / `longitude`: Extract from map link or geocode address.

## 2. Secondary Target: The "Hidden" Artisan Source
**URL:** [https://www.veda-wi.org/veda-projects/food-enterprise-center/](https://www.veda-wi.org/veda-projects/food-enterprise-center/)

**Method:** Scrape the tenant list of the Food Enterprise Center.

**Value:** Captures businesses that are wholesale-focused or don't have a retail storefront.

**Data Points to Extract:** Business Name, Suite Number, and Industry Type.

## 3. Tertiary Target: The "Micro-Vendor" Source
**URL:** [https://www.viroquapublicmarket.com/](https://www.viroquapublicmarket.com/)

**Method:** Scrape the vendor/merchant pages.

**Value:** Identifies 100+ micro-businesses and artisans operating inside the Public Market.
