import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { formatDate } from '../../api/client';
import Navbar from '../../components/Navbar.jsx';
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
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-display text-3xl font-semibold text-ink-900">Mi boda</h1>
        <p className="text-sm text-ink-700/60">
          Consulta el avance de la planeación, tus documentos y las fotos.
        </p>

        {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        {loading ? (
          <p className="mt-6 text-sm text-ink-700/60">Cargando...</p>
        ) : weddings.length === 0 ? (
          <div className="card mt-6 text-sm text-ink-700/60">
            Aún no tienes una boda asociada. Contacta a tu Wedding Planner.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {weddings.map((wedding) => (
              <article key={wedding.id} className="card flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-ink-900">
                      {wedding.coupleNames}
                    </h2>
                    <p className="text-xs text-ink-700/60">
                      {formatDate(wedding.weddingDate)} · {wedding.venue || 'Lugar por definir'}
                    </p>
                  </div>
                  <StatusBadge status={wedding.status} />
                </div>

                <ProgressBar value={wedding.percentage} />
                <p className="text-xs text-ink-700/60">
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
