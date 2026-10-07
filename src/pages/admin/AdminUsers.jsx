import { useEffect, useState } from 'react';
import api from '../../api/client';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';

const emptyForm = { name: '', email: '', phone: '', role: 'client', password: '' };

const ROLE_LABEL = { admin: 'Wedding Planner', client: 'Pareja' };
const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'admin', label: 'Planners' },
  { id: 'client', label: 'Parejas' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [filter, setFilter] = useState('all');

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'client',
    isActive: true,
    password: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [confirmUser, setConfirmUser] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data.data);
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

  const flash = (message) => {
    setNotice(message);
    setError('');
    setTimeout(() => setNotice(''), 3000);
  };

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/auth/register', form);
      setForm(emptyForm);
      setShowCreate(false);
      await load();
      flash('Usuario creado.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (user) => {
    setEditing(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      isActive: user.isActive,
      password: '',
    });
  };

  const handleEditChange = (event) => {
    setEditForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    setSavingEdit(true);
    setError('');
    try {
      const payload = { ...editForm };
      if (!payload.password) delete payload.password;
      await api.put(`/users/${editing.id}`, payload);
      setEditing(null);
      await load();
      flash('Usuario actualizado.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const toggleStatus = async (user) => {
    setBusyId(user.id);
    setError('');
    try {
      await api.patch(`/users/${user.id}/status`, { isActive: !user.isActive });
      await load();
      flash(user.isActive ? 'Usuario desactivado.' : 'Usuario activado.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
      setConfirmUser(null);
      setConfirmBusy(false);
    }
  };

  const handleConfirm = async () => {
    if (!confirmUser) return;
    setConfirmBusy(true);
    await toggleStatus(confirmUser);
  };

  const filtered = filter === 'all' ? users : users.filter((u) => u.role === filter);

  return (
    <div className="min-h-screen bg-brand-50">
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink-900">Usuarios</h1>
            <p className="text-sm text-slate-600">
              Gestiona perfiles, roles y contraseñas de planners y parejas.
            </p>
          </div>
          <button type="button" className="btn-primary" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? 'Cancelar' : '+ Nuevo usuario'}
          </button>
        </div>

        {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
        {notice && (
          <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">{notice}</p>
        )}

        {showCreate && (
          <form onSubmit={handleCreate} className="card mt-6 grid gap-4 md:grid-cols-2">
            <h2 className="font-display text-2xl font-semibold md:col-span-2">Nuevo usuario</h2>

            <div>
              <label className="label" htmlFor="user-name">Nombre *</label>
              <input id="user-name" name="name" className="input" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="label" htmlFor="user-email">Email *</label>
              <input id="user-email" name="email" type="email" className="input" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label className="label" htmlFor="user-phone">Teléfono</label>
              <input id="user-phone" name="phone" className="input" value={form.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="label" htmlFor="user-role">Rol</label>
              <select id="user-role" name="role" className="input" value={form.role} onChange={handleChange}>
                <option value="client">Pareja</option>
                <option value="admin">Wedding Planner</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="label" htmlFor="user-password">Contraseña inicial *</label>
              <input
                id="user-password"
                name="password"
                type="password"
                className="input"
                value={form.password}
                onChange={handleChange}
                minLength="6"
                required
              />
            </div>

            <div className="md:col-span-2">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Crear usuario'}
              </button>
            </div>
          </form>
        )}

        {editing && (
          <form onSubmit={handleEdit} className="card mt-6 grid gap-4 md:grid-cols-2">
            <h2 className="font-display text-2xl font-semibold md:col-span-2">
              Editar usuario: {editing.name}
            </h2>

            <div>
              <label className="label" htmlFor="edit-name">Nombre *</label>
              <input id="edit-name" name="name" className="input" value={editForm.name} onChange={handleEditChange} required />
            </div>
            <div>
              <label className="label" htmlFor="edit-email">Email *</label>
              <input id="edit-email" name="email" type="email" className="input" value={editForm.email} onChange={handleEditChange} required />
            </div>
            <div>
              <label className="label" htmlFor="edit-phone">Teléfono</label>
              <input id="edit-phone" name="phone" className="input" value={editForm.phone} onChange={handleEditChange} />
            </div>
            <div>
              <label className="label" htmlFor="edit-role">Rol</label>
              <select id="edit-role" name="role" className="input" value={editForm.role} onChange={handleEditChange}>
                <option value="client">Pareja</option>
                <option value="admin">Wedding Planner</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="edit-password">Nueva contraseña (opcional)</label>
              <input
                id="edit-password"
                name="password"
                type="password"
                className="input"
                value={editForm.password}
                onChange={handleEditChange}
                minLength="6"
                placeholder="Dejar vacio para no cambiar"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
                <input
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer accent-brand-600"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm((p) => ({ ...p, isActive: e.target.checked }))}
                />
                Cuenta activa
              </label>
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button type="submit" className="btn-primary" disabled={savingEdit}>
                {savingEdit ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        <section className="mt-8">
          <div className="mb-4 flex gap-2" role="group" aria-label="Filtrar usuarios por rol">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
                className={`min-h-[44px] rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  filter === item.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-ink-800 hover:bg-brand-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-sm text-slate-600" role="status">Cargando usuarios...</p>
          ) : filtered.length === 0 ? (
            <div className="card text-sm text-slate-600">No hay usuarios con ese filtro.</div>
          ) : (
            <div className="space-y-3">
              {filtered.map((user) => (
                <article key={user.id} className="card flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-ink-900">{user.name}</p>
                    <p className="text-xs text-slate-600">{user.email}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="badge bg-brand-100 text-brand-700">{ROLE_LABEL[user.role]}</span>
                      {user.phone && <span className="text-xs text-slate-600">{user.phone}</span>}
                      <span
                        className={`badge ${
                          user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" className="btn-ghost" onClick={() => startEdit(user)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className={`min-h-[44px] rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-60 ${
                        user.isActive
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-emerald-700 hover:bg-emerald-50'
                      }`}
                      onClick={() => (user.isActive ? setConfirmUser(user) : toggleStatus(user))}
                      disabled={busyId === user.id}
                    >
                      {busyId === user.id ? 'Procesando...' : user.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <ConfirmDialog
        open={Boolean(confirmUser)}
        title="Desactivar usuario"
        message={confirmUser ? `¿Seguro que deseas desactivar a ${confirmUser.name}? No podrá iniciar sesión hasta reactivarlo.` : ''}
        confirmLabel="Desactivar"
        danger
        busy={confirmBusy}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmUser(null)}
      />
    </div>
  );
}