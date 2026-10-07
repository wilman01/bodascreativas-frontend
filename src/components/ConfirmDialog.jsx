import { useRef } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap.js';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}) {
  const ref = useRef(null);
  useFocusTrap(open, ref);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-900/60"
        onClick={busy ? undefined : onCancel}
        aria-hidden="true"
      />
      <div
        ref={ref}
        tabIndex={-1}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby={message ? 'confirm-desc' : undefined}
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-soft"
      >
        <h2 id="confirm-title" className="font-display text-xl font-semibold text-ink-900">
          {title}
        </h2>
        {message && (
          <p id="confirm-desc" className="mt-2 text-sm text-slate-600">
            {message}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" className="btn-ghost" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={danger ? 'btn-danger' : 'btn-primary'}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
