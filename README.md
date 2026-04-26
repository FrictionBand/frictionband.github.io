# Friction Band Helsinki Website

This is the website for the band Friction from Helsinki.

## Development

In VSCode, when prompted, reopen in a Dev Container. Or run via GitHub Codespaces.
Then run `npm run dev`.

> **Note:** The `serve` package is used as the local dev server (instead of Eleventy's
> built-in `--serve`) because it supports HTTP range requests, which are required for
> audio seeking in the media player.

### NPM scripts

You can run the development environment (Eleventy + Tailwind watch) with:

```bash
npm run dev
```

Build commands:

- Build site and CSS for production:

```bash
npm run build
```

- Build CSS only (useful locally before a build):

```bash
npm run build:css
```

If you need the raw command used by the Cloudflare build step (runs Tailwind then Eleventy), use:

```bash
npx tailwindcss -i src/assets/css/input.css -o _site/assets/css/tailwind.css --minify && npx @11ty/eleventy
```

## Deployment

The site is built and hosted by Cloudflare Pages, which rebuilds automatically on every push to `main`.

A GitHub Actions workflow ([.github/workflows/nightly-build.yml](.github/workflows/nightly-build.yml)) also pings a Cloudflare deploy hook every night at 00:00 UTC so that the "upcoming gigs" filtering stays current without manual pushes. It can also be triggered manually from the Actions tab. The hook URL is stored in the `CF_DEPLOY_HOOK_URL` repo secret.

## TODO

### Whole Site / general

- Check the same photos aren't reused in several places, organize photos 
- Translate pages to Finnish (when done otherwise)

### Home


### Booking / Contact


### Single gig page

- Footer with small band bio for search engines and embedding? Like Umo

### Jam Session

- 

### About Friction

- 