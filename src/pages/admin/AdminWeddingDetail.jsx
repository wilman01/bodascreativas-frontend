import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { formatBytes, formatDate, resolveFileUrl } from '../../api/client';
import Navbar from '../../components/Navbar.jsx';
import { ProgressBar, StatusBadge } from '../../components/ProgressBar.jsx';
import Lightbox from '../../components/Lightbox.jsx';

const TABS = [
  { id: 'tasks', label: 'Tareas' },
  { id: 'documents', label: 'Documentos' },
  { id: 'gallery', label: 'Galería' },
];

const emptyTask = { title: '', description: '', category: 'general', dueDate: '' };
const emptyAlbum = { name: '', description: '' };

export default function AdminWeddingDetail() {
  const { id } = useParams();

  const [wedding, setWedding] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState({ total: 0, done: 0, percentage: 0 });
  const [documents, setDocuments] = useState([]);
  const [albums, setAlbums] = useState([]);

  const [tab, setTab] = useState('tasks');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [taskForm, setTaskForm] = useState(emptyTask);
  const [albumForm, setAlbumForm] = useState(emptyAlbum);
  const [docForm, setDocForm] = useState({ title: '', category: 'other', file: null });
  const [photoForm, setPhotoForm] = useState({ albumId: '', files: null });
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const allPhotos = useMemo(
    () => albums.flatMap((album) => (album.photos || []).map((p) => ({ ...p, albumName: album.name }))),
    [albums]
  );

  const loadWedding = useCallback(async () => {
    const { data } = await api.get(`/weddings/${id}`);
    setWedding(data.data);
  }, [id]);

  const loadTasks = useCallback(async () => {
    const { data } = await api.get(`/weddings/${id}/tasks`);
    setTasks(data.data);
    setProgress(data.progress);
  }, [id]);

  const loadDocuments = useCallback(async () => {
    const { data } = await api.get(`/weddings/${id}/documents`);
    setDocuments(data.data);
  }, [id]);

  const loadGallery = useCallback(async () => {
    const { data } = await api.get(`/weddings/${id}/albums`);
    setAlbums(data.data);
  }, [id]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([loadWedding(), loadTasks(), loadDocuments(), loadGallery()]);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadWedding, loadTasks, loadDocuments, loadGallery]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const flash = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 3000);
  };

  /* ------------------------------ TAREAS ------------------------------ */
  const createTask = async (event) => {
    event.preventDefault();
    try {
      const payload = { ...taskForm };
      if (!payload.dueDate) delete payload.dueDate;
      await api.post(`/weddings/${id}/tasks`, payload);
      setTaskForm(emptyTask);
      await loadTasks();
      flash('Tarea creada.');
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const { data } = await api.patch(`/weddings/${id}/tasks/${taskId}/toggle`);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? data.data : t)));
      setProgress(data.progress);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/weddings/${id}/tasks/${taskId}`);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  /* ---------------------------- DOCUMENTOS ---------------------------- */
  const uploadDocument = async (event) => {
    event.preventDefault();
    if (!docForm.file) return;
    try {
      const body = new FormData();
      body.append('file', docForm.file);
      body.append('title', docForm.title || docForm.file.name);
      body.append('category', docForm.category);
      await api.post(`/weddings/${id}/documents`, body);
      setDocForm({ title: '', category: 'other', file: null });
      event.target.reset();
      await loadDocuments();
      flash('Documento subido.');
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteDocument = async (docId) => {
    try {
      await api.delete(`/weddings/${id}/documents/${docId}`);
      await loadDocuments();
    } catch (err) {
      setError(err.message);
    }
  };

  const downloadDocument = async (doc) => {
    try {
      const response = await api.get(`/weddings/${id}/documents/${doc.id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  /* ------------------------------ GALERÍA ----------------------------- */
  const createAlbum = async (event) => {
    event.preventDefault();
    try {
      await api.post(`/weddings/${id}/albums`, albumForm);
      setAlbumForm(emptyAlbum);
      await loadGallery();
      flash('Álbum creado.');
    } catch (err) {
      setError(err.message);
    }
  };

  const uploadPhotos = async (event) => {
    event.preventDefault();
    if (!photoForm.files?.length) return;
    try {
      const body = new FormData();
      Array.from(photoForm.files).forEach((file) => body.append('files', file));
      if (photoForm.albumId) body.append('albumId', photoForm.albumId);
      await api.post(`/weddings/${id}/photos`, body);
      setPhotoForm({ albumId: '', files: null });
      event.target.reset();
      await loadGallery();
      flash('Fotos subidas.');
    } catch (err) {
      setError(err.message);
    }
  };

  const deletePhoto = async (photoId) => {
    try {
      await api.delete(`/weddings/${id}/photos/${photoId}`);
      await loadGallery();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-50">
        <Navbar />
        <p className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600">Cargando boda...</p>
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="min-h-screen bg-brand-50">
        <Navbar />
        <p className="mx-auto max-w-6xl px-4 py-10 text-sm text-red-600">{error || 'Boda no encontrada.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Link to="/admin" className="text-sm font-medium text-brand-600 hover:underline">
          ← Volver al panel
        </Link>

        <header className="card mt-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-semibold text-ink-900">{wedding.coupleNames}</h1>
              <p className="text-sm text-slate-600">
                {formatDate(wedding.weddingDate)} · {wedding.venue || 'Lugar por definir'}
                {wedding.city ? ` · ${wedding.city}` : ''}
              </p>
            </div>
            <StatusBadge status={wedding.status} />
          </div>
          <div className="mt-4">
            <ProgressBar value={progress.percentage} />
          </div>
        </header>

        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {notice && <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</p>}

        <nav className="mt-6 flex gap-2 border-b border-brand-100">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition ${
                tab === item.id
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-slate-600 hover:text-ink-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* ------------------------------ TAREAS ------------------------------ */}
        {tab === 'tasks' && (
          <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3">
              {tasks.length === 0 && (
                <p className="card text-sm text-slate-600">Sin tareas. Crea la primera.</p>
              )}
              {tasks.map((task) => (
                <div key={task.id} className="card flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 cursor-pointer accent-brand-600"
                    checked={task.isCompleted}
                    onChange={() => toggleTask(task.id)}
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${task.isCompleted ? 'text-slate-500 line-through' : 'text-ink-900'}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-sm text-slate-600">{task.description}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                      {task.category} · {task.dueDate ? formatDate(task.dueDate) : 'Sin fecha límite'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:underline"
                    onClick={() => deleteTask(task.id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={createTask} className="card h-fit space-y-3">
              <h2 className="font-display text-xl font-semibold">Nueva tarea</h2>
              <div>
                <label className="label" htmlFor="task-title">Título</label>
                <input
                  id="task-title"
                  className="input"
                  placeholder="Ej. Confirmar el banquete"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="task-description">Descripción (opcional)</label>
                <textarea
                  id="task-description"
                  className="input"
                  rows="2"
                  placeholder="Detalles o notas"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div>
                <label className="label" htmlFor="task-category">Categoría</label>
                <input
                  id="task-category"
                  className="input"
                  placeholder="Ej. Banquete, Música, Vestuario"
                  value={taskForm.category}
                  onChange={(e) => setTaskForm((p) => ({ ...p, category: e.target.value }))}
                />
              </div>
              <div>
                <label className="label" htmlFor="task-dueDate">Fecha límite</label>
                <input
                  id="task-dueDate"
                  type="date"
                  className="input"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm((p) => ({ ...p, dueDate: e.target.value }))}
                />
              </div>
              <button type="submit" className="btn-primary w-full">Agregar tarea</button>
            </form>
          </section>
        )}

        {/* ---------------------------- DOCUMENTOS ---------------------------- */}
        {tab === 'documents' && (
          <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3">
              {documents.length === 0 && (
                <p className="card text-sm text-slate-600">Aún no hay documentos.</p>
              )}
              {documents.map((doc) => (
                <div key={doc.id} className="card flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink-900">{doc.title}</p>
                    <p className="text-xs text-slate-500">
                      {doc.category} · {formatBytes(doc.fileSize)} · {formatDate(doc.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" className="btn-ghost" onClick={() => downloadDocument(doc)}>
                      Descargar
                    </button>
                    <button
                      type="button"
                      className="rounded-lg px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:underline"
                      onClick={() => deleteDocument(doc.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={uploadDocument} className="card h-fit space-y-3">
              <h2 className="font-display text-xl font-semibold">Subir documento</h2>
              <div>
                <label className="label" htmlFor="doc-title">Título (opcional)</label>
                <input
                  id="doc-title"
                  className="input"
                  placeholder="Ej. Contrato de salón"
                  value={docForm.title}
                  onChange={(e) => setDocForm((p) => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="label" htmlFor="doc-category">Categoría</label>
                <select
                  id="doc-category"
                  className="input"
                  value={docForm.category}
                  onChange={(e) => setDocForm((p) => ({ ...p, category: e.target.value }))}
                >
                  <option value="contract">Contrato</option>
                  <option value="budget">Presupuesto</option>
                  <option value="invoice">Factura</option>
                  <option value="menu">Menú</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="doc-file">Archivo *</label>
                <input
                  id="doc-file"
                  type="file"
                  className="input"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
                  onChange={(e) => setDocForm((p) => ({ ...p, file: e.target.files?.[0] || null }))}
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">Subir</button>
            </form>
          </section>
        )}

        {/* ------------------------------ GALERÍA ----------------------------- */}
        {tab === 'gallery' && (
          <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              {albums.length === 0 && (
                <p className="card text-sm text-slate-600">Crea un álbum para agrupar las fotos.</p>
              )}
              {albums.map((album) => (
                <div key={album.id} className="card">
                  <div className="mb-3">
                    <h3 className="font-display text-xl font-semibold text-ink-900">{album.name}</h3>
                    {album.description && (
                      <p className="text-sm text-slate-600">{album.description}</p>
                    )}
                  </div>
                  {(album.photos || []).length === 0 ? (
                    <p className="text-sm text-slate-500">Álbum vacío.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {album.photos.map((photo) => (
                        <figure key={photo.id} className="group relative overflow-hidden rounded-xl">
                          <img
                            src={resolveFileUrl(photo.filePath)}
                            alt={photo.caption || photo.fileName}
                            loading="lazy"
                            decoding="async"
                            className="h-32 w-full cursor-zoom-in object-cover transition group-hover:scale-105"
                            onClick={() =>
                              setLightboxIndex(allPhotos.findIndex((p) => p.id === photo.id))
                            }
                          />
                          <button
                            type="button"
                            aria-label="Eliminar foto"
                            className="absolute right-1 top-1 flex rounded-full bg-white/90 px-2 py-1.5 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-white hover:text-red-700"
                            onClick={() => deletePhoto(photo.id)}
                          >
                            ×
                          </button>
                        </figure>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <form onSubmit={createAlbum} className="card space-y-3">
                <h2 className="font-display text-xl font-semibold">Nuevo álbum</h2>
                <div>
                  <label className="label" htmlFor="album-name">Nombre *</label>
                  <input
                    id="album-name"
                    className="input"
                    placeholder="Ej. Sesión Pre-boda"
                    value={albumForm.name}
                    onChange={(e) => setAlbumForm((p) => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="album-description">Descripción</label>
                  <textarea
                    id="album-description"
                    className="input"
                    rows="2"
                    placeholder="Notas sobre el álbum"
                    value={albumForm.description}
                    onChange={(e) => setAlbumForm((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Crear álbum</button>
              </form>

              <form onSubmit={uploadPhotos} className="card space-y-3">
                <h2 className="font-display text-xl font-semibold">Subir fotos</h2>
                <div>
                  <label className="label" htmlFor="photo-album">Álbum</label>
                  <select
                    id="photo-album"
                    className="input"
                    value={photoForm.albumId}
                    onChange={(e) => setPhotoForm((p) => ({ ...p, albumId: e.target.value }))}
                  >
                    <option value="">Sin álbum</option>
                    {albums.map((album) => (
                      <option key={album.id} value={album.id}>{album.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="photo-files">Fotos *</label>
                  <input
                    id="photo-files"
                    type="file"
                    className="input"
                    accept="image/*"
                    multiple
                    onChange={(e) => setPhotoForm((p) => ({ ...p, files: e.target.files }))}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Subir fotos</button>
              </form>
            </div>
          </section>
        )}
      </main>

      <Lightbox
        photos={allPhotos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
