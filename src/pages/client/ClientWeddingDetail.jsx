import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { formatBytes, formatDate, resolveFileUrl } from '../../api/client';
import { ProgressBar, StatusBadge } from '../../components/ProgressBar.jsx';
import Lightbox from '../../components/Lightbox.jsx';
import Tabs from '../../components/Tabs.jsx';

const TABS = [
  { id: 'tasks', label: 'Avances' },
  { id: 'documents', label: 'Documentos' },
  { id: 'gallery', label: 'Galería' },
];

export default function ClientWeddingDetail() {
  const { id } = useParams();

  const [wedding, setWedding] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState({ total: 0, done: 0, percentage: 0 });
  const [documents, setDocuments] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [tab, setTab] = useState('tasks');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const allPhotos = useMemo(
    () => albums.flatMap((album) => (album.photos || []).map((p) => ({ ...p, albumName: album.name }))),
    [albums]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [weddingRes, tasksRes, docsRes, albumsRes] = await Promise.all([
        api.get(`/weddings/${id}`),
        api.get(`/weddings/${id}/tasks`),
        api.get(`/weddings/${id}/documents`),
        api.get(`/weddings/${id}/albums`),
      ]);
      setWedding(weddingRes.data.data);
      setTasks(tasksRes.data.data);
      setProgress(tasksRes.data.progress);
      setDocuments(docsRes.data.data);
      setAlbums(albumsRes.data.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

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

  const pending = tasks.filter((t) => !t.isCompleted);
  const completed = tasks.filter((t) => t.isCompleted);

  return (
    <div className="min-h-screen bg-brand-50">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Link to="/mi-boda" className="text-sm font-medium text-brand-600 hover:underline">
          ← Volver
        </Link>

        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}

        {loading ? (
          <p className="mt-6 text-sm text-slate-600" role="status">Cargando...</p>
        ) : wedding ? (
          <>
            <header className="card mt-3">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-semibold text-ink-900">
                    {wedding.coupleNames}
                  </h1>
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

            <Tabs tabs={TABS} active={tab} onChange={setTab} label="Secciones de la boda" className="mt-6" />

            {tab === 'tasks' && (
              <section role="tabpanel" id="panel-tasks" aria-labelledby="tab-tasks" className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="mb-3 font-display text-xl font-semibold text-ink-900">
                    Pendientes ({pending.length})
                  </h2>
                  <div className="space-y-3">
                    {pending.length === 0 && (
                      <p className="card text-sm text-slate-600">¡Todo al día!</p>
                    )}
                    {pending.map((task) => (
                      <div key={task.id} className="card">
                        <p className="font-medium text-ink-900">{task.title}</p>
                        {task.description && (
                          <p className="text-sm text-slate-600">{task.description}</p>
                        )}
                        <p className="mt-1 text-xs text-slate-600">
                          {task.dueDate ? `Vence: ${formatDate(task.dueDate)}` : 'Sin fecha límite'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="mb-3 font-display text-xl font-semibold text-ink-900">
                    Completadas ({completed.length})
                  </h2>
                  <div className="space-y-3">
                    {completed.length === 0 && (
                      <p className="card text-sm text-slate-600">Aún no hay tareas completadas.</p>
                    )}
                    {completed.map((task) => (
                      <div key={task.id} className="card border-emerald-100 bg-emerald-50/40">
                        <p className="font-medium text-slate-600 line-through">{task.title}</p>
                        <p className="mt-1 text-xs text-emerald-700">
                          Completada {task.completedAt ? formatDate(task.completedAt) : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {tab === 'documents' && (
              <section role="tabpanel" id="panel-documents" aria-labelledby="tab-documents" className="mt-6 space-y-3">
                {documents.length === 0 && (
                  <p className="card text-sm text-slate-600">Aún no hay documentos disponibles.</p>
                )}
                {documents.map((doc) => (
                  <div key={doc.id} className="card flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink-900">{doc.title}</p>
                      <p className="text-xs text-slate-600">
                        {doc.category} · {formatBytes(doc.fileSize)} · {formatDate(doc.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={resolveFileUrl(doc.filePath)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-ghost"
                      >
                        Ver
                      </a>
                      <button type="button" className="btn-primary" onClick={() => downloadDocument(doc)}>
                        Descargar
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {tab === 'gallery' && (
              <section role="tabpanel" id="panel-gallery" aria-labelledby="tab-gallery" className="mt-6 space-y-6">
                {albums.length === 0 && (
                  <p className="card text-sm text-slate-600">Aún no hay fotos publicadas.</p>
                )}
                {albums.map((album) => (
                  <div key={album.id} className="card">
                    <div className="mb-3">
                      <h2 className="font-display text-xl font-semibold text-ink-900">{album.name}</h2>
                      {album.description && (
                        <p className="text-sm text-slate-600">{album.description}</p>
                      )}
                    </div>
                    {(album.photos || []).length === 0 ? (
                      <p className="text-sm text-slate-600">Álbum vacío.</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {album.photos.map((photo) => (
                          <button
                            key={photo.id}
                            type="button"
                            className="block w-full cursor-zoom-in overflow-hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                            onClick={() =>
                              setLightboxIndex(allPhotos.findIndex((p) => p.id === photo.id))
                            }
                            aria-label={`Ver «${photo.caption || photo.fileName}» en tamaño completo`}
                          >
                            <img
                              src={resolveFileUrl(photo.filePath)}
                              alt={photo.caption || photo.fileName}
                              loading="lazy"
                              decoding="async"
                              className="h-36 w-full object-cover transition hover:scale-[1.02]"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}
          </>
        ) : null}
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
