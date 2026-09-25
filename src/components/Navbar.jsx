import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const home = isAdmin ? '/admin' : '/mi-boda';

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to={home} className="flex items-center gap-3">
          <img src="/logo.png" alt="Bodas Creativas" className="h-9 w-9 rounded-full object-cover" />
          <span className="font-display text-xl font-semibold text-ink-900">Bodas Creativas</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-ink-800">{user?.name}</p>
            <p className="text-xs text-ink-700/60">
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
