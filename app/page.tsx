"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Mail,
  MapPin,
  Phone,
  Users,
  CalendarDays,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";
import AIJRMarquee from "@/components/AIJRMarquee";
import Gallery from "@/components/Gallery";

const events = [
  {
    date: "15",
    month: "AUG",
    title: "Community Gathering",
    description:
      "A special gathering bringing members of the community together for meaningful conversations, connection and collective progress.",
    image: "/images/gallery/4.jpeg",
  },
  {
    date: "22",
    month: "SEP",
    title: "Youth Development Meet",
    description:
      "An initiative focused on connecting young members and encouraging education, leadership and new opportunities.",
    image: "/images/gallery/5.jpeg",
  },
  {
    date: "05",
    month: "OCT",
    title: "Community Celebration",
    description:
      "Celebrating our shared identity, traditions and the people who continue to strengthen our community.",
    image: "/images/gallery/6.jpeg",
  },
];

const teamMembers = [
  {
    name: "Zeeshan Aslam Rayeen",
    role: "President",
    initials: "ZA",
    image: "/images/team/zeesha_aslam_rayeen.jpg",
  },
  {
    name: "Suhail Akram Rayeen",
    role: "Senior Vice President",
    initials: "SA",
    image: "/images/team/suhain_akram_rayeen.jpeg",
  },
  {
    name: "Faisal Aslam Rayeen",
    role: "Vice President",
    initials: "FA",
    image: "/images/team/faisal_aslam_rayeen.jpeg",
  },
  {
    name: "Mohd. Shariq Rayeen",
    role: "General Secretary",
    initials: "MS",
    image: "/images/team/mohd_shariq_rayeen.jpeg",
  },
  {
    name: "Mohd Imran Rayeen",
    role: "Organizing Secretary",
    initials: "MI",
    image: "/images/team/mohd_imran_rayeen.jpeg",
  },
];

const benefits = [
  "Connect with the Rayeen community",
  "Participate in community initiatives",
  "Stay updated with events and activities",
  "Support education and development efforts",
  "Build meaningful professional and social connections",
];

