import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { formatDate } from '../../api/client';
import { ProgressBar, StatusBadge } from '../../components/ProgressBar.jsx';

export default function ClientDashboard() {
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/weddings');
        setWeddings(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-brand-50">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="relative overflow-hidden rounded-3xl border border-brand-100 bg-surface px-6 py-10 shadow-soft sm:px-10">
          <img
            src="/img/confeti.webp"
            alt=""
            aria-hidden="true"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover dark:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/95 via-surface/70 to-surface/10" aria-hidden="true" />
          <div className="relative">
            <p className="eyebrow">Wedding &amp; Event Planner</p>
            <h1 className="mt-2 font-display text-4xl font-extralight tracking-tight text-ink-900 sm:text-5xl">Mi boda</h1>
            <p className="mt-2 max-w-md text-sm text-ink-700">
              Consulta el avance de la planeación, tus documentos y las fotos.
            </p>
          </div>
        </section>

        {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}

        {loading ? (
          <p className="mt-6 text-sm text-stone-600" role="status">Cargando...</p>
        ) : weddings.length === 0 ? (
          <div className="card mt-6 text-sm text-stone-600">
            Aún no tienes una boda asociada. Contacta a tu Wedding Planner.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {weddings.map((wedding) => (
              <article key={wedding.id} className="card flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-normal text-ink-900">
                      {wedding.coupleNames}
                    </h2>
                    <p className="text-xs text-stone-600">
                      {formatDate(wedding.weddingDate)} · {wedding.venue || 'Lugar por definir'}
                    </p>
                  </div>
                  <StatusBadge status={wedding.status} />
                </div>

                <ProgressBar value={wedding.percentage} />
                <p className="text-xs text-stone-600">
                  {wedding.done} de {wedding.total} tareas completadas
                </p>

                <Link to={`/mi-boda/${wedding.id}`} className="btn-primary mt-auto">
                  Ver detalles
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
