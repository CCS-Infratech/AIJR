"use client";

import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#056839] text-white lg:min-h-[760px]"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.10),transparent_25%),radial-gradient(circle_at_80%_70%,rgba(215,183,101,0.12),transparent_30%)]" />

      {/* Decorative circle */}
      <motion.div
        className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full border border-white/10"
        animate={{
          rotate: 360,
          scale: [1, 1.08, 1],
        }}
        transition={{
          rotate: {
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      {/* Grid background */}
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

      {/* Hero content */}
      <div className="container relative z-10 flex min-h-screen items-center lg:min-h-[760px]">
        <div className="grid w-full gap-9 py-28 sm:gap-12 sm:py-32 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-32">
          {/* LEFT CONTENT */}
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-3"
            >
              <span className="h-[2px] w-8 shrink-0 bg-[#d7b765] sm:w-10" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#ead493] sm:text-xs sm:tracking-[0.28em]">
                All India Jamiat Rayeen
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.85,
                delay: 0.1,
              }}
              className="mt-6 max-w-4xl text-[clamp(2.6rem,11vw,3.75rem)] font-bold leading-[0.96] tracking-[-0.055em] sm:mt-7 sm:text-6xl lg:text-[88px]"
            >
              Together we build
              <span className="mt-2 block text-[#ead493]">
                a stronger community.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.25,
              }}
              className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:mt-8 sm:text-lg sm:leading-8"
            >
              Connecting families, empowering individuals and creating
              opportunities for the Rayeen community across India.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.35,
              }}
              className="mt-7 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:gap-3"
            >
              <motion.a
                href="#about"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d7b765] px-7 py-3.5 text-sm font-bold text-[#15231c] shadow-xl sm:w-auto sm:py-4"
              >
                Discover AIJR
                <ArrowRight size={17} />
              </motion.a>

              <motion.a
                href="#membership"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold backdrop-blur-md transition hover:bg-white/10 sm:w-auto sm:py-4"
              >
                Join Our Community
              </motion.a>
            </motion.div>
          </div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 45, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.25,
            }}
            className="relative mx-auto w-full max-w-[420px] lg:max-w-[480px]"
          >
            {/* Main image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/15 shadow-2xl shadow-[#034d2a]/40 sm:aspect-[4/5] sm:rounded-[2rem]">
              <Image
                src="/images/gallery/1.jpeg"
                alt="AIJR community"
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 480px"
                className="object-cover transition duration-700 hover:scale-105"
              />

              {/* Dark gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

              {/* Image label */}
              <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                {/* AIJR badge */}
                <div className="rounded-full border border-white/15 bg-black/20 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.22em] backdrop-blur-md sm:px-4 sm:py-2 sm:text-[10px]">
                  AIJR
                </div>
              </div>

              {/* Image caption */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ead493] sm:text-xs">
                  Community
                </p>

                <h2 className="mt-1.5 text-xl font-semibold sm:mt-2 sm:text-2xl">
                  United by heritage.
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-white/70 sm:mt-2 sm:text-sm sm:leading-6">
                  Connecting people, preserving values and building a stronger
                  future together.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Explore scroll button */}
      <motion.a
        href="#about"
        aria-label="Scroll to About AIJR"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.8,
        }}
        className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 sm:bottom-7"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="group flex flex-col items-center gap-1.5 text-white/50 transition hover:text-white sm:gap-2"
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] sm:text-[10px]">
            Explore
          </span>

          <ArrowDown
            size={15}
            className="transition-transform duration-300 group-hover:translate-y-1"
          />
        </motion.div>
      </motion.a>
    </section>
  );
}
