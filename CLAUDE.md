# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static site for **Friction Groove Collective**, a Helsinki afrobeat / ethio-jazz / cumbia band. Built with [Eleventy 2](https://www.11ty.dev/), Nunjucks, Markdown and Tailwind CSS 3. Source lives in `src/`, output in `_site/` (gitignored). The site is **bilingual (en/fi)** and rebuilds nightly so upcoming-gig listings stay current without commits.

`README.md` is the human-facing counterpart to this file and is kept up to date — prefer updating both when conventions change.

## Commands

```bash
npm install        # first time only (no node_modules is checked in)
npm run dev        # Tailwind watch + Eleventy watch + `serve _site`, all in parallel
npm run build      # production: build:css, then Eleventy → _site/
npm run build:css  # Tailwind only
```

- Dev uses the `serve` package rather than `eleventy --serve` because the sticky audio player needs HTTP range requests.
- There is **no test suite and no linter**. Verifying a change means running `npm run build` and checking it completes without errors, then inspecting `_site/`.
- Tailwind is compiled twice on a full build: once by `build:css`, and again by the `eleventy.before` hook in `.eleventy.js` (which is what Cloudflare relies on). This is intentional redundancy — don't "fix" one by deleting the other without checking the Cloudflare build command.

## Structure

```
src/
├── _data/
│   ├── site.json          # global metadata (title, description, keywords, slogan, url)
│   ├── i18n.js            # every UI string, keyed by locale (en/fi)
│   └── enRedirects.js     # legacy /en/* → / redirect table
├── _includes/
│   ├── base.njk           # HTML shell: head, nav, footer, scripts, audio player bar
│   ├── page.njk           # standard page layout (hero + prose)
│   ├── gig.njk            # single gig page layout (hero + detail box + prose)
│   ├── partials/          # _navigation, _navi_links, _hero, _footer, _contact_form, _video, _social
│   ├── shortcodes/gigs.njk  # template rendered from JS by the `gigs` shortcode
│   └── svg/logo.svg
├── en/                    # English pages + en.json (lang/tags/layout defaults)
├── fi/                    # Finnish mirror + fi.json
├── gigs/                  # one markdown file per gig + gigs.json (layout/tags defaults)
├── pages/                 # LEGACY — only special/archive.njk remains (hidden, /archives/)
├── assets/                # css, js, images, audio, videos, favicon (all passthrough-copied)
└── en-redirect.njk        # paginates enRedirects.js into meta-refresh redirect pages
```

Layout chain: `base.njk` → `page.njk` or `gig.njk` → content. There is no `home.njk`; the home pages use `layout: page` with hero frontmatter.

`src/pages/` is vestigial. `archive.njk` iterates `collections.posts`, which no longer exists, so it renders an empty `/archives/` page. Don't build new work on it.

## Bilingual conventions

- Each language has its own folder with its own file names and **explicit `permalink`** frontmatter: `src/en/concerts.md` → `/concerts/`, `src/fi/konsertit.md` → `/fi/concerts/`. Finnish source filenames are Finnish; Finnish URLs are mostly the English slug under `/fi/`. Always read the frontmatter rather than inferring a URL from a filename.
- `en.json` / `fi.json` directory data files supply `lang`, `tags: pages`, `layout: page`, and `templateEngineOverride: njk,md` (which is what makes shortcodes work inside Markdown). Individual pages rarely need to set these.
- All UI strings go in `src/_data/i18n.js` under **both** `en` and `fi`. Templates read them via `{% set t = i18n[lang] %}`.
- Navigation is built from `collections.pagesEn` / `pagesFi`, sorted by `order`, skipping `hidden: true` and the home entry. The language switcher derives the counterpart URL by adding/removing the `/fi` prefix — so a Finnish page whose permalink is not `/fi` + the English permalink will produce a broken switch link.
- Gigs are **not** translated: one set of files under `src/gigs/`, shown on both language versions. The `gigs` shortcode detects language from `page.url.startsWith('/fi/')`.
- When adding a page, add the counterpart in the other language in the same change.

## Gigs

Create `src/gigs/YYYY-MM-DD-slug.md`. The URL comes from the filename (`/gigs/<filename>/`), so use lowercase-hyphenated names with no spaces. (Two existing files contain a literal " copy" — a mistake, not a pattern to imitate.)

```yaml
---
title: "Event Title"
date: 2026-09-15
time: "20:00 - 23:00"
location: "Venue Name, City"
gmaps: https://maps.app.goo.gl/...
# Optional:
heroImage: /assets/images/gigs/photo.jpg   # else a placeholder is auto-picked
shortDescription: "One-line teaser used on cards"
fblink: https://facebook.com/events/...
weblink: https://example.com/event
type: jam        # jam sessions only; changes placeholder folder and card link target
featured: true   # renders a large full-bleed card instead of the compact one
---
Description in Markdown.
```

Notes:

