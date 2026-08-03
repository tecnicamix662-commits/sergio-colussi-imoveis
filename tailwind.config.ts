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
          50:  '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#18181B', // Redefinido para preto/cinza escuro
          500: '#09090B',
          600: '#000000',
          700: '#27272A',
          800: '#3F3F46',
          900: '#52525B',
        },
        cream: {
          50:  '#FFFFFF',
          100: '#FAFAFA',
          200: '#F4F4F5',
          300: '#E4E4E7',
          400: '#D4D4D8',
          500: '#A1A1AA',
        },
        navy: {
          50:  '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#09090B',
        },
        stone: {
          50:  '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#09090B',
        },
      },
      fontFamily: {
        sans:  ['var(--font-sans)', 'Inter', 'sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-gold':  '0 0 20px -5px rgba(0, 0, 0, 0.15)',
        'luxury':     '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
        'soft':       '0 2px 16px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
export default config;
