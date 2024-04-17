/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{njk,md}"],
  safelist: [
    'columns-2',
    'md:columns-3',
    'not-prose',
    'mt-5',
  ],
  theme: {
    extend: {
      fontFamily: {
        'nunito': ['Nunito Sans', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.neutral.300'),
            a: {
              color: theme('colors.sky.500'),
              textDecoration: 'none',
              fontWeight: 'normal',
              '&:hover': {
                color: theme('colors.sky.400'),
              },
            },
            h1: {
              color: theme('colors.neutral.100'),
              fontSize: theme('fontSize.2xl'),
              '@screen md': {
                fontSize: theme('fontSize.3xl'),
              },
              '@screen lg': {
                fontSize: theme('fontSize.4xl'),
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
              marginTop: '1em',
              marginBottom: '1em',
              width: '100%', // Set images to be 100% width
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
