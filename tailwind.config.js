/** @type {import('tailwindcss').Config} */
// Paleta y tipografía según el Manual de Identidad Visual de Bodas Creativas:
// - Primario: Pantone 7627 C · #AA2D2A (brand-600)
// - Secundario: Pantone 483 C · #683025 (ink-800)
// - Tipografía: Helvetica Neue Regular / UltraLight
// Los acentos champagne (gold) provienen de la fotografía de marca (confeti dorado).
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fcf7f6',
          100: '#f8e8e6',
          200: '#f0cfcb',
          300: '#e3a6a0',
          400: '#d06e67',
          500: '#bd4641',
          600: '#aa2d2a',
          700: '#8e2523',
          800: '#73201e',
          900: '#5a1b19',
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
          700: '#7a4136',
          800: '#683025',
          900: '#4d2219',
        },
      },
      fontFamily: {
        // Helvetica Neue donde esté instalada (macOS/iOS); Inter como equivalente web.
        display: ['"Helvetica Neue"', 'Inter', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['"Helvetica Neue"', 'Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(104, 48, 37, 0.22)',
      },
    },
  },
  plugins: [],
};
