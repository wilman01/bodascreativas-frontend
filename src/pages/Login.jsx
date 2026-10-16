import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/mi-boda'} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      const fallback = result.user.role === 'admin' ? '/admin' : '/mi-boda';
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-brand-800 p-12 text-white lg:flex">
        <img
          src="/img/ramos-vertical.webp"
          alt=""
          aria-hidden="true"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Velo con los colores oficiales (7627 C → 483 C) para mantener el texto legible */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/85 via-brand-700/70 to-[#683025]/95" aria-hidden="true" />
        <img src="/logo-white.png" alt="Bodas Creativas — Wedding & Event Planner" className="relative w-64" />
        <div className="relative">
          <p className="text-xs font-normal uppercase tracking-[0.32em] text-gold-200">¡Felicitaciones, pareja!</p>
          <h1 className="mt-4 font-display text-5xl font-extralight tracking-tight leading-tight">
            Cada boda, una historia distinta.
          </h1>
          <p className="mt-4 max-w-md text-white/90">
            Organiza avances, documentos y galerías de cada pareja desde un único panel.
          </p>
        </div>
        <p className="relative text-sm text-white/80">© {new Date().getFullYear()} Bodas Creativas</p>
      </section>

      <section className="relative flex items-center justify-center p-6 sm:p-12">
        <ThemeToggle className="absolute right-4 top-4" />
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
          <div className="lg:hidden">
            <img src="/logo.png" alt="Bodas Creativas — Wedding & Event Planner" className="mx-auto w-52 dark:hidden" />
            <img src="/logo-dark.png" alt="Bodas Creativas — Wedding & Event Planner" className="mx-auto hidden w-52 dark:block" />
          </div>

          <div>
            <p className="eyebrow">Bienvenidos</p>
            <h2 className="mt-1 font-display text-4xl font-extralight tracking-tight text-ink-900">Iniciar sesión</h2>
            <p className="mt-1 text-sm text-stone-600">
              Accede con tu cuenta de planner o de pareja.
            </p>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <div>
            <label className="label" htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="password">Contraseña</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input pr-16"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute inset-y-0 right-2 my-auto h-9 rounded-lg px-3 text-xs font-semibold text-accent hover:bg-brand-50"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </section>
    </main>
  );
}
