import type { Config } from 'tailwindcss';

/**
 * IDEATRIX neural design tokens.
 * Dark environment + section accents (accents are applied via inline styles
 * from the destination definitions, since they are data-driven).
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#080F19',
        abyss: '#0B1421',
        panel: '#111C2B',
        raised: '#18283A',
        elevated: '#203448',
        neurdim: '#284052',
        neurmid: '#3E687B',
        turq: '#14B8A6',
        beam: '#22D3EE',
        mint: '#A7F3E8',
        frost: '#C6FFF5',
        mist: '#F1F5F9',
        fog: '#A7B7C8',
        mute: '#71849A',
        inkbtn: '#08131B',
      },
      fontFamily: {
        // Names must match the Fontsource @font-face families.
        display: ['"Space Grotesk Variable"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        stage: '80rem',
      },
    },
  },
  plugins: [],
};

export default config;
