import { useEffect, useMemo, useRef, useState } from 'react';
import Modal3DSlideshow from './Modal3DSlideshow';
import { ImageWithFallback } from './figma/ImageWithFallback';

/** -------------------------------------------
 *  Fancy, Modern Gallery Section
 *  - Gradient grid background + parallax blobs
 *  - Filter chips (All / Furniture / Decor)
 *  - Tilt-on-hover glass cards + soft glow
 *  - Staggered reveal on scroll
 *  - 3D coverflow modal slideshow on click
 *  ------------------------------------------- */

type ImageItem = { src: string; alt: string; tag: 'furniture' | 'decor' };

export default function GallerySection() {
  /** ---------- DATA ---------- */
  const furnitureImages: ImageItem[] = [
    { src: 'https://i.imgur.com/6L0COIZ.jpeg', alt: 'Elegant dark sofa', tag: 'furniture' },
    { src: 'https://i.imgur.com/LD7ndbL.jpeg', alt: 'Brown dining set', tag: 'furniture' },
    { src: 'https://i.imgur.com/C9SEtzi.jpeg', alt: 'Cozy armchair', tag: 'furniture' },
    { src: 'https://i.imgur.com/Tb7JiKK.jpeg', alt: 'Luxury lounge', tag: 'furniture' },
    { src: 'https://i.postimg.cc/8czRDP5c/L-shaaped-sofa.jpg', alt: 'L Shape Couch', tag: 'furniture' },
    { src: 'https://i.postimg.cc/dt7WT4s1/single.jpg', alt: 'Single Bed Headboard', tag: 'furniture' },
    { src: 'https://i.postimg.cc/kgTF1SXZ/Queen-base.jpg', alt: 'Queen HB & Base Cover', tag: 'furniture' },
    { src: 'https://i.postimg.cc/qM2fnbRw/Queen-Silver-Stripes.jpg', alt: 'Queen (Silver Stripes)', tag: 'furniture' },
    { src: 'https://i.postimg.cc/KvHXgJdp/Chai.jpg', alt: 'Chair', tag: 'furniture' },
    { src: 'https://i.postimg.cc/JhjSvmtS/Tublet-1.jpg', alt: 'Tublet', tag: 'furniture' },
    { src: 'https://i.postimg.cc/GtgfGmST/Sofa-2.jpg', alt: 'Sofa', tag: 'furniture' },
    { src: 'https://i.postimg.cc/2629N5Y9/Sofa-3.jpg', alt: 'Sofa', tag: 'furniture' },
    { src: 'https://i.postimg.cc/2j99H32V/White-Chair.jpg', alt: 'White Chair', tag: 'furniture' },
    { src: 'https://i.postimg.cc/tTSkmmdL/Tublet-2.jpg', alt: 'Tublet', tag: 'furniture' },
  ];

  const decorImagesRaw = [
    { title: 'Upholstery Materials', image: 'https://i.imgur.com/HtqUwJ6.jpeg' },
    { title: 'Car Seat Repairs', image: 'https://i.postimg.cc/g0XsYTN5/decor-img2.jpg' },
    { title: 'Sofa Restoration', image: 'https://i.postimg.cc/t4P7pdFk/decor-img3.jpg' },
    { title: 'Decor for Events', image: 'https://i.postimg.cc/ZKv5xPsm/decor-img4.jpg' },
    { title: 'Decor Image 1', image: 'https://i.postimg.cc/ZKv5xPsm/decor-img4.jpg' },
    { title: 'Decor Image 2', image: 'https://i.postimg.cc/D0GCJPsH/decor-nice.jpg' },
    { title: 'Decor Image 3', image: 'https://i.postimg.cc/G2WKCTNQ/decor-nice-2.jpg' },
    { title: 'Decor Image 4', image: 'https://i.postimg.cc/4dDrYMDz/table-decor.jpg' },
    { title: 'Decor Image 5', image: 'https://i.postimg.cc/qqcsHb2J/white-wedding-2.jpg' },
    { title: 'Decor Image 6', image: 'https://i.postimg.cc/L5V1bqMh/wedding-main.jpg' },
    { title: 'Decor Image 7', image: 'https://i.postimg.cc/PJdLYt8H/wedding-main-2.jpg' },
    { title: 'Decor Image 8', image: 'https://i.postimg.cc/zDpv4YgL/out-in-elegance.jpg' },
  ];

  const decorImages: ImageItem[] = useMemo(
    () => decorImagesRaw.map((d) => ({ src: d.image, alt: d.title, tag: 'decor' as const })),
    []
  );

  const allImages = useMemo(() => [...furnitureImages, ...decorImages], [furnitureImages, decorImages]);

  /** ---------- FILTER STATE ---------- */
  const [filter, setFilter] = useState<'all' | 'furniture' | 'decor'>('all');
  const filtered = useMemo(() => {
    if (filter === 'all') return allImages;
    return allImages.filter((i) => i.tag === filter);
  }, [filter, allImages]);

  /** ---------- MODAL STATE ---------- */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>('Gallery');
  const [modalImages, setModalImages] = useState<{ src: string; alt: string }[]>([]);
  const [modalStart, setModalStart] = useState(0);

  /** ---------- STAGGER REVEAL ON SCROLL ---------- */
  const gridRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const root = gridRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll('[data-animate="card"]')) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('opacity-100', 'translate-y-0', 'blur-0');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-6', 'blur-sm');
      io.observe(el);
    });
    return () => io.disconnect();
  }, [filter]);

  /** ---------- PARALLAX BLOBS ---------- */
  const blobRef1 = useRef<HTMLDivElement | null>(null);
  const blobRef2 = useRef<HTMLDivElement | null>(null);
  const onMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = (currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width - 0.5) * 20; // -10..10
    const y = ((clientY - rect.top) / rect.height - 0.5) * 20;
    if (blobRef1.current) blobRef1.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (blobRef2.current) blobRef2.current.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
  };

  /** ---------- HELPERS ---------- */
  const openSlideshow = (title: string, images: ImageItem[], startAt = 0) => {
    setModalTitle(title);
    setModalImages(images.map(({ src, alt }) => ({ src, alt })));
    setModalStart(startAt);
    setModalOpen(true);
  };

  const Chips = () => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    {(['all', 'furniture', 'decor'] as const).map((f) => {
      const active = filter === f;
      const colors: Record<typeof f, string> = {
        all: 'from-pink-500 to-yellow-500',
        furniture: 'from-indigo-500 to-purple-500',
        decor: 'from-green-500 to-emerald-500',
      };
      return (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={[
            'px-4 py-2 rounded-full text-sm font-medium transition shadow-md',
            active
              ? `text-white bg-gradient-to-r ${colors[f]} shadow-lg shadow-black/20`
              : 'text-black bg-white/10 hover:bg-white/20 backdrop-blur',
          ].join(' ')}
        >
          {f === 'all' ? 'All' : f[0].toUpperCase() + f.slice(1)}
        </button>
      );
    })}
  </div>
);



  /** ---------- CARD (tilt) ---------- */
  const Card = ({
    img,
    index,
    list,
    title,
  }: {
    img: ImageItem;
    index: number;
    list: ImageItem[];
    title: string;
  }) => {
    const cardRef = useRef<HTMLButtonElement | null>(null);

    const onMove = (e: React.MouseEvent) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      const rX = py * 8;
      const rY = -px * 10;
      el.style.setProperty('--rx', `${rX}deg`);
      el.style.setProperty('--ry', `${rY}deg`);
      el.style.setProperty('--tx', `${px * 6}px`);
      el.style.setProperty('--ty', `${py * 6}px`);
    };
    const reset = () => {
      const el = cardRef.current;
      if (!el) return;
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--tx', '0px');
      el.style.setProperty('--ty', '0px');
    };

    return (
      <button
        ref={cardRef}
        data-animate="card"
        onMouseMove={onMove}
        onMouseLeave={reset}
        onClick={() => openSlideshow(title, list, index)}
        className="group relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,.25)] transition will-change-transform
                   [transform:perspective(800px)_rotateX(var(--rx))_rotateY(var(--ry))_translate3d(var(--tx),var(--ty),0)]
                   hover:shadow-[0_20px_60px_rgba(0,0,0,.45)]"
      >
        <ImageWithFallback src={img.src} alt={img.alt} className="w-full h-full object-cover" />
        {/* Glow on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
          <div className="absolute -inset-10 bg-gradient-to-tr from-white/10 to-transparent blur-2xl" />
        </div>
        {/* Tag chip */}
        <span className="absolute left-3 top-3 text-[11px] uppercase tracking-wide px-2 py-1 rounded-full bg-black/60 text-white/80">
          {img.tag}
        </span>
        {/* Caption bar */}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="rounded-xl bg-black/40 backdrop-blur-md px-3 py-2 text-left">
            <p className="text-white/90 text-sm line-clamp-1">{img.alt}</p>
            <p className="text-white/60 text-[11px]">Tap to open 3D slideshow</p>
          </div>
        </div>
      </button>
    );
  };

  /** ---------- RENDER ---------- */
  return (
    <section
      id="gallery"
      className="relative py-24"
      onMouseMove={onMouseMove}
    >
      {/* Animated grid background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1200px 600px at 50% -10%, rgba(99,102,241,0.10), transparent 60%), radial-gradient(800px 500px at 80% 10%, rgba(16,185,129,0.12), transparent 60%), radial-gradient(700px 400px at 15% 20%, rgba(244,63,94,0.10), transparent 60%)',
        }}
      />
      {/* Subtle grid lines */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage:
            'radial-gradient(800px 600px at 50% 40%, black, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(800px 600px at 50% 40%, black, transparent 70%)',
        }}
      />
      {/* Parallax blobs */}
      <div ref={blobRef1} className="pointer-events-none absolute -z-10 w-72 h-72 left-10 top-10 rounded-full bg-emerald-400/20 blur-3xl" />
      <div ref={blobRef2} className="pointer-events-none absolute -z-10 w-72 h-72 right-10 bottom-10 rounded-full bg-indigo-400/20 blur-3xl" />

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-6">
            Gallery
          </h2>

          {/* Chips + CTA */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Chips />
            <button
              onClick={() =>
                openSlideshow(
                  filter === 'furniture'
                    ? 'Furniture Gallery'
                    : filter === 'decor'
                    ? 'Event Decor Gallery'
                    : 'Full Gallery',
                  filtered,
                  0
                )
              }
              className="px-6 py-2 rounded-full text-sm font-semibold 
                        bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 
                        text-white shadow-lg shadow-emerald-500/30
                        hover:scale-105 hover:shadow-emerald-500/50 
                        active:scale-95 transition-all duration-200"
            >
              Play 3D Slideshow ▶
            </button>
          </div>
        </div>
        


        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {filtered.map((img, i) => (
            <Card
              key={`${img.src}-${i}`}
              img={img}
              index={i}
              list={filtered}
              title={
                filter === 'furniture'
                  ? 'Furniture Gallery'
                  : filter === 'decor'
                  ? 'Event Decor Gallery'
                  : 'Full Gallery'
              }
            />
          ))}
        </div>
      </div>

      {/* Reusable 3D modal */}
      <Modal3DSlideshow
        open={modalOpen}
        images={modalImages}
        startIndex={modalStart}
        title={modalTitle}
        intervalMs={3500}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
