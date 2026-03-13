# Site Content Reorganization Plan

## Current State

### Pages

| Page | URL | Status | Purpose |
|---|---|---|---|
| Home | `/` | Exists, mixed/incomplete | Organizer pitch + gigs + TODO placeholder |
| Services | `/services/` | Exists, decent | Organizer detail — formats, differentiators, contact |
| Jams | `/jams/` | Exists, brief | Monthly jam sessions at Cable Factory |
| Press Kit | `/presskit/` | Hidden, placeholder | Stub page, no real content |
| Legal | `/legal/` | Exists | Legal/compliance |

### Current Home Page Flow

1. Hero video with slogan
2. Lead paragraph (organizer pitch)
3. "Looking for something other than a basic cover band?" + event type bullets
4. Differentiator paragraph
5. CTA buttons (Services + Get in touch)
6. YouTube embed
7. Upcoming gigs (`{% gigs %}`)
8. "From Helsinki Across Finland" — **TODO placeholder, not filled in**
9. Photo gallery

### Problems

- Home page mixes all three audiences without clear sections or hierarchy
- The fan audience has no real home — the gigs list is just tacked on after the organizer pitch
- Jammers aren't mentioned at all on the home page
- The "From Helsinki Across Finland" section is a stub — the most impactful social proof content is missing
- No dedicated fan/about page exists despite fans being an identified audience
- Press kit is hidden and empty (not urgent, but noted)
- The CTA buttons come *after* a fairly long read — organizers may bounce before reaching them

---

## Three Audiences

| Audience | Goal on the site | Patience level | Primary destination |
|---|---|---|---|
| **Gig organizers** | Evaluate Friction for booking | Very low — busy professionals | `/services/` |
| **Fans** | See upcoming gigs, follow the band | Medium | Home page, future "About" |
| **Jammers** | Find out about monthly jam sessions | Medium | `/jams/` |

---

## Proposed Structure

### 1. Homepage (`/`)

The home page is the convergence point for all three audiences. The page should be structured top-to-bottom in order of commercial priority, with each section clearly demarcated.

#### Section A — Hero (keep as-is)
- Full-screen background video with slogan overlay
- No change needed technically

#### Section B — Organizer Pitch (above the fold or just below hero)
This is the most commercially important section. Should be **short and fast** — 3–5 seconds to read, then a clear action.

**Content:**
- **Lead line** (keep existing lead paragraph, possibly trim): 1-sentence punchy description of who Friction is and what they offer
- **Event types** (condensed): 3–4 bullet points max, or a very short inline list
- **CTA buttons**: `Book us` / `Get in touch` + `See full details` (→ `/services/`) — these should come *before* any video
- **Video**: One short highlight clip *after* CTAs — for organizers who want to see before reading further

**Current content to keep/move:**
- Keep the lead paragraph (trim slightly)
- Keep the event type bullets (condense to 3–4)
- Move the differentiator paragraph → `/services/` (redundant here)
- Keep the CTA shortcode — but move it *above* the YouTube embed

#### Section C — Fan Zone (middle of page)

Fans scrolling past the organizer section should land here.

**Content:**
- **Upcoming Gigs** — keep `{% gigs 3, false, "Upcoming Gigs" %}` (already works)
- **"Where We've Played"** — fill in the current TODO placeholder with:
  - A short sentence or two about the range of venues (city festivals, clubs, Suomenlinna, etc.)
  - List of notable past appearances: Viaporin Kekri, Cable Factory, Espa Stage, Global Club Nights @ Sampo, Hustlinki collab, etc. (all derivable from gig history)
  - 1–2 "quote" callout(s) if any exist, or a neutral testimonial-style sentence
  - *Note: This section also functions as social proof for organizers who scroll*
- **Photo gallery** — keep the existing `{% gallery %}` shortcode, already positioned here

**New sub-section at the bottom of Section C:**
- Small "About" teaser: 1–2 lines about who the band is + link to a future About/Band page (see below)

#### Section D — Jammer Teaser (bottom of page)

Short, light-touch section. Jammers will scroll to find this; it shouldn't overwhelm the page.

**Content:**
- 2–3 sentence teaser: "We host monthly jam sessions at the Cable Factory..."
- "Join us" button → `/jams/`
- Optionally: the next upcoming jam date (could be pulled from the gigs list if jam gigs are tagged separately)

---

### 2. Services Page (`/services/`) — Organizer Detail

This page should stand on its own for someone arriving directly from a search engine (e.g. "hire a band Helsinki").

