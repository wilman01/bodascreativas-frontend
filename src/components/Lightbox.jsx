import { useEffect, useRef } from 'react';
import { resolveFileUrl } from '../api/client';
import { useFocusTrap } from '../hooks/useFocusTrap.js';

export default function Lightbox({ photos, index, onClose, onNavigate }) {
  const dialogRef = useRef(null);
  useFocusTrap(index != null, dialogRef);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onNavigate((index + 1) % photos.length);
      if (event.key === 'ArrowLeft') onNavigate((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [index, photos.length, onClose, onNavigate]);

  if (index == null || !photos[index]) return null;
  const photo = photos[index];

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Visor de fotos"
    >
      <button
        type="button"
        className="absolute right-5 top-5 p-2 text-3xl leading-none text-white/80 hover:text-white"
        onClick={onClose}
        aria-label="Cerrar"
      >
        ×
      </button>

      <button
        type="button"
        className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full text-4xl text-white/70 hover:bg-white/10 hover:text-white"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index - 1 + photos.length) % photos.length);
        }}
        aria-label="Anterior"
      >
        ‹
      </button>

      <figure className="max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <img
          src={resolveFileUrl(photo.filePath)}
          alt={photo.caption || photo.fileName}
          className="max-h-[80vh] w-full rounded-xl object-contain shadow-soft"
        />
        <figcaption className="mt-3 text-center text-sm text-white/80">
          {photo.caption || photo.fileName} · {index + 1}/{photos.length}
        </figcaption>
      </figure>

      <button
        type="button"
        className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full text-4xl text-white/70 hover:bg-white/10 hover:text-white"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index + 1) % photos.length);
        }}
        aria-label="Siguiente"
      >
        ›
      </button>
    </div>
  );
}
