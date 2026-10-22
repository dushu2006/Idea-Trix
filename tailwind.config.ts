import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F5F0E5',
        parchment: '#EAE1CC',
        card: '#FBF8F1',
        ink: '#141B27',
        inksoft: '#334052',
        muted: '#5D6B7F',
        line: '#D9CFB8',
        ember: {
          DEFAULT: '#C4391B',
          deep: '#9C2B13',
          soft: '#F7E2D8',
        },
        moss: {
          DEFAULT: '#2F6B3C',
          soft: '#E1ECDE',
        },
        gold: {
          DEFAULT: '#8A6A12',
          soft: '#F2E7C4',
        },
        teal: {
          DEFAULT: '#0E6464',
          soft: '#DBE9E8',
        },
        plum: {
          DEFAULT: '#6B3FA0',
          soft: '#E7DEF4',
        },
      },
      fontFamily: {
        // Names must match the Fontsource Variable @font-face families.
        display: ['"Fraunces Variable"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: [
          '"Hanken Grotesk Variable"',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'sans-serif',
        ],
      },
      maxWidth: {
        ledger: '72rem',
      },
    },
  },
  plugins: [],
};

export default config;
