"use client";

import Image from "next/image";
import { ArrowDown, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#056839] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.10),transparent_25%),radial-gradient(circle_at_80%_70%,rgba(215,183,101,0.12),transparent_30%)]" />

      <motion.div
        className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full border border-white/10"
        animate={{
          rotate: 360,
          scale: [1, 1.08, 1],
        }}
        transition={{
          rotate: { duration: 35, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <div className="absolute inset-0 opacity-[0.045]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>

      <div className="container relative z-10 flex min-h-screen items-center">
        <div className="grid w-full gap-12 py-32 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-3"
            >
              <span className="h-[2px] w-10 bg-[#d7b765]" />

              <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#ead493]">
                All India Jamiat Rayeen
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1 }}
              className="mt-7 max-w-4xl text-5xl font-bold leading-[0.96] tracking-[-0.055em] sm:text-6xl lg:text-[88px]"
            >
              Together we build
              <span className="mt-2 block text-[#ead493]">
                a stronger community.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-8 max-w-xl text-base leading-8 text-white/70 sm:text-lg"
            >
              Connecting families, empowering individuals and creating
              opportunities for the Rayeen community across India.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <motion.a
                href="#about"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d7b765] px-7 py-4 text-sm font-bold text-[#15231c] shadow-xl"
              >
                Discover AIJR
                <ArrowRight size={17} />
              </motion.a>

              <motion.a
                href="#membership"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold backdrop-blur-md transition hover:bg-white/10"
              >
                Join Our Community
              </motion.a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 45, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.25 }}
            className="relative mx-auto w-full max-w-[480px]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl shadow-[#034d2a]/40">
              <Image
                src="/images/gallery/1.jpeg"
                alt="AIJR community"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 480px"
                className="object-cover transition duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

              <div className="absolute left-6 right-6 top-6 flex justify-between">
                <div className="rounded-full border border-white/15 bg-black/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] backdrop-blur-md">
                  AIJR
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                  <Play size={15} fill="currentColor" />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ead493]">
                  Community
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  United by heritage.
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/70">
                  Connecting people, preserving values and building a stronger
                  future together.
                </p>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-5 -left-5 rounded-2xl border border-white/15 bg-[#034d2a]/90 px-5 py-4 shadow-xl backdrop-blur-xl"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                Built together
              </p>
              <p className="mt-1 text-sm font-semibold text-[#ead493]">
                One community. One vision.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-white/45">
          <span className="text-[10px] uppercase tracking-[0.3em]">
            Explore
          </span>
          <ArrowDown size={16} />
        </div>
      </motion.a>
    </section>
  );
}