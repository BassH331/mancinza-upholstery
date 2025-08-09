// Modal3DSlideshow.tsx — Fullscreen, center-focus, no-overlap sides
import { useEffect, useRef, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Slide = { src: string; alt?: string };

type Props = {
  open: boolean;
  images: Slide[];
  startIndex?: number;
  title?: string;
  intervalMs?: number;
  onClose: () => void;
  showThumbnails?: boolean;
  showCaptions?: boolean;
};

export default function Modal3DSlideshow({
  open,
  images,
  startIndex = 0,
  title = 'Showcase',
  intervalMs = 3500,
  onClose,
  showThumbnails = true,
  showCaptions = true,
}: Props) {
  const [index, setIndex] = useState(startIndex);
  const [playing, setPlaying] = useState(true);
  const pausedRef = useRef(false);
  const progressRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  // Ensure valid start index when opening
  useEffect(() => {
    if (!open) return;
    setIndex(Math.min(startIndex, Math.max(0, images.length - 1)));
    setPlaying(true);
    progressRef.current = 0;
  }, [open, startIndex, images.length]);

  // Keyboard controls
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, images.length]);

  const step = (dir: 1 | -1) => {
    progressRef.current = 0;
    setIndex((i) => (i + dir + images.length) % images.length);
  };

  const togglePlay = () => setPlaying((p) => !p);

  // Autoplay with progress (RAF)
  useEffect(() => {
    if (!open) return;

    const loop = (ts: number) => {
      if (!playing || pausedRef.current || document.hidden || images.length <= 1) {
        lastTsRef.current = ts;
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const delta = ts - lastTsRef.current;
      lastTsRef.current = ts;

      progressRef.current += delta / intervalMs;
      if (progressRef.current >= 1) {
        progressRef.current = 0;
        setIndex((i) => (i + 1) % images.length);
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
      progressRef.current = 0;
    };
  }, [open, intervalMs, playing, images.length]);

  // Swipe support
  const drag = useRef<{ startX: number; lastX: number; dragging: boolean }>({ startX: 0, lastX: 0, dragging: false });
  const onPointerDown = (x: number) => { drag.current = { startX: x, lastX: x, dragging: true }; pausedRef.current = true; };
  const onPointerMove = (x: number) => { if (drag.current.dragging) drag.current.lastX = x; };
  const onPointerUp = () => {
    if (!drag.current.dragging) return;
    const delta = drag.current.lastX - drag.current.startX;
    drag.current.dragging = false;
    pausedRef.current = false;
    const threshold = 50;
    if (delta > threshold) step(-1);
    else if (delta < -threshold) step(1);
  };

  if (!open) return null;

  const prevIndex = (index - 1 + images.length) % images.length;
  const nextIndex = (index + 1) % images.length;

  const next = () => step(1);
  const prev = () => step(-1);

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      {/* Ambient backdrop (same vibe as section) */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1400px 800px at 50% -10%, rgba(99,102,241,0.12), transparent 60%), radial-gradient(900px 600px at 80% 10%, rgba(16,185,129,0.12), transparent 60%), radial-gradient(800px 500px at 15% 20%, rgba(244,63,94,0.10), transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(1000px 800px at 50% 45%, black, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(1000px 800px at 50% 45%, black, transparent 70%)',
        }}
      />

      {/* Dim overlay */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* FULLSCREEN STAGE */}
      <div
        className="relative w-screen h-screen max-h-screen"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
        onTouchEnd={onPointerUp}
        onMouseDown={(e) => onPointerDown(e.clientX)}
        onMouseMove={(e) => onPointerMove(e.clientX)}
        onMouseUp={onPointerUp}
      >
        {/* Header */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur text-white/80 text-xs border border-white/10">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {title}
          </div>
          <span className="hidden md:inline text-white/70 text-xs">{index + 1} / {images.length}</span>
        </div>
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={() => { setPlaying((p) => !p); }}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs border border-white/10"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? 'Pause ❚❚' : 'Play ▶'}
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs border border-white/10"
            aria-label="Close"
          >
            Close ✕
          </button>
        </div>

        {/* Slides row — flex prevents overlap */}
        <div
          className="absolute inset-0 px-4 md:px-8 lg:px-12 flex items-center justify-center gap-4 md:gap-6 lg:gap-8"
          style={{ perspective: '1200px' }}
        >
          {/* Prev (small, left) */}
          {images.length > 1 && (
            <button
              onClick={prev}
              aria-label="Previous"
              className="group relative basis-[22%] max-w-[360px] aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10
                         shadow-[0_10px_30px_rgba(0,0,0,.25)] hover:shadow-[0_20px_60px_rgba(0,0,0,.45)]
                         transition will-change-transform"
              style={{ transform: 'rotateY(18deg) translateZ(-120px)', filter: 'saturate(0.95) blur(1px)', opacity: 0.9 }}
            >
              <ImageWithFallback src={images[prevIndex]?.src} alt={images[prevIndex]?.alt || ''} className="w-full h-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />
              <div className="absolute left-2 top-2 text-[11px] uppercase tracking-wide px-2 py-1 rounded-full bg-black/60 text-white/80">Prev</div>
            </button>
          )}

          {/* Center (big, focal) */}
          <div
            className="relative basis-[70%] max-w-[1200px] aspect-[16/9] rounded-3xl overflow-hidden bg-neutral-950 border border-white/10
                       shadow-[0_25px_90px_rgba(0,0,0,0.6)]"
            style={{ transform: 'translateZ(0)', willChange: 'transform' }}
          >
            <ImageWithFallback src={images[index]?.src} alt={images[index]?.alt || ''} className="w-full h-full object-contain bg-black" />
            {/* Center spotlight + soft glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12),transparent_55%)]" />
            <div className="pointer-events-none absolute -inset-16 bg-emerald-400/10 blur-3xl" />
          </div>

          {/* Next (small, right) */}
          {images.length > 1 && (
            <button
              onClick={next}
              aria-label="Next"
              className="group relative basis-[22%] max-w-[360px] aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10
                         shadow-[0_10px_30px_rgba(0,0,0,.25)] hover:shadow-[0_20px_60px_rgba(0,0,0,.45)]
                         transition will-change-transform"
              style={{ transform: 'rotateY(-18deg) translateZ(-120px)', filter: 'saturate(0.95) blur(1px)', opacity: 0.9 }}
            >
              <ImageWithFallback src={images[nextIndex]?.src} alt={images[nextIndex]?.alt || ''} className="w-full h-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/35 via-transparent to-transparent" />
              <div className="absolute right-2 top-2 text-[11px] uppercase tracking-wide px-2 py-1 rounded-full bg-black/60 text-white/80">Next</div>
            </button>
          )}
        </div>

        {/* Caption for center */}
        {showCaptions && (
          <div className="absolute left-0 right-0 bottom-20 md:bottom-24 z-30 px-5">
            <div className="mx-auto max-w-md rounded-xl bg-black/40 backdrop-blur-md px-3 py-2 text-center border border-white/10">
              <p className="text-white/90 text-sm line-clamp-1">{images[index]?.alt || '—'}</p>
              <p className="text-white/60 text-[11px]">Swipe • ← / → • Space to Play/Pause</p>
            </div>
          </div>
        )}

        {/* Arrow controls (overlay) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/10 hover:bg-white/20 text-white p-3 border border-white/10"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/10 hover:bg-white/20 text-white p-3 border border-white/10"
            >
              ›
            </button>
          </>
        )}

        {/* Progress bar */}
        <ProgressBar progressRef={progressRef} playing={playing && !pausedRef.current && !document.hidden} />

        {/* Thumbnails strip */}
        {showThumbnails && images.length > 1 && (
          <ThumbStrip
            images={images}
            activeIndex={index}
            onSelect={(i) => { setIndex(i); progressRef.current = 0; }}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- Progress Bar ---------- */
function ProgressBar({ progressRef, playing }: { progressRef: React.MutableRefObject<number>; playing: boolean }) {
  const barRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (barRef.current) {
        const p = Math.max(0, Math.min(1, progressRef.current));
        barRef.current.style.transform = `scaleX(${p})`;
        barRef.current.style.opacity = playing ? '1' : '0.4';
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef, playing]);

  return (
    <div className="absolute left-0 right-0 bottom-0 h-1.5 bg-white/10 overflow-hidden">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-emerald-400 via-indigo-400 to-pink-400 transition-opacity"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

/* ---------- Thumbnails Strip ---------- */
function ThumbStrip({
  images,
  activeIndex,
  onSelect,
}: {
  images: Slide[];
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Auto-center active thumbnail
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const active = track.querySelector<HTMLButtonElement>(`[data-i="${activeIndex}"]`);
    if (!active) return;
    const tw = track.clientWidth;
    const rect = active.getBoundingClientRect();
    const tr = track.getBoundingClientRect();
    const offset = rect.left - tr.left - (tw / 2 - rect.width / 2);
    track.scrollBy({ left: offset, behavior: 'smooth' });
  }, [activeIndex]);

  return (
    <div className="absolute left-0 right-0 bottom-3 md:bottom-4 z-30 px-3">
      <div
        ref={trackRef}
        className="mx-auto max-w-5xl flex gap-2 overflow-x-auto rounded-xl bg-black/30 backdrop-blur-md p-2 border border-white/10 scrollbar-thin scrollbar-thumb-white/20"
      >
        {images.map((img, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={`${img.src}-${i}`}
              data-i={i}
              onClick={() => onSelect(i)}
              className={[
                'relative h-14 w-20 md:h-16 md:w-24 rounded-lg overflow-hidden flex-shrink-0 transition',
                active ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100',
              ].join(' ')}
              aria-label={`Go to slide ${i + 1}`}
            >
              <ImageWithFallback src={img.src} alt={img.alt || ''} className="w-full h-full object-cover" />
              {active && <div className="absolute inset-0 bg-white/10" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
