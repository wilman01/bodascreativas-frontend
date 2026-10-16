/** @type {import('tailwindcss').Config} */
// Paleta y tipografía según el Manual de Identidad Visual de Bodas Creativas:
// - Primario: Pantone 7627 C · #AA2D2A (brand-600)
// - Secundario: Pantone 483 C · #683025 (ink-800)
// - Tipografía: Helvetica Neue Regular / UltraLight
// Los acentos champagne (gold) provienen de la fotografía de marca (confeti dorado).
//
// Los colores se leen de variables CSS (src/index.css) para que el modo oscuro
// cambie los tonos sin duplicar clases `dark:` en cada componente.
const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;
const scale = (name, steps) => Object.fromEntries(steps.map((s) => [s, v(`${name}-${s}`)]));

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: scale('brand', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        gold: scale('gold', [100, 200, 300, 400, 500, 600, 700, 800]),
        ink: scale('ink', [700, 800, 900]),
        // Superficie de tarjetas, sidebar y campos (blanco en claro).
        surface: v('surface'),
        // Texto y enlaces de acento: carmesí en claro, rosado legible en oscuro.
        accent: v('accent'),
        // Velo de modales y visor: marrón muy oscuro, igual en ambos temas.
        night: '#1c100e',
        stone: scale('stone', [500, 600]),
        red: scale('red', [50, 100, 700]),
        emerald: scale('emerald', [50, 100, 600, 700]),
        amber: scale('amber', [100, 700]),
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
