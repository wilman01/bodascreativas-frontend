import { useEffect, useState } from 'react';

export const THEME_KEY = 'bc_theme';
const media = () => window.matchMedia('(prefers-color-scheme: dark)');

function readStored() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function apply(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#161110' : '#aa2d2a');
}

/**
 * Alterna entre tema claro y oscuro. Sin elección guardada sigue la preferencia
 * del sistema; el script en index.html aplica el tema antes del primer pintado.
 */
export default function ThemeToggle({ className = '' }) {
  const [stored, setStored] = useState(readStored);
  const [systemDark, setSystemDark] = useState(() => media().matches);
  const theme = stored || (systemDark ? 'dark' : 'light');

  useEffect(() => {
    const mq = media();
    const onChange = (event) => setSystemDark(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => apply(theme), [theme]);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Sin almacenamiento disponible: el cambio dura solo esta visita.
    }
    setStored(next);
  };

  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={isDark ? 'Tema claro' : 'Tema oscuro'}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition hover:bg-brand-100 hover:text-accent ${className}`}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
        </svg>
      )}
    </button>
  );
}
