"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";

const events = [
  {
    date: "15",
    month: "AUG",
    title: "Community Gathering",
    description:
      "A special gathering bringing members of the community together for meaningful conversations, connection and collective progress.",
    image: "/images/gallery/4.jpeg",
    category: "Community",
  },
  {
    date: "22",
    month: "SEP",
    title: "Youth Development Meet",
    description:
      "An initiative focused on connecting young members and encouraging education, leadership and new opportunities.",
    image: "/images/gallery/5.jpeg",
    category: "Youth",
  },
  {
    date: "05",
    month: "OCT",
    title: "Community Celebration",
    description:
      "Celebrating our shared identity, traditions and the people who continue to strengthen our community.",
    image: "/images/gallery/6.jpeg",
    category: "Celebration",
  },
];

export default function EventsPage() {
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
                Events & News
              </p>
              <h1 className="mt-5 text-5xl font-bold tracking-tight sm:text-7xl">
                Stay connected with what&apos;s happening.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                Explore upcoming gatherings, initiatives and important moments
                from across the AIJR community.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="bg-[#f8f7f1]">
          <div className="container py-20 sm:py-28">
            <div className="mb-10 flex items-center gap-3 text-sm font-semibold text-[#66746c]">
              <CalendarDays size={18} className="text-[#056839]" />
              Upcoming community moments
            </div>

            <div className="grid gap-7 lg:grid-cols-3">
              {events.map((event, index) => (
                <motion.article
                  key={event.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="group overflow-hidden rounded-[2rem] border border-[#e3e4dc] bg-white shadow-sm transition-shadow hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    <div className="absolute left-5 top-5 flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-white text-[#15231c] shadow-lg">
                      <span className="text-xl font-bold leading-none">{event.date}</span>
                      <span className="mt-1 text-[9px] font-bold tracking-[0.18em] text-[#056839]">
                        {event.month}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#056839]">
                      {event.category}
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-[#15231c]">
                      {event.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[#66746c]">
                      {event.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-16 rounded-[2rem] border border-[#e3e4dc] bg-white p-7 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#056839]">
                Have an event to share?
              </p>
              <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-bold tracking-tight text-[#15231c] sm:text-4xl">
                    Help us keep the community calendar growing.
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#66746c] sm:text-base">
                    Share your gathering or initiative with the AIJR team through
                    the contact form.
                  </p>
                </div>
                <Link
                  href="/#contact"
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-[#056839] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#034d2a]"
                >
                  Share an Event
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <Link
              href="/"
              className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-[#056839]"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </section>
      </main>

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
              <Link href="/" className="rounded-lg px-3 py-2 text-sm text-white/55 transition hover:bg-white/5 hover:text-white">
                Home
              </Link>
              <Link href="/events" className="rounded-lg px-3 py-2 text-sm text-white/55 transition hover:bg-white/5 hover:text-white">
                Events
              </Link>
              <Link href="/gallery" className="rounded-lg px-3 py-2 text-sm text-white/55 transition hover:bg-white/5 hover:text-white">
                Gallery
              </Link>
              <Link href="/#contact" className="rounded-lg px-3 py-2 text-sm text-white/55 transition hover:bg-white/5 hover:text-white">
                Contact
              </Link>
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
