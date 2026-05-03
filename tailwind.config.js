/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#5533FF',
          hover: '#4422EE',
          dark: '#C8FF00',
        }
      }
    },
  },
  plugins: [],
}
