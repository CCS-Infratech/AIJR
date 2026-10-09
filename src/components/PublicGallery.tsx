"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Images,
  Maximize2,
  Play,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";

type Item = {
  id: string;
  url: string;
  alt: string;
  type: "IMAGE" | "VIDEO";
  title?: string | null;
  caption?: string | null;
  category?: string | null;
};

type Props = {
  items: Item[];
};

function tileAspect(index: number) {
  if (index === 0) return "aspect-[4/3]";
  if (index % 7 === 0) return "aspect-[16/10]";
  if (index % 5 === 0) return "aspect-[4/5]";
  if (index % 3 === 0) return "aspect-[5/6]";
  return "aspect-[4/3]";
}

function displayCategory(item: Item) {
  return item.category?.trim() || "Community";
}

function displayTitle(item: Item, index: number) {
  return (
    item.title?.trim() ||
    item.caption?.trim() ||
    `AIJR community moment ${index + 1}`
  );
}

export default function PublicGallery({ items }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(items.map((item) => displayCategory(item)))
    );

    return ["All", ...values];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return items;

    return items.filter(
      (item) => displayCategory(item) === selectedCategory
    );
  }, [items, selectedCategory]);

  const selected =
    selectedIndex !== null ? filteredItems[selectedIndex] ?? null : null;

  const videoCount = useMemo(
    () => items.filter((item) => item.type === "VIDEO").length,
    [items]
  );

  function openViewer(id: string) {
    const index = filteredItems.findIndex((item) => item.id === id);
    if (index >= 0) {
      setSelectedIndex(index);
    }
  }

  function closeViewer() {
    setSelectedIndex(null);
  }

  function previous() {
    if (!filteredItems.length) return;

    setSelectedIndex((current) => {
      if (current === null) return 0;
      return current === 0
        ? filteredItems.length - 1
        : current - 1;
    });
  }

  function next() {
    if (!filteredItems.length) return;

    setSelectedIndex((current) => {
      if (current === null) return 0;
      return current === filteredItems.length - 1
        ? 0
        : current + 1;
    });
  }

  useEffect(() => {
    setSelectedIndex(null);
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedIndex(null);
        return;
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) => {
          if (current === null || filteredItems.length === 0) {
            return current;
          }

          return current === 0
            ? filteredItems.length - 1
            : current - 1;
        });
        return;
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) => {
          if (current === null || filteredItems.length === 0) {
            return current;
          }

          return current === filteredItems.length - 1
            ? 0
            : current + 1;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, filteredItems.length]);

  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-[#f8f7f1] text-[#15231c]">
        <section className="relative overflow-hidden bg-[#034d2a] text-white">
          <div className="absolute inset-0">
            <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-40 right-[-5rem] h-96 w-96 rounded-full bg-[#d7b765]/15 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,.025)_35%,transparent_65%)]" />
          </div>

          <div className="container relative z-10 py-24 pt-32 sm:py-32 sm:pt-40">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="max-w-4xl"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#ead493]">
                  AIJR Gallery
                </span>

                <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white/75">
                  {items.length} moments
                </span>
              </div>

              <h1 className="mt-7 max-w-4xl text-5xl font-bold tracking-[-0.04em] sm:text-7xl lg:text-[6.25rem] lg:leading-[0.95]">
                Moments worth remembering.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
                A visual record of gatherings, celebrations and the people
                who make the AIJR community stronger.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
              className="mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3"
            >
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold">{items.length}</p>
                <p className="mt-1 text-xs text-white/55">Published moments</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold">{categories.length - 1}</p>
                <p className="mt-1 text-xs text-white/55">Collections</p>
              </div>

              <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:col-span-1">
                <p className="text-2xl font-bold">{videoCount}</p>
                <p className="mt-1 text-xs text-white/55">Video moments</p>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
        </section>

        <section>
          <div className="container py-16 sm:py-24">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#056839]">
                  Explore the collection
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Community in frames.
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-7 text-[#66746c]">
                Browse by collection or open any photograph for a larger,
                distraction-free view.
              </p>
            </div>

            <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((category) => {
                const active = selectedCategory === category;
                const count =
                  category === "All"
                    ? items.length
                    : items.filter(
                        (item) => displayCategory(item) === category
                      ).length;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-bold transition ${
                      active
                        ? "border-[#056839] bg-[#056839] text-white shadow-sm"
                        : "border-[#dfe1d8] bg-white text-[#34423a] hover:border-[#056839]/30 hover:bg-[#056839]/5"
                    }`}
                  >
                    {category}
                    <span className={`ml-2 ${active ? "text-white/65" : "text-[#89948d]"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex items-center justify-between gap-4 border-b border-[#e3e4dc] pb-4">
              <p className="text-sm font-semibold text-[#34423a]">
                Showing{" "}
                <span className="text-[#056839]">
                  {filteredItems.length}
                </span>{" "}
                {filteredItems.length === 1 ? "moment" : "moments"}
              </p>

              <div className="hidden items-center gap-2 text-xs text-[#89948d] sm:flex">
                <Images size={15} />
                Click a moment to explore
              </div>
            </div>

            {filteredItems.length ? (
              <motion.div
                layout
                className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3"
              >
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item, index) => (
                    <motion.article
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 24, scale: 0.98 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-60px" }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{
                        duration: 0.55,
                        delay: Math.min(index * 0.035, 0.28),
                        ease: "easeOut",
                      }}
                      className="mb-5 break-inside-avoid"
                    >
                      <button
                        type="button"
                        onClick={() => openViewer(item.id)}
                        className={`group relative block w-full overflow-hidden rounded-[2rem] bg-[#034d2a] text-left shadow-sm ring-1 ring-[#15231c]/5 transition duration-500 hover:-translate-y-1 hover:shadow-xl ${tileAspect(index)}`}
                        aria-label={`Open ${displayTitle(item, index)}`}
                      >
                        {item.type === "VIDEO" ? (
                          <video
                            src={item.url}
                            muted
                            playsInline
                            preload="metadata"
                            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <Image
                            src={item.url}
                            alt={item.alt}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            unoptimized
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent opacity-90 transition duration-500 group-hover:from-black/85" />

                        <div className="absolute left-4 top-4 flex items-center gap-2">
                          {index === 0 && (
                            <span className="rounded-full bg-[#d7b765] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#15231c]">
                              Featured moment
                            </span>
                          )}

                          {item.type === "VIDEO" && (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#15231c] shadow-sm backdrop-blur">
                              <Play size={13} fill="currentColor" />
                            </span>
                          )}
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                          <div className="flex items-end justify-between gap-4">
                            <div className="min-w-0">
                              <span className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70 backdrop-blur">
                                {displayCategory(item)}
                              </span>

                              <h3 className="mt-3 line-clamp-2 text-base font-bold text-white sm:text-lg">
                                {displayTitle(item, index)}
                              </h3>

                              {item.caption &&
                                item.title &&
                                item.caption !== item.title && (
                                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/60">
                                    {item.caption}
                                  </p>
                                )}
                            </div>

                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-[#15231c]">
                              <Maximize2 size={16} />
                            </span>
                          </div>
                        </div>
                      </button>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="mt-10 rounded-[2rem] border border-dashed border-[#dfe1d8] bg-white px-6 py-20 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#056839]/10 text-[#056839]">
                  <Images size={24} />
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Nothing in this collection yet.
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#66746c]">
                  Try another collection or come back when more community
                  moments are published.
                </p>
              </div>
            )}

            <div className="mt-16 flex flex-col gap-5 rounded-[2rem] bg-[#034d2a] p-6 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ead493]">
                  Keep exploring
                </p>

                <h3 className="mt-3 text-2xl font-bold">
                  More stories live in our events.
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                  Discover the gatherings behind the photographs and explore
                  their event galleries.
                </p>
              </div>

              <Link
                href="/events"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#d7b765] px-6 py-3.5 text-sm font-bold text-[#15231c] transition hover:bg-[#ead493]"
              >
                Explore Events
                <ChevronRight size={16} />
              </Link>
            </div>

            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#056839] transition hover:gap-3"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {selected && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Gallery viewer"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeViewer();
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ duration: 0.3 }}
              className="relative flex max-h-[94vh] w-full max-w-7xl flex-col"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between gap-3 px-1 sm:px-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
                    {displayCategory(selected)}
                  </span>

                  <span className="text-xs font-semibold text-white/45">
                    {selectedIndex + 1} / {filteredItems.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={closeViewer}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="Close gallery"
                >
                  <X size={21} />
                </button>
              </div>

              <div className="relative min-h-0 flex-1 rounded-[1.5rem] border border-white/10 bg-[#0a120e] p-2 shadow-2xl sm:p-4">
                <div className="flex min-h-0 h-full items-center justify-center">
                  {selected.type === "VIDEO" ? (
                    <video
                      key={selected.id}
                      src={selected.url}
                      controls
                      playsInline
                      className="max-h-[72vh] w-auto max-w-full rounded-xl object-contain"
                    />
                  ) : (
                    <Image
                      key={selected.id}
                      src={selected.url}
                      alt={selected.alt}
                      width={2200}
                      height={1600}
                      unoptimized
                      className="max-h-[72vh] w-auto max-w-full rounded-xl object-contain"
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={previous}
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white backdrop-blur transition hover:bg-white hover:text-[#15231c] sm:left-5 sm:h-12 sm:w-12"
                  aria-label="Previous gallery item"
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  type="button"
                  onClick={next}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white backdrop-blur transition hover:bg-white hover:text-[#15231c] sm:right-5 sm:h-12 sm:w-12"
                  aria-label="Next gallery item"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              <div className="mt-4 px-1 sm:px-2">
                <h3 className="text-base font-bold text-white sm:text-lg">
                  {displayTitle(selected, selectedIndex)}
                </h3>

                {selected.caption &&
                  selected.caption !== selected.title && (
                    <p className="mt-1 max-w-3xl text-sm leading-6 text-white/55">
                      {selected.caption}
                    </p>
                  )}

                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
                  Use ← → to navigate · Esc to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
