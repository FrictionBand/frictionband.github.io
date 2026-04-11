/** @type {import('tailwindcss').Config} */
// Load the default Tailwind color palettes so we can alias one as `primary`.
const colors = require('tailwindcss/colors'); // color palettes (e.g. amber, blue, etc.)

module.exports = {
  // Enable class-based dark mode (add `class="dark"` to root to toggle).
  darkMode: 'class', // toggles dark styles when `.dark` class is present

  // Paths to source files Tailwind scans for class names (used for purging).
  content: ["./src/**/*.{njk,md}"], // look for classes in all njk and md files under src

  // Safelist: classes that Tailwind should always include even if not found in content.
  safelist: [
    'columns-1', // single-column (mobile gallery)
    'columns-2', // used on long lists / multi-column layouts
    'md:columns-2', // two-column layout at md breakpoint
    'md:columns-3', // three-column layout at md breakpoint
    'lg:columns-3', // three-column layout at lg breakpoint
    'not-prose', // exclude typographic prose rules where needed
    '10', // margin utility used dynamically
    // Shortcode HTML utilities (used in .eleventy.js string templates — not scanned by Tailwind)
    // Buttons (contact, link_button, cta shortcodes)
    'bg-primary-600',       // button background
    'hover:bg-primary-500', // button hover background
    'text-white',           // button text
    'hover:text-white',     // keep text white on hover
    'inline-block',         // link button display
    'px-6',                 // horizontal padding
    'py-2',                 // vertical padding
    'rounded-full',         // pill shape
    'transition-colors',    // smooth color transitions
    'hidden',               // hides email button until JS reveals it
    // Section spacing (contact, link_button, cta shortcodes)
    'my-4',                 // link_button section margin
    'md:my-16',             // link_button section margin (large screens)
    'my-8',                 // cta section margin
    'my-12',                // contact section margin
    // CTA layout
    'gap-4',                // gap between cta buttons
    'flex-row',
    'flex-wrap',
    'w-auto',
    // Lead paragraph
    'italic',
    'leading-tight',
    'mb-12',
    // Gallery utilities used in the `gallery` shortcode (runtime-rendered HTML)
    'lightbox',       // class on <a> links picked up by Tobii
    'break-inside-avoid', // prevents items splitting across CSS columns
    'gap-2',          // gutter between columns
    'mb-2',           // bottom margin on each gallery item
    'mt-10',          // top margin for gallery wrapper (used by gallery shortcode)
    'mx-2',           // between cta buttons
    'block',          // display:block on gallery anchors
    'w-full',         // images fill column width
    'object-cover',   // images crop to fill
    // Hero overlap margins (used dynamically in page.njk Nunjucks expression)
    '-mt-16', '-mt-24', '-mt-32', '-mt-40', '-mt-48', '-mt-56', '-mt-64', '-mt-72', '-mt-80',
  ],

  // Theme customizations
  theme: {
    extend: {
      // Add a `primary` color alias that maps to Tailwind's `amber` palette.
      colors: {
        primary: colors.sky, // primary.50 .. primary.900 map to sky shades
      },

      // Custom fonts
      fontFamily: {
        'nunito': ['Nunito Sans', 'sans-serif'], // add Nunito Sans as `nunito`
      },

      // Typography plugin customizations
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none', // don't constrain prose width
            color: theme('colors.neutral.300'), // base prose color
            strong: {
              color: theme('colors.neutral.100'), // stronger text color for <strong>
            },
            a: {
              color: theme('colors.primary.400'), // link color — bright enough for dark backgrounds
              textDecoration: 'none', // remove underline
              fontWeight: 'normal', // keep link weight normal
              '&:hover': {
                color: theme('colors.primary.300'), // hover link color
              },
            },
            h1: {
              color: theme('colors.neutral.100'), // headings use neutral white-ish
              fontSize: theme('fontSize.2xl'), // base sizes for h1
              '@screen md': {
                fontSize: theme('fontSize.3xl'), // larger on md
              },
              '@screen lg': {
                fontSize: theme('fontSize.4xl'), // larger on lg
              },
            },
            h2: {
              color: theme('colors.neutral.100'),
              fontSize: theme('fontSize.xl'),
              '@screen md': {
                fontSize: theme('fontSize.2xl'),
              },
              '@screen lg': {
                fontSize: theme('fontSize.3xl'),
              },
            },
            h3: {
              color: theme('colors.neutral.100'),
              fontSize: theme('fontSize.base'),
              '@screen md': {
                fontSize: theme('fontSize.xl'),
              },
              '@screen lg': {
                fontSize: theme('fontSize.2xl'),
              },
            },
            h4: {
              color: theme('colors.neutral.100'),
              fontSize: theme('fontSize.base'),
              '@screen md': {
                fontSize: theme('fontSize.base'),
              },
              '@screen lg': {
                fontSize: theme('fontSize.xl'),
              },
            },
            img: {
              marginTop: '1em', // spacing above images in prose
              marginBottom: '1em', // spacing below images in prose
              width: '100%', // images stretch to container width
            },
          },
        },
      }),
    },
  },

  // Plugins used by Tailwind
  plugins: [
    require('@tailwindcss/typography'), // typographic defaults and prose classes
  ],
}
