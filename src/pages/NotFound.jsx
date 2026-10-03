import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-display text-6xl font-semibold text-brand-600">404</h1>
      <p className="text-slate-600">La página que buscas no existe.</p>
      <Link to="/" className="btn-primary">Volver al inicio</Link>
    </main>
  );
}
