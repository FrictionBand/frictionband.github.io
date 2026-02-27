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
    // Button utilities (used in shortcode string in .eleventy.js)
    'bg-primary-800', // primary background color (dark variant)
    'hover:bg-primary-600', // primary background on hover (lighter)
    'text-primary-800', // primary text color
    'hover:text-primary-600', // primary text color on hover
    'text-primary-100', // light primary text (used for headings/active nav)
    'text-white', // white text for buttons
    'px-6', // horizontal padding used on CTA buttons
    'py-2', // vertical padding used on CTA buttons
    'rounded-full', // pill-shaped buttons
    'transition-colors', // smooth color transitions
    'hidden' // used to hide email button until JS reveals it
    ,
    // Gallery utilities used in the `gallery` shortcode (runtime-rendered HTML)
    'lightbox',       // class on <a> links picked up by Tobii
    'break-inside-avoid', // prevents items splitting across CSS columns
    'gap-2',          // gutter between columns
    'mb-2',           // bottom margin on each gallery item
    'mt-10',          // top margin for gallery wrapper (used by gallery shortcode)
    'mx-2',           // between cta buttons
    'block',          // display:block on gallery anchors
    'w-full',         // images fill column width
    'object-cover'    // images crop to fill
  ],

  // Theme customizations
  theme: {
    extend: {
      // Add a `primary` color alias that maps to Tailwind's `amber` palette.
      colors: {
        primary: colors.amber, // primary.50 .. primary.900 map to amber shades
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
              color: theme('colors.primary.700'), // link color
              textDecoration: 'none', // remove underline
              fontWeight: 'normal', // keep link weight normal
              '&:hover': {
                color: theme('colors.primary.600'), // hover link color 
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
