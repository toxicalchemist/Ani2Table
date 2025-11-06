/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B1A1A',
          dark: '#6B1414',
          light: '#A52A2A',
        },
        secondary: {
          DEFAULT: '#D4AF37',
          light: '#E5C158',
        },
      },
    },
  },
  plugins: [],
}
