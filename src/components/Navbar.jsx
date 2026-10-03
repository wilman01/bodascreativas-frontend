import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const home = isAdmin ? '/admin' : '/mi-boda';

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-brand-100 text-brand-700' : 'text-ink-800 hover:bg-brand-50'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <Link to={home} className="flex items-center gap-3">
          <img src="/logo.png" alt="Bodas Creativas" className="h-9 w-9 rounded-full object-cover" />
          <span className="hidden font-display text-xl font-semibold text-ink-900 sm:block">Bodas Creativas</span>
        </Link>

        <nav className="flex items-center gap-1">
          {isAdmin && (
            <NavLink to="/admin/usuarios" className={navLinkClass}>
              Usuarios
            </NavLink>
          )}
          <NavLink to="/perfil" className={navLinkClass}>
            Mi perfil
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-ink-800">{user?.name}</p>
            <p className="text-xs text-slate-600">
              {isAdmin ? 'Wedding Planner' : 'Pareja'}
            </p>
          </div>
          <button type="button" className="btn-ghost" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
