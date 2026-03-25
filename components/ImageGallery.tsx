"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import type { PortfolioImage } from "@/lib/portfolio-data";

export default function ImageGallery({
  images,
  video,
}: {
  images: PortfolioImage[];
  video?: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i !== null ? (i - 1 + images.length) % images.length : null
      ),
    [images.length]
  );
  const next = useCallback(
    () =>
      setLightboxIndex((i) =>
        i !== null ? (i + 1) % images.length : null
      ),
    [images.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, close, prev, next]);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {images.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setLightboxIndex(i)}
            className="mb-4 block w-full cursor-zoom-in overflow-hidden"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full transition-opacity duration-500 hover:opacity-90"
            />
          </button>
        ))}
      </div>

      {video && (
        <div className="mt-8">
          <video
            src={video}
            controls
            playsInline
            className="w-full max-w-3xl mx-auto"
          >
            <track kind="captions" />
          </video>
        </div>
      )}

      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={close}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white text-2xl z-10 p-2 hover:opacity-70 transition-opacity"
            aria-label="Fermer"
          >
            &#x2715;
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white text-2xl p-2 sm:text-3xl sm:p-4 hover:opacity-70 transition-opacity"
            aria-label="Image précédente"
          >
            &#x2039;
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white text-2xl p-2 sm:text-3xl sm:p-4 hover:opacity-70 transition-opacity"
            aria-label="Image suivante"
          >
            &#x203A;
          </button>
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              width={images[lightboxIndex].width}
              height={images[lightboxIndex].height}
              className="max-h-[90vh] w-auto object-contain"
              sizes="90vw"
              priority
            />
          </div>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightboxIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
