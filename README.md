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

## TODO

### Whole Site / general

- Rename page urls (jams -> jam-session, services -> contact)
- New logo also in the navigation bar? If not then at least update font
- Check the same photos aren't reused in several places
- Translate pages to Finnish (when done otherwise)

### Booking / Contact

- Instead of email link on home page, own booking/contact page with contact form + details

### Single gig page

- Footer with small band bio for search engines and embedding? Like Umo
- Embedded map view?  
- Remove tiny date from header and move into info box
- Add a bunch of gig photo placeholders (maybe take pictures of instrument closeups?) 
- "Back to all concerts" link

### Jam Session

- Improve text

### About Friction

- Too much text