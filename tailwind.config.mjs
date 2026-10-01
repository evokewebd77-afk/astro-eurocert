/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        euro: {
          50: '#f0f2f8',
          100: '#d9dff0',
          200: '#b3bfe0',
          300: '#8d9fd1',
          400: '#6680c1',
          500: '#2d5299',
          600: '#0a2463',
          700: '#081d52',
          800: '#061641',
          900: '#040f30',
        },
        eurogold: {
          50: '#fdf8ef',
          100: '#f9ebcf',
          200: '#f2d89f',
          300: '#ebc370',
          400: '#d4a843',
          500: '#c09530',
          600: '#a07a20',
          700: '#806015',
        },
      },
    },
  },
  plugins: [],
};
