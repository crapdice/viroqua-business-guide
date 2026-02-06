# Viroqua Business Guide — Feature Vision Document

> **Thesis:** The Viroqua Business Guide is not a directory. It is a **Digital Main Street**—a living, breathing representation of the community's commerce, culture, and character. Every feature should reinforce the feeling that this platform is *by* Viroqua, *for* Viroqua, and irreplaceable by any generic aggregator.

---

## 🌿 Design Philosophy: "The Driftless Difference"

The Driftless Region of Wisconsin was never flattened by glaciers. Its landscape is ancient, rumpled, and unique. Our product should feel the same way:

*   **Organic over Corporate:** Warm typography, hand-drawn accents, paper textures.
*   **Slow over Fast:** Encourage exploration, not transaction.
*   **Local over Global:** Every pixel should scream "This is Viroqua."

---

## 📰 Feature 1: The Weekly Bulletin

### The Problem
Yelp tells you a restaurant exists. It doesn't tell you that they just started serving a new seasonal pie, or that a folk band is playing there Friday night. Static directories are *dead* directories.

### The Vision
A curated, editorial-style section on the homepage that highlights 3-5 "happenings" each week. This is the digital equivalent of the bulletin board at the Viroqua Food Co-op.

### What It Looks Like
*   A horizontally scrolling carousel at the top of the homepage, just below the hero.
*   Each card features:
    *   A large, immersive image (the pie, the band, the farm).
    *   A short, punchy headline: "Driftless Cafe Debuts Spring Ramp Risotto"
    *   The business name (linked to their profile).
    *   A date or "This Week" badge.
*   On mobile, the cards stack vertically with swipe gestures.

### Data Model
```sql
CREATE TABLE weekly_highlights (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id uuid REFERENCES businesses(id),
  headline text NOT NULL,
  body text,
  image_url text,
  link_url text,
  starts_at date,
  ends_at date,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);
```

### Email Integration
*   Offer a "Subscribe to the Weekly Bulletin" form.
*   Every Sunday at 6 PM, a Supabase Edge Function or external service (Resend, Loops) sends a digest email.
*   Subject line: "This Week in Viroqua: Ramp Season, Live Jazz, and More"

### Why This Matters
This feature creates a *reason to return* to the site. It positions the Guide as a living publication, not a static database.

---

## 🥾 Feature 2: The Driftless Trail (Curated Itineraries)

### The Problem
A tourist visiting Viroqua for a weekend doesn't want to scroll through 200 businesses. They want someone to tell them: *"Here's how to spend a perfect Saturday."*

### The Vision
Pre-built, thematic "trails" that guide users through a sequence of businesses. Each trail tells a story and provides a cohesive experience.

### Example Trails
| Trail Name | Businesses | Duration |
|---|---|---|
| **The Organic Farm Tour** | Harmony Valley Farm → Viroqua Food Co-op → Driftless Cafe | Full Day |
| **Main Street Art Walk** | Bramble Books → The Gallery → Temple Theatre | 3 Hours |
| **A Day of Coffee & Books** | Wonderstate Coffee → Driftless Books → The Rooted Spoon | Half Day |
| **Family Fun Day** | Public Market → Sidie Hollow Park → Bluedog Cycles | Full Day |
| **Date Night in Viroqua** | Driftless Cafe → Temple Theatre → Rooted Spoon (dessert) | Evening |

### What It Looks Like
*   A `/trails` route with a grid of trail cards.
*   Each trail card shows:
    *   A cover image (composite or hero shot).
    *   Trail name.
    *   Duration estimate ("Half Day", "Full Day").
    *   Number of stops.
*   Clicking a trail opens a detail view with:
    *   A linear "timeline" of stops.
    *   Walking/driving time between each stop.
    *   Insider tips (e.g., "Ask for the off-menu lavender latte").
    *   A "Start Trail" button that opens a mobile-friendly step-by-step view.

### Data Model
```sql
CREATE TABLE trails (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  cover_image_url text,
  duration_estimate text, -- e.g., "Half Day"
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE trail_stops (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trail_id uuid REFERENCES trails(id) ON DELETE CASCADE,
  business_id uuid REFERENCES businesses(id),
  position integer NOT NULL, -- 1, 2, 3...
  tip text, -- Insider tip for this stop
  travel_time_to_next text -- e.g., "5 min walk"
);
```