- Every gig file builds its own page regardless of date; only the **listings** filter by date, at day-level granularity (`item.date >= today`). Past gigs need no cleanup — the nightly rebuild drops them from listings.
- With `type: jam`, gig cards link to the jam-session page (`/jam-session-at-cable-factory/` or the `/fi/` variant) instead of the individual gig page.
- Without `heroImage`, `pickPlaceholder()` in `.eleventy.js` picks deterministically from `src/assets/images/placeholders/gigs/` (or `.../jams/` for jams) using a djb2 hash of the gig URL, so a given gig always shows the same image.

## Collections, filters, shortcodes

All registered in `.eleventy.js`.

**Collections** — `pages` (tag `pages`, sorted by `order`), `pagesEn` / `pagesFi` (same, filtered by `lang`), `gallery` (filesystem scan of `src/assets/images/gigs/` and `.../jams/`). `collections.gigs` is not declared here; it comes from `tags: "gigs"` in `src/gigs/gigs.json`.

**Filters** — `filterTodayOrLater` (date ≥ today, day-level), `filterFutureDates` (strictly future, ms-level), `filterNonArchived`, `postDate` (Luxon, Finnish locale short date), `newlineToBreak`, `filenameNoExt`.

⚠️ `filterNonArchived` keeps only items where `archived === false`, so items that simply omit the field are dropped too. It is currently unused; if you use it, set `archived: false` explicitly.

**Shortcodes**

| Shortcode | Usage |
|---|---|
| `gigs` | `{% gigs limit, showDescription, heading, type, linkCards, moreUrl %}` — upcoming gig cards. `type` is `"jam"` or `""`; `moreUrl` adds a "see all →" link when more items exist than `limit`. |
| `gallery` | `{% gallery "/a.jpg", "/b.jpg" %}` — CSS-columns masonry grid wired to the Tobii lightbox (no Masonry.js). |
| `contact` | `{% contact "Get in touch" %}` — button hidden until JS reveals it (anti-scrape). |
| `link_button` | `{% link_button "/path/", "Label" %}` |
| `cta` | `{% cta "/path/", "Link label", "Contact label" %}` |
| `noscript_text` | `{% noscript_text "…" %}` |
| `right` | `{% right %}…{% endright %}` (paired) |

YouTube/Spotify URLs on their own line auto-embed via `eleventy-plugin-embed-everything`.

Most shortcodes return HTML strings built in `.eleventy.js`; only `gigs` renders a Nunjucks template (`src/_includes/shortcodes/gigs.njk`) via `nunjucks.renderString`.

## Styling

- Entry point `src/assets/css/input.css`, output `_site/assets/css/tailwind.css`. Watch targets: `src/assets/css/` and `tailwind.config.js`.
- Brand colour is aliased as `primary` (currently Tailwind `sky`) in `tailwind.config.js` — change it there, never per template. The site is dark-themed by default (`bg-neutral-900`); `darkMode: 'class'` is enabled but unused.
- `@tailwindcss/typography` styles content via `prose`; use `not-prose` to opt out.
- ⚠️ **Tailwind only scans `./src/**/*.{njk,md}`.** Any class used in an HTML string inside `.eleventy.js` (shortcode output) or composed dynamically in a template expression gets purged unless it is listed in the `safelist` in `tailwind.config.js`. If you add classes to a shortcode, add them to the safelist in the same change.

## Client-side JS (`src/assets/js/`, loaded from `base.njk`)

`menu.js` (mobile overlay nav), `email.js` (reveals `.email` buttons and builds the mailto address at runtime), `lightbox.js` (initialises Tobii when `.lightbox` links exist), `video.js` (hero video/fallback swap), `player.js` (sticky audio player, sessionStorage-backed). `gallery.js` is intentionally empty and not loaded.

Everything degrades without JS: `<noscript>` navigation and contact fallbacks exist in the partials — preserve them.

## Contact form

`src/_includes/partials/_contact_form.njk` posts natively to web3forms with a per-language access key and redirects to `/thank-you/` or `/fi/kiitos/`. It includes a honeypot field and a small inline script that derives the email subject from the name field. Keep it a plain HTML POST — a fetch-based version was tried and reverted for mobile reliability.

## Pages CMS (`.pages.yml`)

Non-technical edits happen through [Pages CMS](https://pagescms.org/), which commits directly to `main` (commit messages read "… (via Pages CMS)"). `.pages.yml` defines the editing UI for gigs, English pages, Finnish pages and `site.json`.

**If you add or rename a frontmatter field on gigs or pages, update `.pages.yml` too**, or it becomes uneditable in the CMS. The shortcode cheat-sheet shown to editors lives in the `body` field `description` blocks there and should be kept in sync with the shortcodes in `.eleventy.js`.

## Deployment

Cloudflare Pages builds and hosts the site, rebuilding on every push to `main`. `.github/workflows/nightly-build.yml` POSTs a Cloudflare deploy hook (`CF_DEPLOY_HOOK_URL` repo secret) at 00:00 UTC daily and can be run manually from the Actions tab — this is what keeps date-filtered listings honest.

Templates reference `site.baseUrl`, which is not defined in `site.json`; it resolves to an empty string, giving root-relative URLs. Only set it if the site moves under a subdirectory.
