/**
 * Franja fotográfica decorativa para la cabecera de una tarjeta (.card),
 * con fotografía de la línea de marca: tonos cálidos, champagne y flores.
 */
export default function CoverPhoto({ className = '' }) {
  return (
    <div className={`relative -mx-5 -mt-5 mb-5 h-28 overflow-hidden rounded-t-2xl sm:h-36 ${className}`} aria-hidden="true">
      <img
        src="/img/ramos-sm.webp"
        srcSet="/img/ramos-sm.webp 800w, /img/ramos.webp 1600w"
        sizes="(min-width: 1024px) 70vw, 100vw"
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-[center_35%] dark:brightness-75"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface/80" />
    </div>
  );
}