### Why This Matters
This transforms the Guide from a reference tool into a *travel companion*. It's the kind of local knowledge that only a resident would have—and it's impossible for Google to replicate.

---

## 🎙️ Feature 3: Owner Stories (Video/Audio Bios)

### The Problem
People connect with *people*, not logos or addresses. The soul of Viroqua is its independent business owners—their motivations, their quirks, their origin stories. None of that comes through in a standard directory listing.

### The Vision
Short, authentic video or audio clips (60-90 seconds) embedded on business detail pages where the owner answers simple questions:

*   "Why did you start this business?"
*   "What do you love most about Viroqua?"
*   "What's something most people don't know about [business name]?"

### What It Looks Like
*   On the business detail page, a section titled **"Meet the Owner"**.
*   A rounded video player (or audio waveform if audio-only) with:
    *   The owner's name and title.
    *   A play button with a subtle pulse animation.
*   Fallback: If no video exists, show a static photo with a pull quote.

### Production Notes
*   These do not need to be professionally produced. A smartphone video with natural lighting is *more* authentic.
*   Consider partnering with a local high school media class or UW-La Crosse journalism students to produce these.
*   Store videos on Cloudflare Stream (free tier) or Mux.

### Data Model
```sql
ALTER TABLE businesses ADD COLUMN owner_story_url text;
ALTER TABLE businesses ADD COLUMN owner_story_type text CHECK (owner_story_type IN ('video', 'audio', 'quote'));
ALTER TABLE businesses ADD COLUMN owner_name text;
ALTER TABLE businesses ADD COLUMN owner_pull_quote text;
```

### Why This Matters
This is *un-scrapeable* content. No AI can replicate the warmth of hearing a farmer talk about why they wake up at 4 AM. It builds emotional investment in the local economy.

---

## 🌸 Feature 4: Seasonal Specials Board

### The Problem
Static business hours and addresses are table stakes. Visitors (and locals!) want to know: *"What's new right now?"* A business that updated their info two years ago feels abandoned.

### The Vision
A dedicated "Specials" section on the homepage and on individual business pages. Businesses can submit time-limited promotions that automatically expire.

### Example Specials
*   "🌿 Spring Ramp Risotto — Available until May 15"
*   "☕ Buy 5 Lattes, Get 1 Free — All April"
*   "🎟️ Early Bird Tickets for Driftless Music Fest — $20 until March 1"

### What It Looks Like
*   **Homepage:** A compact "Specials This Week" strip below the Weekly Bulletin.
*   **Business Detail Page:** A highlighted card at the top of the page if the business has an active special.
*   **Badge on Category Cards:** If any business in a category has a special, show a small "🌸 Specials" badge.

### Data Model
```sql
CREATE TABLE specials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  headline text NOT NULL,
  description text,
  image_url text,
  valid_from date DEFAULT CURRENT_DATE,
  valid_until date NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_specials_active ON specials(valid_until) WHERE valid_until >= CURRENT_DATE;
```

### Submission Flow
*   Authenticated business owners can access a `/dashboard` route.
*   A simple form: Headline, Description (optional), Image (optional), End Date.
*   Specials are auto-hidden after `valid_until` passes.

### Why This Matters
This creates urgency and freshness. It gives businesses a reason to log in and update their presence. It makes the Guide feel *alive*.

---

## ❤️ Feature 5: The Locals' Picks (Community Hearts)

### The Problem
Yelp reviews are often written by out-of-towners or cranky one-time visitors. They don't reflect what *locals* actually love. And the star-rating system is reductive—it obscures nuance.

### The Vision
A simple, low-friction "Heart" system. Authenticated users can heart any business. Hearts are tallied and displayed as social proof.

### What It Looks Like
*   A small heart icon on every business card and detail page.
*   Clicking it toggles the heart (requires login; use Supabase Auth with magic link).
*   Display the total heart count: "💚 42 locals love this"
*   A `/picks` route showing a leaderboard: "Most Loved This Month"

### Optional: Micro-Testimonials
Instead of long-form reviews, invite users to complete a sentence:
*   "One thing I love about [Business Name] is..."
*   Max 140 characters. No star ratings. No negativity engine.

