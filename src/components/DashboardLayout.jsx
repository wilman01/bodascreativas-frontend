import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useFocusTrap } from '../hooks/useFocusTrap.js';

const ROLE_LABEL = { admin: 'Wedding Planner', client: 'Pareja' };

function IconHome({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

function IconUser({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function IconUsers({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" />
      <path d="M17.5 14.3a6.5 6.5 0 0 1 4 5.7" />
    </svg>
  );
}

function SidebarContent({ onNavigate }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const items = [
    {
      to: isAdmin ? '/admin' : '/mi-boda',
      label: isAdmin ? 'Bodas' : 'Mi boda',
      icon: <IconHome className="h-5 w-5" />,
      end: true,
    },
    { to: '/perfil', label: 'Mi perfil', icon: <IconUser className="h-5 w-5" /> },
    ...(isAdmin ? [{ to: '/admin/usuarios', label: 'Usuarios', icon: <IconUsers className="h-5 w-5" /> }] : []),
  ];

  return (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-brand-100 px-5">
        <img src="/logo.png" alt="Bodas Creativas" className="h-10 w-10 rounded-full object-cover ring-2 ring-gold-300/50" />
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-semibold leading-tight text-ink-900">Bodas Creativas</p>
          <p className="text-xs font-medium text-slate-600">Planificación de bodas</p>
        </div>
      </div>

      <nav aria-label="Menú principal" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? 'bg-gradient-to-r from-brand-700 to-brand-600 text-white shadow-soft'
                  : 'text-ink-700 hover:bg-brand-50 hover:text-ink-900'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-brand-100 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-600 text-lg font-semibold text-white">
            {(user?.name || '?').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-900">{user?.name}</p>
            <p className="text-xs text-slate-600">{ROLE_LABEL[user?.role] || user?.role}</p>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="btn-ghost mt-2 w-full">
          Salir
        </button>
      </div>
    </>
  );
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);
  useFocusTrap(open, drawerRef);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-brand-50">
      <a
        href="#main-content"
        className="sr-only z-50 focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-700 focus:shadow-soft"
      >
        Saltar al contenido
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-brand-100 bg-white lg:flex">
        <SidebarContent />
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-brand-100 bg-white/90 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          aria-label="Abrir menú"
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-ink-800 hover:bg-brand-50"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-6 w-6">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <img src="/logo.png" alt="Bodas Creativas" className="h-8 w-8 rounded-full object-cover" />
        <span className="w-9" />
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
          <div className="absolute inset-0 bg-ink-900/60" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside
            ref={drawerRef}
            tabIndex={-1}
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-soft"
          >
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 z-10 rounded-lg p-2 text-ink-800 hover:bg-brand-50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div id="main-content" tabIndex={-1} className="lg:pl-64">
        <Outlet />
      </div>
    </div>
  );
}