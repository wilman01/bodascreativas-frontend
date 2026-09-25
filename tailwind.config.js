/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf6f3',
          100: '#fbe8e1',
          200: '#f6cfc2',
          300: '#eeab95',
          400: '#e47d5f',
          500: '#d95d3b',
          600: '#c44529',
          700: '#a33721',
          800: '#86311f',
          900: '#6f2c1e',
        },
        ink: {
          700: '#3b3540',
          800: '#2a252f',
          900: '#1b1720',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(42, 37, 47, 0.25)',
      },
    },
  },
  plugins: [],
};
