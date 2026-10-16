/** @type {import('tailwindcss').Config} */
// Paleta inspirada en la identidad de Bodas Creativas:
// carmesí del corazón principal (#960C1C) y marrón vino del segundo corazón (#5A1A14),
// sobre fondos marfil cálidos y acentos champagne.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fcf7f5',
          100: '#f7e9e6',
          200: '#efd2cd',
          300: '#e2aaa3',
          400: '#cc6e68',
          500: '#b3333b',
          600: '#960c1c',
          700: '#7d0a18',
          800: '#650b15',
          900: '#4c0a11',
        },
        gold: {
          100: '#f8f1e4',
          200: '#efdfbf',
          300: '#e3c792',
          400: '#d4ab64',
          500: '#c4934a',
          600: '#a67a35',
          700: '#86612a',
          800: '#6a4c21',
        },
        ink: {
          700: '#5a3a35',
          800: '#4a231e',
          900: '#3a1612',
        },
      },
      fontFamily: {
        display: ['"Cormorant Infant"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(74, 35, 30, 0.22)',
      },
    },
  },
  plugins: [],
};
