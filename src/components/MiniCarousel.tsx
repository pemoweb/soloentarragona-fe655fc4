import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function MiniCarousel({
  images,
  alt,
  className = "aspect-square",
  rounded = "",
  showThumbs = false,
}: {
  images: string[];
  alt: string;
  className?: string;
  rounded?: string;
  showThumbs?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const go = (delta: number) => setIndex((i) => (i + delta + total) % total);

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div>
      <div className={`group/carousel relative overflow-hidden bg-muted ${className} ${rounded}`}>
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${alt} — imagen ${i + 1}`}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Imagen anterior"
              onClick={(e) => { stop(e); go(-1); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-background/85 backdrop-blur text-foreground opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 transition hover:bg-coral hover:text-coral-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Imagen siguiente"
              onClick={(e) => { stop(e); go(1); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-background/85 backdrop-blur text-foreground opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 transition hover:bg-coral hover:text-coral-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`Ver imagen ${i + 1}`}
                  onClick={(e) => { stop(e); setIndex(i); }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-coral" : "w-1.5 bg-background/80 hover:bg-background"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showThumbs && total > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              className={`aspect-square overflow-hidden rounded-xl border-2 transition ${
                i === index ? "border-coral" : "border-border hover:border-foreground/40"
              }`}
            >
              <img src={src} alt={`${alt} miniatura ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
