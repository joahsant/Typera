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
        // M3 Expressive Tokens (Function to handle RGB variables + Opacity)
        'm3-primary': 'rgb(var(--m3-primary-rgb) / <alpha-value>)',
        'm3-on-primary': 'rgb(var(--m3-on-primary-rgb) / <alpha-value>)',
        'm3-primary-container': 'rgb(var(--m3-primary-container-rgb) / <alpha-value>)',
        'm3-on-primary-container': 'rgb(var(--m3-on-primary-container-rgb) / <alpha-value>)',
        'm3-secondary': 'rgb(var(--m3-secondary-rgb) / <alpha-value>)',
        'm3-on-secondary': 'rgb(var(--m3-on-secondary-rgb) / <alpha-value>)',
        'm3-secondary-container': 'rgb(var(--m3-secondary-container-rgb) / <alpha-value>)',
        'm3-on-secondary-container': 'rgb(var(--m3-on-secondary-container-rgb) / <alpha-value>)',
        'm3-tertiary': 'rgb(var(--m3-tertiary-rgb) / <alpha-value>)',
        'm3-on-tertiary': 'rgb(var(--m3-on-tertiary-rgb) / <alpha-value>)',
        'm3-tertiary-container': 'rgb(var(--m3-tertiary-container-rgb) / <alpha-value>)',
        'm3-on-tertiary-container': 'rgb(var(--m3-on-tertiary-container-rgb) / <alpha-value>)',
        'm3-surface': 'rgb(var(--m3-surface-rgb) / <alpha-value>)',
        'm3-on-surface': 'rgb(var(--m3-on-surface-rgb) / <alpha-value>)',
        'm3-surface-variant': 'rgb(var(--m3-surface-variant-rgb) / <alpha-value>)',
        'm3-on-surface-variant': 'rgb(var(--m3-on-surface-variant-rgb) / <alpha-value>)',
        'm3-outline': 'rgb(var(--m3-outline-rgb) / <alpha-value>)',
        'm3-surface-container': 'rgb(var(--m3-surface-container-rgb) / <alpha-value>)',
        'm3-surface-container-high': 'rgb(var(--m3-surface-container-high-rgb) / <alpha-value>)',

        // Legacy/Semantic mapping
        base: 'rgb(var(--bg-base) / <alpha-value>)',
        surface: 'rgb(var(--bg-surface) / <alpha-value>)',
        elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
        hover: 'rgb(var(--bg-hover) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        primary: 'rgb(var(--text-primary) / <alpha-value>)',
        secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        preview: {
          bg: 'rgb(var(--preview-bg-rgb) / <alpha-value>)',
          text: 'rgb(var(--preview-text-rgb) / <alpha-value>)',
        }
      },
      borderRadius: {
        'm3-xs': '4px',
        'm3-s': '8px',
        'm3-m': '12px',
        'm3-l': '16px',
        'm3-xl': '28px',
        preview: 'var(--preview-radius)',
      },
      boxShadow: {
        preview: 'var(--preview-shadow)',
        'm3-1': '0 1px 3px 1px rgba(0,0,0,0.15), 0 1px 2px 0 rgba(0,0,0,0.30)',
        'm3-2': '0 2px 6px 2px rgba(0,0,0,0.15), 0 1px 2px 0 rgba(0,0,0,0.30)',
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      height: {
        header: '72px',
        footer: '64px',
      }
    },
  },
  plugins: [],
};
