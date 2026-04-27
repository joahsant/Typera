import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: 'var(--bg-base)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        hover: 'var(--bg-hover)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          dim: 'var(--accent-dim)',
        },
        preview: {
          bg: 'var(--preview-bg)',
          text: 'var(--preview-text)',
        }
      },
      borderRadius: {
        preview: 'var(--preview-radius)',
      },
      boxShadow: {
        preview: 'var(--preview-shadow)',
      },
      fontFamily: {
        display: ['"DM Mono"', 'monospace'],
        ui: ['Geist', 'sans-serif'],
      },
      height: {
        header: '56px',
        footer: '48px',
      }
    },
  },
  plugins: [],
};

export default config;
