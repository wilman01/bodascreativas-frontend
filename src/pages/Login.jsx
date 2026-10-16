import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

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
      <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-12 text-white lg:flex">
        <svg
          aria-hidden="true"
          viewBox="0 0 200 160"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="pointer-events-none absolute -right-16 top-1/2 h-[28rem] w-[34rem] -translate-y-1/2 text-white/10"
        >
          <path d="M100 150C40 120 8 88 12 56 16 26 50 14 74 30c14 10 20 24 26 40 6-16 12-30 26-40 24-16 58-4 62 26 4 32-28 64-88 94Z" />
          <path d="M120 140c38-22 60-44 58-66-2-20-24-28-40-18-9 6-13 15-16 26-4-10-9-19-19-24-15-8-33 0-35 16" />
        </svg>
        <div className="relative flex items-center gap-3">
          <img src="/logo.png" alt="" className="h-14 w-14 rounded-full bg-white object-contain p-1 ring-2 ring-gold-300/60" />
          <div>
            <p className="font-display text-2xl font-semibold leading-tight">Bodas Creativas</p>
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-gold-200">Wedding &amp; Event Planner</p>
          </div>
        </div>
        <div className="relative">
          <p className="font-script text-3xl text-gold-200">¡Felicitaciones, pareja!</p>
          <h1 className="mt-2 font-display text-5xl font-semibold leading-tight">
            Cada boda, una historia distinta.
          </h1>
          <p className="mt-4 max-w-md text-white/90">
            Organiza avances, documentos y galerías de cada pareja desde un único panel.
          </p>
        </div>
        <p className="relative text-sm text-white/80">© {new Date().getFullYear()} Bodas Creativas</p>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
          <img src="/logo.png" alt="Bodas Creativas" className="mx-auto h-32 w-auto object-contain lg:hidden" />

          <div>
            <p className="eyebrow">Bienvenidos</p>
            <h2 className="mt-1 font-display text-4xl font-semibold text-ink-900">Iniciar sesión</h2>
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
                className="absolute inset-y-0 right-2 my-auto h-9 rounded-lg px-3 text-xs font-semibold text-brand-600 hover:bg-brand-50"
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