**Current content is good** — keep the differentiators, repertoire/package descriptions, and the contact form.

**Suggested improvements:**
- Add a short intro paragraph at the very top (re-orient the page for someone who didn't come from home) — 1–2 sentences
- Move or add a secondary CTA **near the top** (don't make them scroll to the bottom to contact you)
- Add a **"Past performances"** or **"You may have seen us at…"** section with 4–6 notable venues/events from the gig history — this is strong social proof for organizers
- The YouTube embed is already there — good

**Content gaps:**
- No pricing ballpark (optional — depends on commercial preference)
- No testimonials (if any exist, add them)
- No rider/tech spec info (optional, but useful for professional organizers)

---

### 3. Jams Page (`/jams/`) — Jammer Detail

This page should stand alone for someone finding it from a search like "jam session Helsinki" or from Groovehub.

**Current content is decent** but thin. Suggested additions:
- **What to expect**: Brief description of the format — who typically shows up, instruments, skill levels, vibe
- **Upcoming jam dates**: Show the next 2–3 jam sessions (the gig list already contains these — consider adding a filtered gigs shortcode for jams-only, or just use the regular `{% gigs %}` with a note)
- **FAQ or house rules** (short): Do I need to sign up? Can I just listen? What instruments are welcome?
- **Video**: The jam session YouTube video is already there — good
- **Gallery**: Use jam session images from `src/media/site/` (Jam Session Square images, etc.) or `src/media/gallery/` (Jamming-at-Cafe-Konttori image)

---

### 4. New Page: "About" / "The Band" (`/about/`) — Fan + Organizer Credibility

This page doesn't exist yet. It would serve fans who want to know more about the band, and also provide credibility for organizers who want to understand the band's history and profile.

**Content:**
- Band origin story / brief bio (2–3 paragraphs)
- Band members or collective description (no need to list all if it's fluid)
- Musical style and influences (can reuse/expand from services page)
- Notable past performances list (share with services page, not duplicate — or link to each other)
- Photos (`src/media/gallery/` images, especially performance shots)
- Social links / where to follow

**Navigation**: Add "About" to the nav (or call it "Band" — brief, scannable label).

*This page also functions as a lightweight press kit replacement until the real press kit is ready.*

---

## Navigation Changes

Current nav: `Home | Gigs | Services | Jams`

Proposed nav: `Home | Gigs | Services | Jams | About`

- "Gigs" jump link stays (links to `/#gigs`) — it's a useful shortcut
- Add "About" page link once the page is created
- Consider renaming "Services" to "Book Us" — shorter, more action-oriented, clearer for organizers

---

## Content Gaps to Fill

These are the pieces of content that need to be written or gathered before implementation:

| Gap | Where needed | Notes |
|---|---|---|
| "From Helsinki Across Finland" copy | Home (Section C) | Can be drafted from gig history — see list below |
| Notable past gig list | Home + Services | Kekri Festival, Espa Stage, Global Club Nights, Cable Factory, Hustlinki, Galleria Kasvihuone, Kalasatama, Jätkäsaari |
| Band bio / about text | About page | Needs to be written |
| Quote / testimonial | Home + Services | If none exist, a neutral credibility line works |
| Jam session FAQ | Jams page | Short, 3–4 Q&As |
| Jam session gallery | Jams page | Images exist in `src/media/site/` |
| About page photos | About page | Performance images in `src/media/gallery/` |

---

## Implementation Steps (suggested order)

1. **Reorganize `home.md`** — restructure into the 4 sections above, fill in the "From Helsinki" placeholder with real content, add jammer teaser at bottom
2. **Refine `services.md`** — add social proof section (past gigs), add top-of-page CTA
3. **Expand `jams.md`** — add "what to expect", next dates reference, gallery
4. **Create `about.md`** — new page with band bio and past highlights
5. **Update navigation** — add About page, consider renaming Services

---

## Notes on Technical Approach

- All three audience sections on the home page can be implemented in Markdown with existing shortcodes — no new shortcodes needed for steps 1–3
- The `{% gigs %}`, `{% gallery %}`, `{% cta %}`, `{% lead %}`, `{% link_button %}`, and `{% contact %}` shortcodes cover all needed UI elements
- For a jams-only gig filter (step 3, optional), a `type: jam` frontmatter field + new filter could be added to `.eleventy.js`, but it's not strictly necessary — the jam sessions already have recognizable titles
- The About page would use `layout: page`, tagged `pages`, and need an `order` value to slot into the nav
