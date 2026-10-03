import { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';

const ROLE_LABEL = { admin: 'Wedding Planner', client: 'Pareja' };

export default function Profile() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPwd, setSavingPwd] = useState(false);

  const flash = (message) => {
    setNotice(message);
    setError('');
    setTimeout(() => setNotice(''), 3000);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { data } = await api.put('/auth/me', { name, phone });
      setUser(data.user);
      setPhone(data.user.phone || '');
      flash('Perfil actualizado.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async (event) => {
    event.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Las contrasenas no coinciden.');
      return;
    }
    setSavingPwd(true);
    try {
      await api.put('/auth/me/password', { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      flash('Contrasena actualizada.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50">
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-3xl font-semibold text-ink-900">Mi perfil</h1>
        <p className="text-sm text-slate-600">
          Actualiza tus datos personales y tu contrasena.
        </p>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</p>
        )}

        <section className="card mt-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-gold-500 text-2xl font-semibold text-white">
            {(user?.name || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-display text-2xl font-semibold text-ink-900">{user?.name}</p>
            <p className="text-sm text-slate-600">{user?.email}</p>
            <span className="badge mt-1 bg-brand-100 text-brand-700">
              {ROLE_LABEL[user?.role] || user?.role}
            </span>
          </div>
        </section>

        <form onSubmit={handleSave} className="card mt-6 space-y-4">
          <h2 className="font-display text-xl font-semibold text-ink-900">Datos personales</h2>

          <div>
            <label className="label" htmlFor="profile-name">Nombre completo</label>
            <input
              id="profile-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="profile-phone">Telefono (opcional)</label>
            <input
              id="profile-phone"
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>

        <form onSubmit={handlePassword} className="card mt-6 space-y-4">
          <h2 className="font-display text-xl font-semibold text-ink-900">Cambiar contrasena</h2>

          <div>
            <label className="label" htmlFor="pwd-current">Contrasena actual</label>
            <input
              id="pwd-current"
              type="password"
              className="input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="pwd-new">Nueva contrasena</label>
            <input
              id="pwd-new"
              type="password"
              className="input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              minLength="6"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="pwd-confirm">Confirmar nueva contrasena</label>
            <input
              id="pwd-confirm"
              type="password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              minLength="6"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={savingPwd}>
            {savingPwd ? 'Actualizando...' : 'Actualizar contrasena'}
          </button>
        </form>
      </main>
    </div>
  );
}