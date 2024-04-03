/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  purge: {
    content: ["./src/**/*.{njk,md}"],
  },
  theme: {
    extend: {
      fontFamily: {
        'nunito': ['Nunito Sans', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.neutral.400'),
            a: {
              color: theme('colors.sky.600'),
              textDecoration: 'none',
              fontWeight: 'normal',
              '&:hover': {
                color: theme('colors.sky.400'),
              },
            },
            h1: {
              fontSize: theme('fontSize.2xl'),
              color: theme('colors.neutral.200'),
            },
            h2: {
              fontSize: theme('fontSize.lg'),
              color: theme('colors.neutral.200'),
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
