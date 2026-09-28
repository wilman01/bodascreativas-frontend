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
      <section className="relative hidden flex-col justify-between bg-gradient-to-br from-brand-500 via-brand-600 to-ink-900 p-12 text-white lg:flex">
        <img src="/logo.png" alt="Bodas Creativas" className="h-14 w-14 rounded-full object-cover ring-2 ring-white/50" />
        <div>
          <h1 className="font-display text-5xl font-semibold leading-tight">
            Cada boda, una historia distinta.
          </h1>
          <p className="mt-4 max-w-md text-white/80">
            Organiza avances, documentos y galerías de cada pareja desde un único panel.
          </p>
        </div>
        <p className="text-sm text-white/60">© {new Date().getFullYear()} Bodas Creativas</p>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
          <img src="/logo.png" alt="Bodas Creativas" className="mx-auto h-28 w-28 rounded-full object-cover lg:hidden" />

          <div>
            <h2 className="font-display text-3xl font-semibold text-ink-900">Iniciar sesión</h2>
            <p className="mt-1 text-sm text-ink-700/60">
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
                className="absolute inset-y-0 right-3 text-xs font-semibold text-brand-600"
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
