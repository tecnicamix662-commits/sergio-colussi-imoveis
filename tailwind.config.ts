import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#FAF6EE',
          100: '#F3EBD8',
          200: '#E6D4B0',
          300: '#D8BD88',
          400: '#CFA865',
          500: '#C5A059', // Primary luxury gold
          600: '#A6823F',
          700: '#85642B',
          800: '#644A1E',
          900: '#463212',
        },
        cream: {
          50:  '#FFFDF8',
          100: '#FFF9F0',  // Fundo principal
          200: '#F5EDD9',  // Fundo secundário / cards
          300: '#EAD9B8',  // Bordas e divisores
          400: '#D9C49A',  // Bordas mais escuras
          500: '#C5A97A',
        },
        navy: {
          50:  '#F0F4FA',
          100: '#D9E2EC',
          200: '#B8C7DC',
          300: '#8FA6C8',
          400: '#6281B2',
          500: '#3D5C92',
          600: '#2A4474',
          700: '#1C2F55',
          800: '#111E39',
          900: '#0B132B',
          950: '#060B1B',
        },
        // Tons de pedra/terra para textos e fundo do admin
        stone: {
          50:  '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        },
      },
      fontFamily: {
        sans:  ['var(--font-sans)', 'Inter', 'sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-gold':  '0 0 25px -5px rgba(197, 160, 89, 0.35)',
        'luxury':     '0 20px 40px -15px rgba(60, 40, 10, 0.10)',
        'card-hover': '0 25px 50px -12px rgba(60, 40, 10, 0.14)',
        'soft':       '0 2px 16px rgba(60, 40, 10, 0.07)',
      },
    },
  },
  plugins: [],
};
export default config;