### Data Model
```sql
CREATE TABLE hearts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, business_id)
);

CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id),
  business_id uuid REFERENCES businesses(id),
  content text NOT NULL CHECK (char_length(content) <= 140),
  created_at timestamp with time zone DEFAULT now()
);
```

### Why This Matters
Hearts are an expression of *belonging*, not judgment. They let locals signal what's special without the toxicity of traditional review culture.

---

## 🥕 Feature 6: Market Day Mode (Farmer's Market Integration)

### The Problem
The Viroqua Farmer's Market is one of the largest in Wisconsin. It's a cultural anchor. But there's no easy way for visitors to know: *"Who's at the market TODAY?"*

### The Vision
A special `/market` route that transforms the Guide into a live market map on Saturdays.

### What It Looks Like
*   **Before Market Day:** A countdown timer and preview of expected vendors.
*   **On Market Day (Saturday 8 AM - 1 PM):**
    *   A map of the market square with vendor stall locations.
    *   A list of vendors with a "Here Today" badge (green dot).
    *   Vendors can toggle their presence via a simple `/market/checkin` page.
*   **After Market Day:** Reverts to a preview for next week.

### Data Model
```sql
CREATE TABLE market_vendors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  stall_location text, -- e.g., "Row A, Stall 12"
  typical_products text[] -- e.g., ['tomatoes', 'peppers', 'honey']
);

CREATE TABLE market_checkins (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid REFERENCES market_vendors(id),
  market_date date NOT NULL,
  checked_in_at timestamp with time zone DEFAULT now(),
  UNIQUE(vendor_id, market_date)
);
```

### Why This Matters
This is a feature that *only* a hyper-local platform can offer. It turns the Guide into a live, real-time utility during the most important community event of the week.

---

## 📊 Feature 7: Support Local Metrics Dashboard

### The Problem
People like to feel part of something bigger. When they support a local business, they want to know it *matters*.

### The Vision
A public-facing dashboard that celebrates collective local commerce.

### What It Looks Like
*   A `/community` or `/impact` route.
*   Key metrics displayed as large, animated counters:
    *   "Viroqua businesses have been discovered **12,847** times this month."
    *   "**342** people found a new favorite this week."
    *   "**87%** of our listings are locally owned."
*   A "Local Economy Heartbeat" chart showing weekly pageviews by category.
*   Milestone celebrations: "🎉 We just hit 500 hearts this month!"

### Data Model
*   No new tables required—this is derived from analytics.
*   Use Supabase Edge Functions to aggregate pageview counts (or integrate a lightweight analytics tool like Plausible).

### Why This Matters
This gamifies local support. It turns passive browsing into a sense of collective action.

---

## 🗺️ Appendix: Future Explorations

These are not prioritized for MVP but represent the long-term vision:

| Concept | Description |
|---|---|
| **Gift Card Aggregator** | Buy gift cards to multiple Viroqua businesses in one checkout. |
| **Local Job Board** | Businesses post part-time and seasonal openings. |
| **Event Calendar** | Aggregated calendar of community events (synced from Temple Theatre, Co-op, etc.). |
| **Driftless Radio Integration** | Embed the WDRT live stream on the homepage. |
| **"Where to Stay" Trip Planner** | Integration with 217 on Main, local B&Bs, and campgrounds. |
| **Multilingual Support** | Spanish and Hmong translations for accessibility. |

---

## 📅 Implementation Priority Matrix

| Priority | Feature | Effort | Impact | Dependencies |
|:---:|---|---|---|---|
| **1** | Weekly Bulletin | Medium | High | Admin UI for submissions |
| **2** | Curated Trails | Medium | High | None |
| **3** | Seasonal Specials | Low | Medium | Business Auth |
| **4** | Owner Stories | High (content) | Very High | Video hosting |
| **5** | Locals' Picks | Medium | Medium | User Auth |
| **6** | Market Day Mode | Medium | High (seasonal) | Vendor partnerships |
| **7** | Metrics Dashboard | Low | Low | Analytics integration |

---

## 🔗 Related Documents

*   `docs/SOCIAL_PULSE_ROADMAP.md` — Strategy for live social media integration.
*   `docs/CATEGORY_MAPPING.md` — Taxonomy reference for the 41 niches.
*   `src/prototypes/README.md` — Design prototype instructions.
