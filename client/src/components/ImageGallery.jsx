import { useMemo, useState } from "react";

export default function ImageGallery({ images = [], alt = "Part image" }) {
  const safeImages = useMemo(() => {
    // Placeholder system (if empty, show 1 default placeholder)
    if (!images || images.length === 0) {
      return ["https://picsum.photos/seed/part-placeholder/900/700"];
    }
    return images;
  }, [images]);

  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="h-64 sm:h-80 rounded-xl bg-white/5 ring-1 ring-white/10 overflow-hidden flex items-center justify-center">
        <img
          src={safeImages[active]}
          alt={alt}
          className="h-full w-full object-contain p-4"
          loading="lazy"
        />
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {safeImages.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              type="button"
              className={[
                "h-16 w-20 rounded-lg ring-1 overflow-hidden shrink-0 transition",
                i === active ? "ring-white/30" : "ring-white/10 hover:ring-white/20",
              ].join(" ")}
              title={`Image ${i + 1}`}
            >
              <img src={src} alt={`${alt} ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
