/**
 * Logotipo tipográfico según el manual de marca:
 * "·Bodas Creativas·" en Helvetica Neue UltraLight y el descriptor
 * "WEDDING & EVENT PLANNER" en versalitas espaciadas.
 */
export default function Wordmark({ inverse = false, size = 'md', tagline = true, className = '' }) {
  const sizes = {
    sm: { name: 'text-xl', tag: 'text-[0.55rem] tracking-[0.16em]' },
    md: { name: 'text-2xl', tag: 'text-[0.6rem] tracking-[0.28em]' },
    lg: { name: 'text-4xl', tag: 'text-xs tracking-[0.32em]' },
  };
  const s = sizes[size] || sizes.md;
  const nameColor = inverse ? 'text-white' : 'text-ink-800';
  const tagColor = inverse ? 'text-white/85' : 'text-accent';

  return (
    <div className={`min-w-0 leading-none ${className}`}>
      <p className={`whitespace-nowrap font-display font-extralight tracking-tight ${s.name} ${nameColor}`}>
        <span aria-hidden="true">·</span>Bodas Creativas<span aria-hidden="true">·</span>
      </p>
      {tagline && (
        <p className={`mt-1.5 whitespace-nowrap font-normal uppercase ${s.tag} ${tagColor}`}>
          Wedding &amp; Event Planner
        </p>
      )}
    </div>
  );
}
