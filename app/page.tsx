"use client";

import Image from "next/image";
import { useState } from "react";
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
    name: "Community Leadership",
    role: "Guiding the Community",
    initials: "CL",
  },
  {
    name: "Youth Leadership",
    role: "Empowering the Next Generation",
    initials: "YL",
  },
  {
    name: "Community Volunteers",
    role: "Serving With Dedication",
    initials: "CV",
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
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Navbar />

      <main className="overflow-hidden">
        {/* HERO / FRONT PAGE */}
        <Hero />

        {/* ABOUT */}
        <About />

        {/* COMMUNITY HIGHLIGHT */}
        <section className="border-y border-[#e3e4dc] bg-[#f8f7f1]">
          <div className="container grid gap-8 py-10 sm:grid-cols-3">
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
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#056839] text-[#ead493]">
                    <Icon size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-[#15231c]">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm text-[#66746c]">
                      {item.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
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
                People who serve the community.
              </h2>

              <p className="mt-5 text-base leading-8 text-[#66746c] sm:text-lg">
                A strong community is built by people who step forward,
                contribute their time and work together toward a better future.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -7 }}
                  className="group overflow-hidden rounded-[2rem] border border-[#e3e4dc] bg-[#f8f7f1] p-6 transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#056839]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.15),transparent_28%),radial-gradient(circle_at_80%_75%,rgba(215,183,101,0.18),transparent_30%)]" />

                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[#d7b765]/50 bg-white/10 text-4xl font-bold text-[#ead493] backdrop-blur-md">
                      {member.initials}
                    </div>
                  </div>

                  <div className="pt-6">
                    <h3 className="text-xl font-semibold text-[#15231c]">
                      {member.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#66746c]">
                      {member.role}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section id="events" className="bg-[#f8f7f1]">
          <div className="container py-24 sm:py-28">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="max-w-2xl"
              >
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#056839]">
                  Events & News
                </p>

                <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#15231c] sm:text-5xl">
                  Stay connected with what&apos;s happening.
                </h2>

                <p className="mt-5 text-base leading-8 text-[#66746c] sm:text-lg">
                  Discover upcoming gatherings, initiatives and important
                  moments from across the community.
                </p>
              </motion.div>

              <a
                href="#contact"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-[#056839]/20 bg-white px-5 py-3 text-sm font-bold text-[#056839] transition hover:bg-[#056839] hover:text-white"
              >
                Share an Event
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="mt-14 grid gap-7 lg:grid-cols-3">
              {events.map((event, index) => (
                <motion.article
                  key={event.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
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
                      <span className="text-xl font-bold leading-none">
                        {event.date}
                      </span>
                      <span className="mt-1 text-[9px] font-bold tracking-[0.18em] text-[#056839]">
                        {event.month}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#15231c]">
                      {event.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-[#66746c]">
                      {event.description}
                    </p>

                    <a
                      href="#contact"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#056839]"
                    >
                      Learn more
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <Gallery />

        {/* RAYEEN SHADI */}
        <section className="relative overflow-hidden bg-[#056839] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.08),transparent_25%),radial-gradient(circle_at_85%_80%,rgba(215,183,101,0.12),transparent_30%)]" />

          <div className="container relative z-10 py-24 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#ead493]">
                  Rayeen Shadi
                </p>

                <h2 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
                  Helping families connect in a meaningful way.
                </h2>

                <p className="mt-6 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
                  Explore the dedicated Rayeen Shadi platform created to help
                  members connect with suitable families and build meaningful
                  relationships.
                </p>

                <a
                  href="https://rayeenshaadi.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d7b765] px-7 py-4 text-sm font-bold text-[#15231c] transition hover:bg-[#ead493]"
                >
                  Visit Rayeen Shadi
                  <ExternalLink size={16} />
                </a>

              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                  <div className="rounded-[1.5rem] border border-[#d7b765]/20 bg-[#034d2a]/60 p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d7b765] text-[#15231c]">
                      <Users size={24} />
                    </div>

                    <h3 className="mt-7 text-2xl font-semibold">
                      Community connections matter.
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-white/60">
                      A dedicated platform can make it easier for families and
                      individuals to discover connections within the wider
                      Rayeen community.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* MEMBERSHIP */}
        <section id="membership" className="bg-white">
          <div className="container py-24 sm:py-28">
            <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#056839]">
                  Membership
                </p>

                <h2 className="mt-5 text-4xl font-bold tracking-tight text-[#15231c] sm:text-5xl">
                  Be a part of the community.
                </h2>

                <p className="mt-5 text-base leading-8 text-[#66746c]">
                  Join AIJR and stay connected with people, initiatives,
                  events and opportunities across the community.
                </p>

                <div className="mt-8 space-y-4">
                  {benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-start gap-3 text-sm text-[#15231c]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#056839] text-white">
                        <Check size={12} />
                      </span>

                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="rounded-[2rem] border border-[#e3e4dc] bg-[#f8f7f1] p-6 sm:p-8"
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
                      Your membership request has been received in this demo
                      version. Backend submission can be connected later.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSubmitted(true);
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="text-2xl font-semibold text-[#15231c]">
                        Membership Form
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#66746c]">
                        Register your interest in becoming part of AIJR.
                      </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                          Full Name
                        </label>

                        <input
                          required
                          type="text"
                          placeholder="Your full name"
                          className="w-full rounded-xl border border-[#dfe1d8] bg-white px-4 py-3 text-sm text-[#15231c] outline-none transition focus:border-[#056839]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                          Phone
                        </label>

                        <input
                          required
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full rounded-xl border border-[#dfe1d8] bg-white px-4 py-3 text-sm text-[#15231c] outline-none transition focus:border-[#056839]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                        Email
                      </label>

                      <input
                        required
                        type="email"
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-[#dfe1d8] bg-white px-4 py-3 text-sm text-[#15231c] outline-none transition focus:border-[#056839]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                        City
                      </label>

                      <input
                        type="text"
                        placeholder="Your city"
                        className="w-full rounded-xl border border-[#dfe1d8] bg-white px-4 py-3 text-sm text-[#15231c] outline-none transition focus:border-[#056839]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                        Message
                      </label>

                      <textarea
                        rows={4}
                        placeholder="Tell us a little about yourself..."
                        className="w-full resize-none rounded-xl border border-[#dfe1d8] bg-white px-4 py-3 text-sm text-[#15231c] outline-none transition focus:border-[#056839]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#056839] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#034d2a]"
                    >
                      Submit Membership Request
                      <ArrowRight size={16} />
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="bg-[#f8f7f1]">
          <div className="container py-24 sm:py-28">
            <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#056839]">
                  Contact Us
                </p>

                <h2 className="mt-5 text-4xl font-bold tracking-tight text-[#15231c] sm:text-5xl">
                  Let&apos;s build a stronger community together.
                </h2>

                <p className="mt-5 max-w-xl text-base leading-8 text-[#66746c]">
                  Have a question, suggestion or community initiative to share?
                  Get in touch with us.
                </p>

                <div className="mt-9 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#056839] text-white">
                      <Mail size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#15231c]">
                        Email
                      </p>
                      <p className="mt-1 text-sm text-[#66746c]">
                        hello@aijr.example
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#056839] text-white">
                      <Phone size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#15231c]">
                        Phone
                      </p>
                      <p className="mt-1 text-sm text-[#66746c]">
                        +91 XXXXX XXXXX
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#056839] text-white">
                      <MapPin size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#15231c]">
                        Location
                      </p>
                      <p className="mt-1 text-sm text-[#66746c]">
                        India
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="rounded-[2rem] border border-[#e3e4dc] bg-white p-6 shadow-sm sm:p-8"
              >
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                        Name
                      </label>

                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-4 py-3 text-sm text-[#15231c] outline-none transition focus:border-[#056839]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                        Email
                      </label>

                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-4 py-3 text-sm text-[#15231c] outline-none transition focus:border-[#056839]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                      Subject
                    </label>

                    <input
                      type="text"
                      placeholder="How can we help?"
                      className="w-full rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-4 py-3 text-sm text-[#15231c] outline-none transition focus:border-[#056839]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                      Message
                    </label>

                    <textarea
                      rows={6}
                      placeholder="Write your message..."
                      className="w-full resize-none rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-4 py-3 text-sm text-[#15231c] outline-none transition focus:border-[#056839]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-[#056839] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#034d2a]"
                  >
                    Send Message
                    <ArrowRight size={16} />
                  </button>

                  <p className="text-xs leading-5 text-[#66746c]">
                    Contact form functionality can be connected to a backend,
                    email service or database in the next phase.
                  </p>
                </form>
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
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: "Home", href: "#home" },
                { label: "About", href: "#about" },
                { label: "Team", href: "#team" },
                { label: "Events", href: "#events" },
                { label: "Gallery", href: "#gallery" },
                { label: "Contact", href: "#contact" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm text-white/55 transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} All India Jamat Rayeen. All rights reserved.</p>

            <p>Unity • Community • Progress</p>
          </div>
        </div>
      </footer>
    </>
  );
}