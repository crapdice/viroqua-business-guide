# Product Requirements Document (PRD): Viroqua Business Guide

To build the "Viroqua Business Guide" the right way, we need a solid foundation. Below is the Product Requirements Document (PRD) and Database Schema.

Think of the PRD as the "Rules of the Game" and the Schema as the "Shelving System" where all your data will live.

## 1. Product Requirements Document (PRD)

### Project Overview
**Vision:** To be the most accurate, user-friendly digital directory for Viroqua, WI, supporting local discovery and economic growth.

**Target Audience:** 
- Residents looking for services.
- Tourists visiting the Driftless region.
- Local business owners.

### Core Features (Phase 1: MVP)
1.  **Search & Filter:** 
    - Users can search by keyword (e.g., "coffee").
    - Filter by Subsector (e.g., "Eat & Drink").
2.  **Business Profiles:** 
    - Each listing includes Name, Address, Phone, Website, Category, and a Brief Description.
3.  **Mobile-First Design:** 
    - 80% of users will access this on their phones while walking down Main Street.
4.  **Map Integration:** 
    - A "View on Map" button for every physical business.

### Future Features (Phase 2)
1.  **Claim Listing:** Allowing owners to verify and update their own info.
2.  **Reviews & Ratings:** Community-driven feedback.
3.  **Event Calendar:** Integration for local events (Farmer's Market, Harvest Fest).

---

## 2. Database Schema ("The Shelving System")

The database is built on **Supabase (PostgreSQL)**.

### A. Businesses (Core Entity)
**Table:** `businesses`
- `id`: UUID (Primary Key)
- `name`: Text
- `slug`: Text (Unique, SEO-friendly)
- `description`: Text (Brief description)
- `category_id`: Foreign Key linking to `categories`
- `address`: Text
- `city`: Text (Default: Viroqua)
- `state`: Text (Default: WI)
- `phone`: Text
- `website`: Text
- `latitude` / `longitude`: Float (For Map Integration)
- `opening_hours`: JSONB (Structured weekly hours)
- `instagram_url`: Text
- `facebook_url`: Text
- `owner_id`: UUID (Nullable, linked to `owners` for Phase 2 claiming)
- `is_active`: Boolean (Default: true)

### B. Categories (Taxonomy)
**Table:** `categories`
- `id`: UUID (Primary Key)
- `name`: Text (e.g., "Eat & Drink", "Retail")
- `slug`: Text (Unique)
- `icon_text`: Text (Emoji or Icon reference)

### C. Owners & Profiles (For Phase 2 Claiming)
**Table:** `profiles` (Public user info)
- `id`: UUID (References Auth Users)
- `full_name`: Text
- `avatar_url`: Text

**Table:** `owners` (Business verification)
- `id`: UUID (References `profiles.id`)
- `contact_email`: Text
- `is_verified`: Boolean

### D. Reviews (For Phase 2)
**Table:** `reviews`
- `id`: UUID
- `business_id`: UUID (FK)
- `user_id`: UUID (FK)
- `rating`: Integer (1-5)
- `comment`: Text
- `created_at`: Timestamp
