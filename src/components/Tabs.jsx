import { useRef } from 'react';

/**
 * Pestañas accesibles (patron ARIA tablist) con navegacion por teclado.
 * Panel asociado: id={`panel-${tab.id}`} aria-labelledby={`tab-${tab.id}`}.
 */
export default function Tabs({ tabs, active, onChange, label = 'Secciones', className = '' }) {
  const listRef = useRef(null);

  const handleKeyDown = (event) => {
    const current = tabs.findIndex((t) => t.id === active);
    let next = null;
    if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    if (next == null) return;

    event.preventDefault();
    onChange(tabs[next].id);
    const buttons = listRef.current?.querySelectorAll('[role="tab"]');
    buttons?.[next]?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={`flex gap-2 border-b border-brand-100 ${className}`}
    >
      {tabs.map((item) => {
        const selected = active === item.id;
        return (
          <button
            key={item.id}
            id={`tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={`-mb-px min-h-[44px] border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
              selected
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-600 hover:text-ink-800'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
