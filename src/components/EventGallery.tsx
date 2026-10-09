"use client";

import Image from "next/image";

import {
  ChevronLeft,
  ChevronRight,
  Images,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  title: string | null;
};

export default function EventGallery({
  images,
}: {
  images: GalleryImage[];
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    null
  );

  const selected =
    selectedIndex !== null ? images[selectedIndex] : null;

  function close() {
    setSelectedIndex(null);
  }

  function previous() {
    if (!images.length) return;

    setSelectedIndex((current) => {
      if (current === null) return 0;
      return current === 0 ? images.length - 1 : current - 1;
    });
  }

  function next() {
    if (!images.length) return;

    setSelectedIndex((current) => {
      if (current === null) return 0;
      return current === images.length - 1 ? 0 : current + 1;
    });
  }

  useEffect(() => {
    if (selectedIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedIndex(null);
        return;
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) => {
          if (current === null) return null;
          return current === 0 ? images.length - 1 : current - 1;
        });
        return;
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) => {
          if (current === null) return null;
          return current === images.length - 1 ? 0 : current + 1;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  if (!images.length) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#056839]">
            Moments from this event
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#15231c] sm:text-3xl">
            Event gallery
          </h2>
        </div>

        <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#66746c] shadow-sm sm:flex">
          <Images size={15} className="text-[#056839]" />
          {images.length}{" "}
          {images.length === 1 ? "photo" : "photos"}
        </div>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={`group relative overflow-hidden rounded-[1.5rem] bg-[#034d2a] text-left ${
              index === 0 && images.length > 3
                ? "col-span-2 aspect-[16/10]"
                : "aspect-square"
            }`}
            aria-label={`Open event photo ${index + 1}`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized
              className="object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white">
              <span className="line-clamp-2 text-xs font-semibold">
                {image.caption ||
                  image.title ||
                  `Photo ${index + 1}`}
              </span>

              <span className="shrink-0 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#15231c]">
                View
              </span>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Event gallery viewer"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                close();
              }
            }}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
              aria-label="Close gallery"
            >
              <X size={22} />
            </button>

            <button
              type="button"
              onClick={previous}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 sm:left-6"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 sm:right-6"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="flex max-h-[90vh] w-full max-w-6xl flex-col"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >
              <div className="relative flex min-h-0 flex-1 items-center justify-center">
                <Image
                  src={selected.url}
                  alt={selected.alt}
                  width={1600}
                  height={1200}
                  unoptimized
                  className="max-h-[78vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                />
              </div>

              <div className="mt-4 flex flex-col items-center justify-center text-center text-white">
                <p className="text-sm font-bold">
                  {selected.caption ||
                    selected.title ||
                    "Event photo"}
                </p>

                <p className="mt-1 text-xs text-white/55">
                  {selectedIndex + 1} / {images.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
