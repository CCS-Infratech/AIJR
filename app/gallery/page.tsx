"use client";

import Image from "next/image";
import { ArrowLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import Navbar from "@/components/Navbar";

const galleryImages = [
  1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-[#f8f7f1]">
        <section className="relative overflow-hidden bg-[#056839] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.10),transparent_28%),radial-gradient(circle_at_85%_80%,rgba(215,183,101,0.14),transparent_30%)]" />
          <div className="container relative z-10 py-28 pt-36 sm:py-32 sm:pt-40">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl"
            >
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ead493]">
                Gallery
              </p>
              <h1 className="mt-5 text-5xl font-bold tracking-tight sm:text-7xl">
                Moments worth remembering.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                Browse community moments, gatherings and memories from AIJR.
                Click any image to view it larger.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="bg-[#f8f7f1]">
          <div className="container py-20 sm:py-28">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {galleryImages.map((image, index) => (
                <motion.button
                  type="button"
                  key={image}
                  onClick={() => setSelectedImage(image)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.03, 0.2) }}
                  whileHover={{ y: -4 }}
                  className={`group relative overflow-hidden rounded-[1.5rem] bg-[#034d2a] text-left ${
                    index === 0 || index === 7
                      ? "col-span-2 aspect-[4/3]"
                      : "aspect-square"
                  }`}
                >
                  <Image
                    src={`/images/gallery/${image}.jpeg`}
                    alt={`AIJR community gallery image ${image}`}
                    fill
                    sizes={
                      index === 0 || index === 7
                        ? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
                        : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    }
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                </motion.button>
              ))}
            </div>

            <a
              href="/"
              className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-[#056839]"
            >
              <ArrowLeft size={16} />
              Back to Home
            </a>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              aria-label="Close gallery viewer"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:right-8 sm:top-8"
            >
              <X size={22} />
            </button>

            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative h-[80vh] w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={`/images/gallery/${selectedImage}.jpeg`}
                alt={`AIJR community gallery image ${selectedImage}`}
                fill
                sizes="95vw"
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-[#034d2a] text-white">
        <div className="container py-10 sm:py-12">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold tracking-wide">
                ALL INDIA JAMAT RAYEEN
              </p>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/50">
                Connecting families, empowering individuals and building a
                stronger community together.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a href="/" className="rounded-lg px-3 py-2 text-sm text-white/55 transition hover:bg-white/5 hover:text-white">
                Home
              </a>
              <a href="/events" className="rounded-lg px-3 py-2 text-sm text-white/55 transition hover:bg-white/5 hover:text-white">
                Events
              </a>
              <a href="/gallery" className="rounded-lg px-3 py-2 text-sm text-white/55 transition hover:bg-white/5 hover:text-white">
                Gallery
              </a>
              <a href="/#contact" className="rounded-lg px-3 py-2 text-sm text-white/55 transition hover:bg-white/5 hover:text-white">
                Contact
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} All India Jamat Rayeen. All rights
              reserved.
            </p>
            <p>Unity • Community • Progress</p>
          </div>
        </div>
      </footer>
    </>
  );
}
