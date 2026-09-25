export function ProgressBar({ value = 0, showLabel = true }) {
  const safe = Math.min(100, Math.max(0, Number(value) || 0));
  return (
    <div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all"
          style={{ width: `${safe}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-right text-xs font-medium text-ink-700/70">{safe}% completado</p>
      )}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    planning: { label: 'En planeación', className: 'bg-amber-100 text-amber-700' },
    confirmed: { label: 'Confirmada', className: 'bg-emerald-100 text-emerald-700' },
    completed: { label: 'Finalizada', className: 'bg-sky-100 text-sky-700' },
    cancelled: { label: 'Cancelada', className: 'bg-red-100 text-red-700' },
  };
  const item = map[status] || { label: status, className: 'bg-brand-100 text-brand-700' };
  return <span className={`badge ${item.className}`}>{item.label}</span>;
}

export default ProgressBar;
