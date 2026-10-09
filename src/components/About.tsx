"use client";

import Image from "next/image";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  {
    number: "01",
    title: "Community",
    text: "Creating meaningful connections between families and individuals.",
  },
  {
    number: "02",
    title: "Unity",
    text: "Bringing people together through shared identity and values.",
  },
  {
    number: "03",
    title: "Opportunity",
    text: "Creating platforms that encourage growth and collaboration.",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="section overflow-hidden bg-[#f8f7f1]"
    >
      <div className="container">
        {/* Main introduction */}
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image
                src="/images/about/community.jpeg"
                alt="AIJR community"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover transition duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#034d2a]/70 via-transparent to-transparent" />

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/15 bg-black/20 p-5 text-white backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d7b765] text-[#15231c]">
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      One community
                    </p>

                    <p className="text-xs text-white/55">
                      Connected by shared values
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-5 -right-5 -z-0 h-28 w-28 rounded-full border border-[#d7b765]/40" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <div className="section-label">
              About AIJR
            </div>

            <h2 className="section-title">
              A community connected by identity, values and progress.
            </h2>

            <p className="section-description">
              All India Jamat Rayeen is built around the vision of creating
              stronger connections within the Rayeen community while supporting
              collective growth and positive progress.
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#66746c]">
              Through community initiatives, events and meaningful
              connections, AIJR aims to provide a platform where individuals
              and families can come together, share opportunities and build a
              stronger future.
            </p>

            <a
              href="#membership"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#056839] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#034d2a]"
            >
              Join the Community

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition group-hover:translate-x-1">
                <ArrowUpRight size={15} />
              </span>
            </a>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#056839]">
              What we stand for
            </p>

            <h3 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Built on values that bring people together.
            </h3>
          </motion.div>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {values.map((value, index) => (
              <motion.div
                key={value.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -7 }}
                className="group rounded-3xl border border-[#e3e4dc] bg-white p-7 transition-shadow hover:shadow-xl hover:shadow-[#056839]/5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#d7b765]">
                    {value.number}
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#056839]/5 text-[#056839] transition group-hover:bg-[#056839] group-hover:text-white">
                    <Check size={16} />
                  </div>
                </div>

                <h4 className="mt-8 text-2xl font-semibold">
                  {value.title}
                </h4>

                <p className="mt-3 leading-7 text-[#66746c]">
                  {value.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Highlight stats */}
        <div className="mt-20 overflow-hidden rounded-[2rem] bg-[#056839]">
          <div className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              ["Community", "Connected across India"],
              ["Unity", "Stronger together"],
              ["Progress", "Building for tomorrow"],
            ].map(([title, subtitle], index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 sm:p-10"
              >
                <p className="text-3xl font-bold text-white sm:text-4xl">
                  {title}
                </p>

                <p className="mt-2 text-sm text-white/55">
                  {subtitle}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}