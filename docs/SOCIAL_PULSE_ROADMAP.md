# Social Pulse Roadmap

This document outlines the strategy for wiring the **Viroqua Social Pulse** view with live social media content from local businesses at zero (or minimal) cost.

---

## 🎯 Goal

Replace the current mock data in `src/data/mock-social.ts` with a live feed of recent Instagram and Facebook posts from businesses listed in our Supabase `businesses` table.

---

## 📊 Current State

| Component | Status |
|---|---|
| `PulseView.tsx` | ✅ Implemented (uses mock data) |
| `PulseCard.tsx` | ✅ Implemented (links to social profiles) |
| `PulseFilterBar.tsx` | ✅ Implemented (filters by niche) |
| `businesses.instagram_url` | ✅ Column exists in Supabase |
| `businesses.facebook_url` | ✅ Column exists in Supabase |
| Live data integration | ❌ Not implemented |

---

## 🛤️ Phased Implementation Strategy

### Phase 1: Curated Feed (Week 1) — *Current State*
**Cost:** $0  
**Effort:** Low  
**Sustainability:** Indefinite  

Maintain the current approach where content is manually curated. This is similar to a "Community Board" at a local newspaper.

#### Tasks:
- [ ] Create a `community_updates` table in Supabase:
  ```sql
  create table community_updates (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid references businesses(id),
    post_url text not null,
    caption text,
    image_url text,
    source text check (source in ('instagram', 'facebook')),
    posted_at timestamp with time zone,
    created_at timestamp with time zone default now()
  );
  ```
- [ ] Build a simple admin form (or use Supabase Studio) to paste in post URLs.
- [ ] Update `PulseView.tsx` to fetch from `community_updates` instead of mock data.

---

### Phase 2: oEmbed Integration (Week 2-3)
**Cost:** $0  
**Effort:** Medium  
**Sustainability:** High  

Use Instagram and Facebook's official oEmbed endpoints to render embedded posts.

#### How It Works:
1.  When a curator adds a post URL, the system calls the oEmbed API.
2.  The returned HTML is stored and rendered inside a `PulseCard`.

#### oEmbed Endpoints:
| Platform | Endpoint |
|---|---|
| Instagram | `https://api.instagram.com/oembed?url={POST_URL}` |
| Facebook | `https://www.facebook.com/plugins/post/oembed.json/?url={POST_URL}` |

#### Tasks:
- [ ] Create a utility function `fetchOEmbed(url: string)` that calls the appropriate endpoint.
- [ ] Store the `html` and `thumbnail_url` in the `community_updates` table.
- [ ] Create a new `PulseEmbedCard.tsx` component that renders the embed HTML.
- [ ] Add a toggle in `PulseView` to switch between "Native Card" and "Embed" views.

#### Considerations:
- oEmbed styling is controlled by Instagram/Facebook, not us. It may not match our "Artisan Modern" aesthetic.
- Embeds require the Instagram/Facebook SDK scripts to be loaded on the page.

---

### Phase 3: Business Self-Connect (Month 2+)
**Cost:** $0  
**Effort:** High  
**Sustainability:** Highest  

Allow businesses to connect their own Instagram accounts via the **Instagram Basic Display API**. This is the only fully automated, free, and Terms-of-Service-compliant approach.

#### How It Works:
1.  Create a `/connect` page in the app.
2.  Business owners click "Connect Instagram" and are redirected to Instagram's OAuth flow.
3.  Upon authorization, we receive a **User Access Token** scoped to their account.
4.  We store the token in a `business_connections` table.
5.  A nightly Supabase Edge Function iterates through connected businesses and fetches their latest posts.

#### Required Supabase Schema:
```sql
create table business_connections (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) unique,
  platform text check (platform in ('instagram', 'facebook')),
  access_token text not null,
  token_expires_at timestamp with time zone,
  connected_at timestamp with time zone default now()
);

create table social_posts (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id),
  external_id text unique,
  media_url text,
  permalink text,
  caption text,
  media_type text, -- IMAGE, VIDEO, CAROUSEL_ALBUM
  posted_at timestamp with time zone,
  fetched_at timestamp with time zone default now()
);
```

#### Tasks:
- [ ] Register an app in the [Meta Developer Portal](https://developers.facebook.com/).
- [ ] Implement Instagram Basic Display API OAuth flow in `/app/api/auth/instagram/route.ts`.
- [ ] Create the `/connect` page UI.
- [ ] Store access tokens securely (consider encryption).
- [ ] Build a Supabase Edge Function (`sync-social-posts`) to fetch posts nightly.
- [ ] Handle token refresh (tokens expire every 60 days; use the refresh endpoint).
- [ ] Update `PulseView.tsx` to fetch from `social_posts`.

#### API Reference:
- [Instagram Basic Display API Docs](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Token Refresh Endpoint](https://developers.facebook.com/docs/instagram-basic-display-api/reference/refresh_access_token)

---

## 🚫 Approaches to Avoid

| Method | Why to Avoid |
|---|---|
| **Direct Scraping** | Violates Instagram/Facebook ToS. IPs get banned within hours. |
| **Third-Party Scrapers (Apify, RapidAPI)** | Costs $5-20/month and relies on fragile, unofficial methods. |
| **Browser Automation (Playwright)** | Same issues as scraping—blocked quickly behind CAPTCHAs. |

---

## 📦 Recommended Libraries

| Library | Purpose |
|---|---|
| `@supabase/supabase-js` | Database client |
| `next-auth` or custom OAuth | Handling Instagram OAuth flow |
| `react-plock` | Masonry grid layout (already installed) |
| `framer-motion` | Animations (already installed) |

---

## 📅 Timeline Summary

| Phase | Target | Outcome |
|---|---|---|
| **Phase 1** | Week 1 | Curated posts visible in Pulse |
| **Phase 2** | Week 2-3 | Official embeds for richer content |
| **Phase 3** | Month 2+ | Fully automated, business-connected feed |

---

## 🔗 Related Files

- `src/components/social-pulse/PulseView.tsx` — Main view component
- `src/data/mock-social.ts` — Current mock data (to be replaced)
- `docs/CATEGORY_MAPPING.md` — Category reference for filtering
