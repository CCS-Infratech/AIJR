"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Expand,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const images = [
  "/images/gallery/1.jpeg",
  "/images/gallery/2.jpeg",
  "/images/gallery/4.jpeg",
  "/images/gallery/5.jpeg",
  "/images/gallery/6.jpeg",
  "/images/gallery/7.jpeg",
  "/images/gallery/8.jpeg",
  "/images/gallery/9.jpeg",
  "/images/gallery/10.jpeg",
  "/images/gallery/11.jpeg",
  "/images/gallery/12.jpeg",
  "/images/gallery/13.jpeg",
  "/images/gallery/14.jpeg",
  "/images/gallery/15.jpeg",
  "/images/gallery/16.jpeg",
];

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  const closeGallery = () => {
    setSelected(null);
  };

  const previousImage = () => {
    if (selected === null) return;

    setSelected(
      selected === 0 ? images.length - 1 : selected - 1,
    );
  };

  const nextImage = () => {
    if (selected === null) return;

    setSelected(
      selected === images.length - 1 ? 0 : selected + 1,
    );
  };

  // Keyboard controls
  useEffect(() => {
    if (selected === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeGallery();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <>
      <section
        id="gallery"
        className="section overflow-hidden bg-white"
      >
        <div className="container">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label">
              Gallery
            </div>

            <div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <h2 className="section-title mt-0">
                  Moments that bring us together.
                </h2>

                <p className="section-description">
                  A collection of memories, gatherings and moments
                  from the AIJR community.
                </p>
              </div>

              <div className="shrink-0">
                <span className="rounded-full border border-[#056839]/15 bg-[#056839]/5 px-4 py-2 text-xs font-semibold text-[#056839]">
                  {images.length} Community Moments
                </span>
              </div>
            </div>
          </motion.div>

          {/* Gallery grid */}
          <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {images.map((src, index) => {
              const featured =
                index === 0 ||
                index === 4 ||
                index === 7 ||
                index === 11;

              return (
                <motion.button
                  key={src}
                  type="button"
                  onClick={() => setSelected(index)}
                  initial={{
                    opacity: 0,
                    y: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: Math.min(index * 0.04, 0.3),
                  }}
                  whileHover={{
                    y: -6,
                  }}
                  className={`group relative overflow-hidden rounded-2xl bg-[#034d2a] text-left ${
                    featured
                      ? "col-span-2 aspect-[2/1]"
                      : "aspect-square"
                  }`}
                  aria-label={`Open gallery image ${index + 1}`}
                >
                  <Image
                    src={src}
                    alt={`AIJR community moment ${index + 1}`}
                    fill
                    sizes={
                      featured
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 50vw, 25vw"
                    }
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-60 transition duration-500 group-hover:opacity-90" />

                  {/* Expand icon */}
                  <div className="absolute right-4 top-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white opacity-0 backdrop-blur-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Expand size={16} />
                  </div>

                  {/* Bottom label */}
                  <div className="absolute bottom-4 left-4 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ead493]">
                      AIJR
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      View moment
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fullscreen gallery */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
            onClick={closeGallery}
          >
            {/* Close */}
            <button
              type="button"
              onClick={closeGallery}
              className="absolute right-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
              aria-label="Close gallery"
            >
              <X size={21} />
            </button>

            {/* Counter */}
            <div className="absolute left-5 top-5 z-30 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
              {selected + 1} / {images.length}
            </div>

            {/* Previous */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                previousImage();
              }}
              className="absolute left-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:left-6"
              aria-label="Previous image"
            >
              <ArrowLeft size={21} />
            </button>

            {/* Image */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.92,
              }}
              transition={{
                duration: 0.3,
              }}
              className="relative h-[78vh] w-[82vw] max-w-6xl"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={images[selected]}
                alt={`AIJR community moment ${selected + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Next */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              className="absolute right-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:right-6"
              aria-label="Next image"
            >
              <ArrowRight size={21} />
            </button>

            {/* Hint */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white/45 backdrop-blur-md">
              ← → Navigate &nbsp; • &nbsp; ESC Close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}