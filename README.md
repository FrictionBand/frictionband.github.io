# Friction Band Helsinki Website

Source for [frictionband.github.io](https://frictionband.github.io) — the website of the Friction Groove Collective, a Helsinki-based afrobeat / ethio-jazz / cumbia band.

The site is bilingual (English + Finnish), statically generated, and rebuilds itself nightly so that "upcoming gigs" stay current without anyone pushing a commit.

## Tech stack

- **[Eleventy (11ty)](https://www.11ty.dev/)** — static site generator
- **[Nunjucks](https://mozilla.github.io/nunjucks/)** — layouts, partials, shortcodes
- **Markdown** — page and gig content (with YAML frontmatter)
- **[Tailwind CSS](https://tailwindcss.com/)** + `@tailwindcss/typography` — styling
- **[Tobii](https://github.com/midzer/tobii)** — image lightbox for galleries
- **[Luxon](https://moment.github.io/luxon/)** — date handling (Finnish locale)
- **[eleventy-plugin-embed-everything](https://www.npmjs.com/package/eleventy-plugin-embed-everything)** — auto-embed YouTube / Spotify / etc.
- **Cloudflare Pages** — build + hosting
- **GitHub Actions** — nightly rebuild trigger

## Quick start

In VSCode, when prompted, reopen the project in a Dev Container (or open it via GitHub Codespaces). Then:

```bash
npm install   # only needed the first time
npm run dev
```

This starts Tailwind in watch mode, Eleventy in watch mode, and a local server in parallel. Open the URL printed by the `serve` step.

> **Why `serve` instead of Eleventy's built-in `--serve`?** The `serve` package supports HTTP range requests, which the audio player needs for seeking.

### NPM scripts

| Script | What it does |
|---|---|
| `npm run dev` | Tailwind watch + Eleventy watch + local server (parallel) |
| `npm run build` | Production build of CSS and site into `_site/` |
| `npm run build:css` | Tailwind only (rarely needed by hand) |

If you ever need the exact command Cloudflare runs:

```bash
npx tailwindcss -i src/assets/css/input.css -o _site/assets/css/tailwind.css --minify && npx @11ty/eleventy
```

## Project structure

```
src/
├── _data/
│   ├── site.json          # global metadata (title, description, slogan)
│   ├── i18n.js            # all UI strings, keyed by locale (en/fi)
│   └── enRedirects.js     # legacy /en/* → / redirects
├── _includes/
│   ├── base.njk           # outer HTML shell
│   ├── page.njk           # standard page layout
│   ├── gig.njk            # individual gig page layout
│   ├── partials/          # _navigation, _footer, _hero, _contact_form, _video, _social
│   ├── shortcodes/        # templates rendered by JS shortcodes (e.g. gigs.njk)
│   └── svg/               # inline SVGs
├── en/                    # English pages (home, contact, concerts, about, jam, presskit, legal, thank-you)
├── fi/                    # Finnish pages (mirror of en/, with Finnish slugs)
├── pages/
│   ├── dynamic/           # default frontmatter for dynamic pages (tags + layout)
│   └── special/           # default frontmatter + the /archive/ page
├── gigs/                  # one markdown file per gig — see "Adding a gig"
├── assets/
│   ├── css/input.css      # Tailwind entry point
│   ├── js/                # client-side JS (passed through verbatim)
│   ├── audio/             # press-kit audio
│   ├── videos/            # hero videos
│   ├── images/
│   │   ├── gigs/          # gig hero images and gallery photos
│   │   ├── jams/          # jam photos
│   │   └── placeholders/  # gig/jam placeholder images (auto-picked when no heroImage)
│   └── favicon/
└── en-redirect.njk        # generates the legacy redirect pages from enRedirects.js
```

## Bilingual setup (en/fi)

- All translatable UI strings live in [src/_data/i18n.js](src/_data/i18n.js), keyed by locale.
- Each language has its own folder ([src/en/](src/en/), [src/fi/](src/fi/)) with its own slugs (`/concerts/` vs `/fi/konsertit/`).
- A page's frontmatter sets `lang: en` or `lang: fi`; the navigation builds itself from the matching collection (`pagesEn` / `pagesFi`).
- The `gigs` shortcode auto-detects the page language from its URL prefix (`/fi/...`).
- `src/_data/enRedirects.js` lists legacy `/en/*` paths that should 301 to the canonical `/` URLs.

## Adding content

### Add a gig

Create `src/gigs/YYYY-MM-DD-slug.md`:

```yaml
---
title: "Event Title"
date: 2026-09-15
time: "20:00 - 23:00"
location: "Venue Name, City"
gmaps: https://maps.app.goo.gl/...
# Optional:
shortDescription: "One-line teaser shown on cards"
heroImage: /assets/images/gigs/your-photo.jpg   # otherwise a placeholder is auto-picked
fblink: https://facebook.com/events/...
weblink: https://example.com/event
price: "20 eur"   # free text ("Admission free"); shown on the single gig page only, not on cards
type: jam       # set this for jam-session entries; omit for normal gigs
featured: true  # highlights the card
archived: false
---
Event description in Markdown.
```

The gig appears automatically on the home page under "Upcoming Gigs" once its date is today or later. Past gigs disappear automatically — the nightly Cloudflare rebuild keeps the listings honest without manual deletion.

If you don't supply `heroImage`, a placeholder is picked deterministically (djb2 hash of the gig URL) from `src/assets/images/placeholders/gigs/` (or `placeholders/jams/` when `type: jam`). The same gig always gets the same placeholder.

### Add a page

Drop a markdown file into [src/en/](src/en/) (and a Finnish counterpart into [src/fi/](src/fi/)). Use this frontmatter shape:

```yaml
---
title: New Page
permalink: /new-page/
order: 5            # position in the nav
hidden: false       # true to keep it off the nav but still build it
lang: en            # or fi
heroImage: /assets/images/...
---
```

Default `layout` and `tags` come from the parent folder's `*.json` data file, so you usually don't need to set them.

### Add a UI string

Add the key to **both** `en` and `fi` blocks in [src/_data/i18n.js](src/_data/i18n.js), then reference it from a template as `{{ i18n[page.lang].path.to.key }}`.

## Custom shortcodes

All registered in [.eleventy.js](.eleventy.js).

| Shortcode | Usage | Purpose |
|---|---|---|
| `gigs` | `{% gigs limit, showDescription, heading, type, linkCards, moreUrl %}` | Renders upcoming gig cards. `limit=0` shows all. Set `type="jam"` to filter to jam sessions. `moreUrl` adds a "see all →" link when there are more than `limit` items. |
| `gallery` | `{% gallery "/path/a.jpg", "/path/b.jpg", … %}` | Masonry gallery of images, wired to the Tobii lightbox. Uses CSS `columns` (no Masonry.js needed). |
| `contact` | `{% contact "Get in touch" %}` | JS-revealed contact button (anti-scrape: only appears when JS runs). |
| `link_button` | `{% link_button "/path/", "Label" %}` | Standard primary-coloured link button. |
| `cta` | `{% cta "/path/", "Link label", "Contact label" %}` | Link button + contact button side by side. |
| `noscript_text` | `{% noscript_text "Email us at …" %}` | Fallback text shown only when JS is disabled. |
| `right` | `{% right %}content{% endright %}` | Paired shortcode that right-aligns its body. |

## Collections & filters

Defined in [.eleventy.js](.eleventy.js).

**Collections**

| Name | What's in it |
|---|---|
| `pages` | Everything tagged `pages`, sorted by `order` |
| `pagesEn` / `pagesFi` | Same, filtered by `lang` — used to build per-language navigation |
| `gigs` | All files in `src/gigs/` |
| `gallery` | Images auto-discovered from `src/assets/images/gigs/` and `…/jams/` |

**Filters**

| Name | What it does |
|---|---|
| `filterTodayOrLater` | Keeps items with date ≥ today (day-level comparison) |
| `filterFutureDates` | Keeps strictly future items (millisecond-level) |
| `filterNonArchived` | Drops items with `archived: true` |
| `postDate` | Formats a JS date in Finnish locale (`DD.MM.YYYY`) |
| `newlineToBreak` | Replaces `\n` with `<br>` |
| `filenameNoExt` | Strips the extension off a filename |

## Styling notes

- Tailwind input is [src/assets/css/input.css](src/assets/css/input.css); output is built into `_site/assets/css/tailwind.css` via an `eleventy.before` hook so it's always fresh on build.
- The brand colour is aliased as `primary` in [tailwind.config.js](tailwind.config.js) — change it there, not in individual templates.
- Class-based dark mode is enabled (`class="dark"` on root toggles it).
- Tailwind only scans `.njk` and `.md` files, so any class string that's only present inside JavaScript shortcodes (e.g. the buttons rendered by the `contact` / `cta` shortcodes) **must** be added to the `safelist` in `tailwind.config.js` — otherwise it gets purged in production.

## Deployment

The site is built and hosted by **Cloudflare Pages**, which rebuilds automatically on every push to `main`.

A GitHub Actions workflow ([.github/workflows/nightly-build.yml](.github/workflows/nightly-build.yml)) also pings a Cloudflare deploy hook every night at 00:00 UTC, so that "upcoming gigs" filtering stays current without anyone pushing. It can also be triggered manually from the Actions tab.

The hook URL is stored in the `CF_DEPLOY_HOOK_URL` repo secret. To rotate it:

1. In the Cloudflare Pages project → Settings → Builds & deployments → Deploy hooks, create a new hook for the `main` branch.
2. Update the `CF_DEPLOY_HOOK_URL` secret in GitHub → Settings → Secrets and variables → Actions.
3. Delete the old hook in Cloudflare.

## TODO

### Whole site / general

- Check the same photos aren't reused in several places, organize photos
- Translate any remaining English-only pages to Finnish

### Single gig page

- Footer with small band bio for search engines and embedding (like Umo)