export default function Home() {
  const [siteSettings, setSiteSettings] =
    useState(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/site-settings", {
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load site settings.");
        }

        return response.json();
      })
      .then((result) => {
        if (
          !cancelled &&
          result?.success &&
          result?.data &&
          typeof result.data === "object"
        ) {
          setSiteSettings({
            ...DEFAULT_SITE_SETTINGS,
            ...result.data,
          });
        }
      })
      .catch(() => {
        // Keep the known-safe public defaults.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [contactSent, setContactSent] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState("");

  return (
    <>
      <Navbar />

      <main className="overflow-hidden">
        {/* HERO / FRONT PAGE */}
        <Hero />

        {/* ABOUT */}
        <About />

        <AIJRMarquee />

        {/* COMMUNITY HIGHLIGHT */}
        <section className="relative overflow-hidden bg-[#034d2a] text-white">
          <div
            aria-hidden="true"
            className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#056839]/40 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#d7b765]/10 blur-3xl"
          />

          <div className="container relative z-10 py-8 sm:py-10">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: Users,
                  value: "One Community",
                  label: "Connected across India",
                },
                {
                  icon: CalendarDays,
                  value: "Shared Future",
                  label: "Built through collective effort",
                },
                {
                  icon: Check,
                  value: "Stronger Together",
                  label: "United by values and identity",
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.value}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                    }}
                    whileHover={{ y: -5 }}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d7b765] text-[#15231c] shadow-lg">
                        <Icon size={19} />
                      </div>

                      <span className="text-xs font-bold tracking-[0.2em] text-white/30">
                        0{index + 1}
                      </span>
                    </div>

                    <p className="mt-6 text-lg font-bold tracking-tight">
                      {item.value}
                    </p>

                    <p className="mt-1 text-sm text-white/55">
                      {item.label}
                    </p>

                    <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-[#d7b765] transition-transform duration-500 group-hover:scale-x-100" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section id="team" className="bg-white">
          <div className="container py-24 sm:py-28">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mx-auto max-w-2xl text-center"
            >
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#056839]">
                Our Team
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#15231c] sm:text-5xl">
                Leadership that serves the community.
              </h2>

              <p className="mt-5 text-base leading-8 text-[#66746c] sm:text-lg">
                A dedicated leadership working toward unity, development and
                progress for the Rayeen community across India.
              </p>
            </motion.div>

            <div className="aijr-team-grid mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.01 }}
                  className="aijr-team-card group relative overflow-hidden rounded-[2rem] border border-[#e3e4dc] bg-[#f8f7f1] p-6 shadow-sm transition-all duration-500 hover:border-[#d7b765]/50 hover:shadow-2xl hover:shadow-[#056839]/10"
                >
                  <div className="aijr-team-image relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.15),transparent_28%),radial-gradient(circle_at_80%_75%,rgba(215,183,101,0.18),transparent_30%)]" />

                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain bg-white"
                    />
                  </div>

                  <div className="pt-6">
                    <h3 className="text-xl font-semibold text-[#15231c]">
                      {member.name}
                    </h3>

                    <p className="mt-3 inline-flex rounded-full bg-[#056839]/8 px-3 py-1.5 text-xs font-semibold text-[#056839]">
                      {member.role}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section
          id="events"
          className="relative overflow-hidden bg-[#f8f7f1]"
        >
          <div
            aria-hidden="true"
            className="absolute -right-32 top-16 h-80 w-80 rounded-full bg-[#056839]/5 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-[#d7b765]/10 blur-3xl"
          />

          <div className="container relative z-10 py-24 sm:py-28">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="max-w-3xl"
              >
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-[#d7b765]" />
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#056839]">
                    Events & News
                  </p>
                </div>

                <h2 className="mt-5 text-4xl font-bold tracking-tight text-[#15231c] sm:text-5xl lg:text-6xl">
                  Moments that bring the community together.
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-8 text-[#66746c] sm:text-lg">
                  Discover upcoming gatherings, initiatives and important
                  moments from across the AIJR community.
                </p>
              </motion.div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/events"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#056839] px-5 py-3 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#034d2a] hover:shadow-lg"
                >
                  View all events
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-[#056839]/20 bg-white px-5 py-3 text-sm font-bold text-[#056839] transition duration-300 hover:-translate-y-0.5 hover:border-[#056839] hover:shadow-md"
                >
                  Share an Event
                </a>
              </div>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
              <motion.article
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-[2.25rem] border border-[#e3e4dc] bg-white shadow-sm transition-shadow duration-500 hover:shadow-2xl"
              >
                <div className="relative h-[320px] overflow-hidden sm:h-[410px] lg:h-[430px]">
                  <Image
                    src={events[0].image}
                    alt={events[0].title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-cover transition duration-1000 ease-out group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#15231c]/85 via-[#15231c]/20 to-transparent" />

                  <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/20 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    Featured community moment
                  </div>

                  <div className="absolute bottom-5 left-5 flex h-[76px] w-[76px] flex-col items-center justify-center rounded-[1.35rem] bg-white text-[#15231c] shadow-xl sm:bottom-7 sm:left-7 sm:h-[88px] sm:w-[88px]">
                    <span className="text-2xl font-bold leading-none sm:text-3xl">
                      {events[0].date}
                    </span>
                    <span className="mt-1 text-[9px] font-bold tracking-[0.2em] text-[#056839]">
                      {events[0].month}
                    </span>
                  </div>
                </div>

                <div className="relative p-6 sm:p-8">
                  <div className="absolute inset-x-8 top-0 h-1 -translate-y-1/2 origin-left scale-x-0 bg-[#d7b765] transition-transform duration-500 group-hover:scale-x-100" />

                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#056839]">
                        01 / AIJR Events
                      </p>

                      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#15231c] sm:text-3xl">
                        {events[0].title}
                      </h3>
                    </div>

                    <ArrowRight
                      size={20}
                      className="mt-1 shrink-0 text-[#056839] transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[#66746c] sm:text-base">
                    {events[0].description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#66746c]">
                    <CalendarDays size={15} className="text-[#056839]" />
                    Community gathering
                  </div>
                </div>
              </motion.article>

              <div className="grid gap-6">
                {events.slice(1).map((event, index) => (
                  <motion.article
                    key={event.title}
                    initial={{ opacity: 0, x: 25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{
                      duration: 0.65,
                      delay: index * 0.12,
                    }}
                    whileHover={{ y: -6 }}
                    className="group overflow-hidden rounded-[2rem] border border-[#e3e4dc] bg-white shadow-sm transition-shadow duration-500 hover:shadow-xl"
                  >
                    <div className="grid min-h-[245px] sm:grid-cols-[0.95fr_1.05fr]">
                      <div className="relative min-h-[220px] overflow-hidden sm:min-h-0">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 35vw"
                          className="object-cover transition duration-700 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#15231c]/65 via-transparent to-transparent" />

                        <div className="absolute left-4 top-4 flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-white text-[#15231c] shadow-lg">
                          <span className="text-lg font-bold leading-none">
                            {event.date}
                          </span>
                          <span className="mt-1 text-[8px] font-bold tracking-[0.16em] text-[#056839]">
                            {event.month}
                          </span>
                        </div>
                      </div>

                      <div className="relative flex flex-col justify-center p-6 sm:p-7">
                        <div className="absolute inset-y-6 left-0 w-1 origin-bottom scale-y-0 bg-[#d7b765] transition-transform duration-500 group-hover:scale-y-100" />

                        <div className="flex items-center justify-between gap-4">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#056839]">
                            {String(index + 2).padStart(2, "0")} / AIJR Events
                          </p>

                          <ArrowRight
                            size={18}
                            className="shrink-0 text-[#056839] transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </div>

                        <h3 className="mt-3 text-xl font-semibold tracking-tight text-[#15231c] sm:text-2xl">
                          {event.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#66746c]">
                          {event.description}
                        </p>

                        <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                          Community update
                        </p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <Gallery />

        {/* RAYEEN SHADI */}
        <section
          id="rayeen-shadi"
          className="relative overflow-hidden bg-[#056839] text-white"
        >
          <div
            aria-hidden="true"
            className="absolute -right-32 -top-28 h-96 w-96 rounded-full bg-[#d7b765]/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/[0.05] blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute right-[8%] top-[18%] hidden h-40 w-40 rounded-full border border-[#d7b765]/15 lg:block"
          />

          <div className="container relative z-10 py-24 sm:py-28 lg:py-32">
            <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.75 }}
              >
                <div className="flex items-center gap-3">
                  <span className="h-px w-12 bg-[#d7b765]" />

                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ead493]">
                    Rayeen Shadi
                  </p>
                </div>

                <h2 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                  Helping families connect in a meaningful way.
                </h2>

                <p className="mt-7 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
                  Explore the dedicated Rayeen Shadi platform created to help
                  members connect with suitable families and build meaningful
                  relationships.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {[
                    "CONNECT",
                    "DISCOVER",
                    "BELONG",
                  ].map((item, index) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.45,
                        delay: 0.15 + index * 0.08,
                      }}
                      className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[10px] font-bold tracking-[0.18em] text-white/70 backdrop-blur-sm"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>

                <a
                  href="https://rayeenshaadi.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#d7b765] px-7 py-4 text-sm font-bold text-[#15231c] shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:bg-[#ead493] hover:shadow-xl"
                >
                  Visit Rayeen Shadi
                  <ExternalLink
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30, scale: 0.96 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.85 }}
                className="relative mx-auto w-full max-w-xl"
              >
                <motion.div
                  aria-hidden="true"
                  className="absolute -inset-5 rounded-[2.5rem] border border-[#d7b765]/15"
                  animate={{
                    rotate: [0, 1.2, 0, -1.2, 0],
                    scale: [1, 1.015, 1],
                  }}
                  transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <motion.div
                  aria-hidden="true"
                  className="absolute -inset-8 rounded-[3rem] bg-[#d7b765]/10 blur-3xl"
                  animate={{ opacity: [0.25, 0.5, 0.25] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative rounded-[2.5rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-md sm:p-6">
                  <div className="rounded-[2rem] border border-[#d7b765]/20 bg-[#034d2a]/80 p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d7b765] text-[#15231c] shadow-lg">
                        <Users size={26} />
                      </div>

                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                        AIJR Community
                      </span>
                    </div>

                    <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.24em] text-[#d7b765]">
                      A dedicated space for connections
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">
                      Community connections matter.
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-white/60">
                      A dedicated platform can make it easier for families and
                      individuals to discover connections within the wider
                      Rayeen community.
                    </p>

                    <div className="mt-8 grid grid-cols-3 gap-3">
                      {[
                        "Families",
                        "Connections",
                        "Community",
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center"
                        >
                          <span className="block text-[9px] font-bold uppercase tracking-[0.1em] text-white/40">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 h-px bg-gradient-to-r from-[#d7b765]/50 via-white/10 to-transparent" />

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <span className="text-xs font-semibold text-white/45">
                        Explore the platform
                      </span>

                      <a
                        href="https://rayeenshaadi.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open Rayeen Shadi website"
                        className="group/arrow flex h-10 w-10 items-center justify-center rounded-full bg-[#d7b765] text-[#15231c] transition-transform duration-300 hover:translate-x-1"
                      >
                        <ArrowRight
                          size={17}
                          className="transition-transform duration-300 group-hover/arrow:translate-x-0.5"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* MEMBERSHIP */}
        <section
          id="membership"
          className="relative overflow-hidden bg-[#f8f7f1]"
        >
          <div
            aria-hidden="true"
            className="absolute -left-32 top-16 h-80 w-80 rounded-full bg-[#056839]/5 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#d7b765]/10 blur-3xl"
          />
          <div className="container relative z-10 py-24 sm:py-28 lg:py-32">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-[#034d2a] p-7 text-white shadow-2xl shadow-[#034d2a]/10 sm:p-10 lg:p-12"
              >
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d7b765]/20 bg-white/[0.06] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ead493]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d7b765]" />
                  AIJR Community
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#ead493]">
                  Membership
                </p>

                <h2 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Be a part of the community.
                </h2>

                <p className="mt-5 text-base leading-8 text-white/70">
                  Join AIJR and stay connected with people, initiatives,
                  events and opportunities across the community.
                </p>

                <div className="mt-8 space-y-4">
                  {benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/80 transition duration-300 hover:-translate-y-0.5 hover:border-[#d7b765]/30 hover:bg-white/[0.07]"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d7b765] text-[#15231c] shadow-sm">
                        <Check size={12} />
                      </span>

                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-20 -right-16 h-44 w-44 rounded-full border border-[#d7b765]/10"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-10 -right-6 h-24 w-24 rounded-full bg-[#d7b765]/10 blur-2xl"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="rounded-[2.5rem] border border-[#e3e4dc] bg-white p-5 shadow-xl shadow-[#15231c]/5 sm:p-8 lg:p-10"
              >
                {submitted ? (
                  <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#056839] text-white">
                      <Check size={28} />
                    </div>

                    <h3 className="mt-6 text-2xl font-semibold text-[#15231c]">
                      Thank you for your interest.
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-7 text-[#66746c]">
                      Your membership request has been submitted successfully.
                      The AIJR team will review your request and contact you.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormError("");
                      }}
                      className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#056839]/20 bg-white px-5 py-3 text-sm font-bold text-[#056839] transition hover:bg-[#056839] hover:text-white"
                    >
                      Submit another request
                      <ArrowRight size={15} />
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      setSubmitting(true);
                      setFormError("");

                      const form = e.currentTarget;

                      const formData = new FormData(form);

                      const payload = {
                        name: String(formData.get("name") || ""),
                        fatherName: String(formData.get("fatherName") || ""),
                        phone: String(formData.get("phone") || ""),
                        email: String(formData.get("email") || ""),
                        address: String(formData.get("address") || ""),
                        message: String(formData.get("message") || ""),
                      };

                      try {
                        const response = await fetch("/api/membership", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(payload),
                        });

                        const data = await response.json();

                        if (!response.ok || !data.success) {
                          throw new Error(
                            data.message || "Submission failed."
                          );
                        }

                        setSubmitted(true);
                        setFormError("");
                        form.reset();
                      } catch (error) {
                        console.error("Membership form error:", error);

                        setFormError(
                          error instanceof Error
                            ? error.message
                            : "Something went wrong. Please try again."
                        );
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#056839]">
                          Your next step
                        </p>

                        <span className="rounded-full bg-[#056839]/5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#056839]">
                          Join AIJR
                        </span>
                      </div>

                      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#15231c] sm:text-3xl">
                        Membership Form
                      </h3>

                      <p className="mt-2 max-w-lg text-sm leading-6 text-[#66746c]">
                        Register your interest in becoming part of AIJR.
                      </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="membership-name"
                          className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]"
                        >
                          Full Name
                        </label>

                        <input
                          id="membership-name"
                          required
                          type="text"
                          name="name"
                          autoComplete="name"
                          placeholder="Your full name"
                          className="w-full rounded-xl border border-[#dfe1d8] bg-white px-4 py-3.5 text-sm text-[#15231c] outline-none transition placeholder:text-[#66746c]/55 hover:border-[#056839]/30 focus:border-[#056839] focus:ring-4 focus:ring-[#056839]/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="membership-father-name"
                          className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]"
                        >
                          Father&apos;s Name
                        </label>

                        <input
                          id="membership-father-name"
                          required
                          type="text"
                          name="fatherName"
                          autoComplete="name"
                          placeholder="Father's full name"
                          className="w-full rounded-xl border border-[#dfe1d8] bg-white px-4 py-3.5 text-sm text-[#15231c] outline-none transition placeholder:text-[#66746c]/55 hover:border-[#056839]/30 focus:border-[#056839] focus:ring-4 focus:ring-[#056839]/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="membership-phone"
                          className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]"
                        >
                          Phone
                        </label>

                        <input
                          id="membership-phone"
                          required
                          type="tel"
                          name="phone"
                          autoComplete="tel"
                          inputMode="tel"
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full rounded-xl border border-[#dfe1d8] bg-white px-4 py-3.5 text-sm text-[#15231c] outline-none transition placeholder:text-[#66746c]/55 hover:border-[#056839]/30 focus:border-[#056839] focus:ring-4 focus:ring-[#056839]/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="membership-email"
                        className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]"
                      >
                        Email
                      </label>

                      <input
                        id="membership-email"
                        required
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-[#dfe1d8] bg-white px-4 py-3.5 text-sm text-[#15231c] outline-none transition placeholder:text-[#66746c]/55 hover:border-[#056839]/30 focus:border-[#056839] focus:ring-4 focus:ring-[#056839]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="membership-address"
                        className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]"
                      >
                        Address
                      </label>

                      <input
                        id="membership-address"
                        type="text"
                        name="address"
                        autoComplete="street-address"
                        placeholder="Your address"
                        className="w-full rounded-xl border border-[#dfe1d8] bg-white px-4 py-3.5 text-sm text-[#15231c] outline-none transition placeholder:text-[#66746c]/55 hover:border-[#056839]/30 focus:border-[#056839] focus:ring-4 focus:ring-[#056839]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="membership-message"
                        className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]"
                      >
                        Message
                      </label>

                      <textarea
                        id="membership-message"
                        name="message"
                        rows={4}
                        placeholder="Tell us a little about yourself..."
                        className="w-full resize-none rounded-xl border border-[#dfe1d8] bg-white px-4 py-3.5 text-sm text-[#15231c] outline-none transition placeholder:text-[#66746c]/55 hover:border-[#056839]/30 focus:border-[#056839] focus:ring-4 focus:ring-[#056839]/10"
                      />
                    </div>

                    {formError && (
                      <p className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                        {formError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#056839] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#056839]/15 transition hover:-translate-y-0.5 hover:bg-[#034d2a] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting
                        ? "Submitting..."
                        : "Submit Membership Request"}

                      {!submitting && <ArrowRight size={16} />}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CONNECT WITH US */}
        <section
          id="contact"
          className="relative overflow-hidden bg-[#f8f7f1]"
        >
          <div
            aria-hidden="true"
            className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#056839]/5 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#d7b765]/10 blur-3xl"
          />
          <div className="container relative z-10 py-24 sm:py-28 lg:py-32">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-[#034d2a] p-7 text-white shadow-2xl shadow-[#034d2a]/10 sm:p-10 lg:p-12"
              >
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d7b765]/20 bg-white/[0.06] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ead493]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d7b765]" />
                  AIJR Connect
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#ead493]">
                  Connect With Us
                </p>

                <h2 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Let&apos;s build a stronger community together.
                </h2>

                <p className="mt-5 max-w-xl text-base leading-8 text-white/70">
                  Have a question, suggestion or community initiative to share?
                  Get in touch with the AIJR team.
                </p>

                <div className="mt-9 space-y-4">
                  <div className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#d7b765]/30 hover:bg-white/[0.07]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d7b765] text-[#15231c] shadow-sm">
                      <Mail size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        Email
                      </p>

                      <a
                        href={`mailto:${siteSettings.email}`}
                        className="mt-1 block text-sm leading-6 text-white/55 transition hover:text-[#d7b765]"
                      >
                        {siteSettings.email}
                      </a>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#d7b765]/30 hover:bg-white/[0.07]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d7b765] text-[#15231c] shadow-sm">
                      <Phone size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        Phone
                      </p>

                      <a
                        href={`tel:${siteSettings.phone.replace(/[^\d+]/g, "")}`}
                        className="mt-1 block text-sm leading-6 text-white/55 transition hover:text-[#d7b765]"
                      >
                        {siteSettings.phone}
                      </a>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#d7b765]/30 hover:bg-white/[0.07]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d7b765] text-[#15231c] shadow-sm">
                      <MapPin size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        Location
                      </p>

                      <p className="mt-1 text-sm leading-6 text-white/55">
                        {siteSettings.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-20 -right-16 h-44 w-44 rounded-full border border-[#d7b765]/10"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-8 -right-2 h-24 w-24 rounded-full bg-[#d7b765]/10 blur-2xl"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="rounded-[2.5rem] border border-[#e3e4dc] bg-white p-5 shadow-xl shadow-[#15231c]/5 sm:p-8 lg:p-10"
              >
                {contactSent ? (
                  <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#056839] text-white shadow-lg">
                      <Check size={28} />
                    </div>

                    <h3 className="mt-6 text-2xl font-semibold text-[#15231c]">
                      Message sent successfully.
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-7 text-[#66746c]">
                      Thank you for contacting AIJR. Your message has been submitted
                      successfully. The AIJR team will get back to you soon.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setContactSent(false);
                        setContactError("");
                      }}
                      className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#056839]/20 bg-[#f8f7f1] px-5 py-3 text-sm font-bold text-[#056839] transition hover:bg-[#056839] hover:text-white"
                    >
                      Send another message
                      <ArrowRight size={15} />
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      setContactSubmitting(true);
                      setContactError("");

                      const form = e.currentTarget;
                      const formData = new FormData(form);

                      const payload = {
                        name: String(formData.get("name") || ""),
                        email: String(formData.get("email") || ""),
                        subject: String(formData.get("subject") || ""),
                        message: String(formData.get("message") || ""),
                      };

                      try {
                        const response = await fetch("/api/contact", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(payload),
                        });

                        const data = await response.json();

                        if (!response.ok || !data.success) {
                          throw new Error(
                            data.message || "Message could not be sent."
                          );
                        }

                        setContactSent(true);
                        form.reset();
                      } catch (error) {
                        console.error("Contact form error:", error);

                        setContactError(
                          error instanceof Error
                            ? error.message
                            : "Something went wrong. Please try again."
                        );
                      } finally {
                        setContactSubmitting(false);
                      }
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#056839]">
                          Start a conversation
                        </p>

                        <span className="rounded-full bg-[#056839]/5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#056839]">
                          Contact AIJR
                        </span>
                      </div>

                      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#15231c] sm:text-3xl">
                        Send us a message
                      </h3>

                      <p className="mt-2 max-w-lg text-sm leading-6 text-[#66746c]">
                        Reach out to AIJR with your question, suggestion or
                        community initiative.
                      </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]"
                        >
                          Name
                        </label>

                        <input
                          id="contact-name"
                          required
                          type="text"
                          name="name"
                          autoComplete="name"
                          placeholder="Your name"
                          className="w-full rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-4 py-3.5 text-sm text-[#15231c] outline-none transition placeholder:text-[#66746c]/55 hover:border-[#056839]/30 focus:border-[#056839] focus:ring-4 focus:ring-[#056839]/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]"
                        >
                          Email
                        </label>

                        <input
                          id="contact-email"
                          required
                          type="email"
                          name="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          className="w-full rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-4 py-3.5 text-sm text-[#15231c] outline-none transition placeholder:text-[#66746c]/55 hover:border-[#056839]/30 focus:border-[#056839] focus:ring-4 focus:ring-[#056839]/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]"
                      >
                        Subject
                      </label>

                      <input
                        id="contact-subject"
                        required
                        type="text"
                        name="subject"
                        placeholder="How can we help?"
                        className="w-full rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-4 py-3.5 text-sm text-[#15231c] outline-none transition placeholder:text-[#66746c]/55 hover:border-[#056839]/30 focus:border-[#056839] focus:ring-4 focus:ring-[#056839]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]"
                      >
                        Message
                      </label>

                      <textarea
                        id="contact-message"
                        required
                        name="message"
                        rows={6}
                        placeholder="Write your message..."
                        className="w-full resize-none rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-4 py-3.5 text-sm text-[#15231c] outline-none transition placeholder:text-[#66746c]/55 hover:border-[#056839]/30 focus:border-[#056839] focus:ring-4 focus:ring-[#056839]/10"
                      />
                    </div>

                    {contactError && (
                      <p className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                        {contactError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#056839] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-[#056839]/15 transition hover:-translate-y-0.5 hover:bg-[#034d2a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
                    >
                      {contactSubmitting ? "Sending..." : "Send Message"}

                      {!contactSubmitting && <ArrowRight size={16} />}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#034d2a] text-white">
        <div className="container py-12">
          <div className="flex flex-col gap-8 border-b border-white/10 pb-10 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold tracking-wide">
                ALL INDIA JAMAT RAYEEN
              </p>

              <p className="mt-2 max-w-md text-sm leading-6 text-white/50">
                Connecting families, empowering individuals and building a
                stronger community together.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <a
                  href={siteSettings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow All India Jamat Rayeen on Facebook"
                  title="Facebook"
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition duration-300 hover:-translate-y-0.5 hover:border-[#d7b765]/40 hover:bg-white/10 hover:text-[#d7b765]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-[18px] w-[18px] fill-current"
                  >
                    <path d="M24 12.07C24 5.397 18.603 0 11.93 0S0 5.397 0 12.07c0 6.025 4.388 11.002 10.125 11.93v-8.43H7.078v-3.5h3.047V9.406c0-3.007 1.792-4.675 4.533-4.675 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.492 0-1.955.925-1.955 1.875v2.25h3.329l-.533 3.5h-2.796V24C19.612 23.072 24 18.095 24 12.07Z" />
                  </svg>
                </a>

                <a
                  href={siteSettings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow All India Jamat Rayeen on Instagram"
                  title="Instagram"
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition duration-300 hover:-translate-y-0.5 hover:border-[#d7b765]/40 hover:bg-white/10 hover:text-[#d7b765]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-[18px] w-[18px] fill-none stroke-current"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4.25" />
                    <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-start md:justify-end">
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-3 shadow-xl shadow-black/10 backdrop-blur-sm transition duration-500 hover:border-[#d7b765]/30 hover:bg-white/[0.07]">
                <div className="absolute inset-0 rounded-3xl bg-[#d7b765]/0 transition duration-500 group-hover:bg-[#d7b765]/5" />

                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-2 sm:h-24 sm:w-24">
                  <Image
                    src="/images/Logo.jpeg"
                    alt="All India Jamat Rayeen logo"
                    width={96}
                    height={96}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
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