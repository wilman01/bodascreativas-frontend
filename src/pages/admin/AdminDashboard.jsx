import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { formatDate } from '../../api/client';
import Navbar from '../../components/Navbar.jsx';
import { ProgressBar, StatusBadge } from '../../components/ProgressBar.jsx';

const emptyForm = {
  coupleNames: '',
  weddingDate: '',
  venue: '',
  city: '',
  budget: '',
  description: '',
  status: 'planning',
  clientName: '',
  clientEmail: '',
};

export default function AdminDashboard() {
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/weddings');
      setWeddings(data.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form };
      if (form.clientEmail) {
        payload.members = [
          {
            name: form.clientName || form.clientEmail,
            email: form.clientEmail,
            memberRole: 'partner',
            password: 'cambiar123',
          },
        ];
      }
      delete payload.clientName;
      delete payload.clientEmail;
      if (!payload.budget) delete payload.budget;
      if (!payload.weddingDate) delete payload.weddingDate;

      await api.post('/weddings', payload);
      setForm(emptyForm);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const totalCouples = weddings.length;
  const avgProgress = totalCouples
    ? Math.round(weddings.reduce((acc, w) => acc + (w.percentage || 0), 0) / totalCouples)
    : 0;

  return (
    <div className="min-h-screen bg-brand-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink-900">Panel del Planner</h1>
            <p className="text-sm text-slate-600">
              Gestiona todas las bodas, tareas, documentos y galerías.
            </p>
          </div>
          <button type="button" className="btn-primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Cancelar' : '+ Nueva boda'}
          </button>
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <article className="card">
            <p className="text-xs uppercase tracking-wide text-slate-600">Bodas activas</p>
            <p className="mt-1 font-display text-4xl font-semibold text-ink-900">{totalCouples}</p>
          </article>
          <article className="card">
            <p className="text-xs uppercase tracking-wide text-slate-600">Progreso promedio</p>
            <p className="mt-1 font-display text-4xl font-semibold text-brand-600">{avgProgress}%</p>
          </article>
          <article className="card">
            <p className="text-xs uppercase tracking-wide text-slate-600">Confirmadas</p>
            <p className="mt-1 font-display text-4xl font-semibold text-emerald-600">
              {weddings.filter((w) => w.status === 'confirmed').length}
            </p>
          </article>
        </section>

        {error && (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        {showForm && (
          <form onSubmit={handleCreate} className="card mt-6 grid gap-4 md:grid-cols-2">
            <h2 className="font-display text-2xl font-semibold md:col-span-2">Nueva boda</h2>

            <div>
              <label className="label" htmlFor="coupleNames">Nombre de la pareja *</label>
              <input id="coupleNames" name="coupleNames" className="input" value={form.coupleNames} onChange={handleChange} required />
            </div>
            <div>
              <label className="label" htmlFor="weddingDate">Fecha de la boda</label>
              <input id="weddingDate" name="weddingDate" type="date" className="input" value={form.weddingDate} onChange={handleChange} />
            </div>
            <div>
              <label className="label" htmlFor="venue">Lugar</label>
              <input id="venue" name="venue" className="input" value={form.venue} onChange={handleChange} />
            </div>
            <div>
              <label className="label" htmlFor="city">Ciudad</label>
              <input id="city" name="city" className="input" value={form.city} onChange={handleChange} />
            </div>
            <div>
              <label className="label" htmlFor="budget">Presupuesto</label>
              <input id="budget" name="budget" type="number" min="0" step="0.01" className="input" value={form.budget} onChange={handleChange} />
            </div>
            <div>
              <label className="label" htmlFor="status">Estado</label>
              <select id="status" name="status" className="input" value={form.status} onChange={handleChange}>
                <option value="planning">En planeación</option>
                <option value="confirmed">Confirmada</option>
                <option value="completed">Finalizada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="clientEmail">Email de contacto (pareja)</label>
              <input id="clientEmail" name="clientEmail" type="email" className="input" value={form.clientEmail} onChange={handleChange} placeholder="pareja@correo.com" />
            </div>
            <div>
              <label className="label" htmlFor="clientName">Nombre de la pareja (cuenta)</label>
              <input id="clientName" name="clientName" className="input" value={form.clientName} onChange={handleChange} placeholder="María & Juan" />
            </div>
            <div className="md:col-span-2">
              <label className="label" htmlFor="description">Descripción / estilo</label>
              <textarea id="description" name="description" rows="3" className="input" value={form.description} onChange={handleChange} />
            </div>

            <div className="md:col-span-2">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Crear boda'}
              </button>
            </div>
          </form>
        )}

        <section className="mt-8">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Mis bodas</h2>

          {loading ? (
            <p className="mt-4 text-sm text-slate-600">Cargando bodas...</p>
          ) : weddings.length === 0 ? (
            <div className="card mt-4 text-sm text-slate-600">
              Aún no tienes bodas registradas. Crea la primera para comenzar.
            </div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {weddings.map((wedding) => (
                <article key={wedding.id} className="card flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-ink-900">
                        {wedding.coupleNames}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {formatDate(wedding.weddingDate)} · {wedding.venue || 'Lugar por definir'}
                      </p>
                    </div>
                    <StatusBadge status={wedding.status} />
                  </div>

                  <ProgressBar value={wedding.percentage} />

                  <p className="text-xs text-slate-600">
                    {wedding.done}/{wedding.total} tareas completadas
                  </p>

                  <Link to={`/admin/bodas/${wedding.id}`} className="btn-primary mt-auto">
                    Gestionar boda
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
