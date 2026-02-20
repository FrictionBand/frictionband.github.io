# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Local development server (with hot reload)
npm run dev        # or: npx @11ty/eleventy --serve

# Production build (output to _site/)
npm run build      # or: npx @11ty/eleventy
```

No test suite exists.

## Architecture

This is an [Eleventy (11ty)](https://www.11ty.dev/) static site for the Friction Groove Collective band. Source is in `src/`, output goes to `_site/`.

### Templating

- **Nunjucks (`.njk`)** for layouts and partials
- **Markdown (`.md`)** for page and gig content (with YAML frontmatter)
- Layout chain: `base.njk` → `home.njk` or `page.njk` → content

### Key directories

- `src/pages/` — Site pages. `special/home.md` uses `layout: home`; `dynamic/*.md` use `layout: page`
- `src/gigs/` — One markdown file per gig. Filename convention: `YYYY-MM-DD-slug.md`
- `src/_includes/` — Nunjucks layouts and partials (navigation, gigs list, video, footer, contact)
- `src/_data/site.json` — Global site metadata (title, description, slogan)
- `src/assets/` — CSS (Tailwind input), JS, images, favicons, videos
- `src/media/` — Band media; `gallery/` images are auto-collected into the `gallery` collection

### CSS

Tailwind CSS is built from `src/assets/css/input.css` into `_site/assets/css/tailwind.css` via a `eleventy.before` hook in `.eleventy.js`. The `@tailwindcss/typography` plugin styles prose content. Watch targets: `src/assets/css/` and `tailwind.config.js`.

### Collections & filters (`.eleventy.js`)

| Name | Description |
|---|---|
| `pages` | All items tagged `pages`, sorted by `order` frontmatter |
| `gigs` | All gig markdown files |
| `gallery` | Images from `src/media/gallery/` |
| `filterTodayOrLater` | Keeps items with date ≥ today (day-level comparison) |
| `filterFutureDates` | Keeps strictly future items |
| `filterNonArchived` | Removes items where `archived: true` |
| `postDate` | Formats dates in Finnish locale |

### Adding a gig

Create `src/gigs/YYYY-MM-DD-slug.md` with this frontmatter:

```yaml
---
title: "Event Title"
date: YYYY-MM-DD
time: HH:MM - HH:MM
location: Venue Name, City
gmaps: https://maps.app.goo.gl/...
# Optional:
fblink: https://facebook.com/events/...
weblink: https://example.com/event
---
Event description in Markdown.
```

The gig appears automatically on the home page under "Upcoming Gigs" when its date is today or later. Past gigs fall off automatically (no deletion needed — the site redeploys daily via a scheduled GitHub Actions workflow).

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on every push **and** on a daily cron at midnight UTC. The daily rebuild ensures "upcoming gigs" filtering stays current without manual pushes.
