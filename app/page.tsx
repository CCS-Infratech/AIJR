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
  BriefcaseBusiness,
  Droplets,
  ExternalLink,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  MapPinned,
  Target,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";

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
    image: "/images/team/zeesha_aslam_rayeen.jpg",
  },
  {
    name: "Suhail Akram Rayeen",
    role: "Senior Vice President",
    image: "/images/team/suhain_akram_rayeen.jpeg",
  },
  {
    name: "Faisal Aslam Rayeen",
    role: "Vice President",
    image: "/images/team/faisal_aslam_rayeen.jpeg",
  },
  {
    name: "Mohd Shariq Rayeen",
    role: "General Secretary",
    image: "/images/team/mohd_shariq_rayeen.jpeg",
  },
  {
    name: "Mohd Imran Rayeen",
    role: "Organizing Secretary",
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

const objectives = [
  {
    title: "Education & Scholarships",
    description:
      "Promote educational awareness, support learning opportunities and encourage the educational development of young people.",
    icon: GraduationCap,
  },
  {
    title: "Social Welfare",
    description:
      "Support initiatives focused on community welfare, assistance and social development.",
    icon: HeartHandshake,
  },
  {
    title: "Health & Blood Donation",
    description:
      "Encourage health awareness, blood donation and community health initiatives.",
    icon: Droplets,
  },
  {
    title: "Women & Youth Empowerment",
    description:
      "Encourage meaningful participation, leadership and development opportunities for women and young people.",
    icon: HandHeart,
  },
  {
    title: "Employment & Entrepreneurship",
    description:
      "Encourage skills, employment opportunities, entrepreneurship and economic development.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Relief & Rehabilitation",
    description:
      "Support relief and assistance initiatives for families and communities during difficult circumstances.",
    icon: MapPinned,
  },
];

const presenceStates = ["Uttar Pradesh", "Bihar", "Madhya Pradesh", "Karnataka"];

export default function Home() {
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

        {/* VISION & MISSION */}
        <section className="bg-white">
          <div className="container py-24 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#056839]">
                Vision & Mission
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#15231c] sm:text-5xl">
                Guided by unity, opportunity and progress.
              </h2>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {[
                {
                  label: "Our Vision",
                  text: "To build a united, educated, empowered and progressive Rayeen community.",
                  icon: Eye,
                },
                {
                  label: "Our Mission",
                  text: "To promote community unity, education, social welfare, cultural development and opportunities for the social and economic advancement of the Rayeen community across India.",
                  icon: Target,
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="rounded-[2rem] border border-[#e3e4dc] bg-[#f8f7f1] p-7 sm:p-9"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#056839] text-[#ead493]">
                      <Icon size={21} />
                    </div>
                    <h3 className="mt-7 text-2xl font-semibold text-[#15231c]">
                      {item.label}
                    </h3>
                    <p className="mt-4 text-base leading-8 text-[#66746c]">
                      {item.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* OBJECTIVES */}
        <section className="bg-[#f8f7f1]">
          <div className="container py-24 sm:py-28">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#056839]">
                Our Objectives
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#15231c] sm:text-5xl">
                Creating pathways for community development.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#66746c] sm:text-lg">
                AIJR&apos;s community-focused work brings people together around
                opportunities, wellbeing and collective progress.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {objectives.map((objective, index) => {
                const Icon = objective.icon;

                return (
                  <motion.div
                    key={objective.title}
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: index * 0.06 }}
                    whileHover={{ y: -6 }}
                    className="group rounded-[1.75rem] border border-[#e3e4dc] bg-white p-7 transition-shadow hover:shadow-xl hover:shadow-[#056839]/5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#056839]/8 text-[#056839] transition group-hover:bg-[#056839] group-hover:text-[#ead493]">
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-[#15231c]">
                      {objective.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#66746c]">
                      {objective.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* OUR PRESENCE */}
        <section className="overflow-hidden bg-[#056839] text-white">
          <div className="container py-24 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#ead493]">
                  Our Presence
                </p>
                <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                  Connected in several parts of India.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
                  AIJR&apos;s organizational network includes state-level units in
                  several parts of India.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {presenceStates.map((state, index) => (
                  <motion.div
                    key={state}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="flex items-center gap-4 rounded-2xl border border-white/12 bg-white/5 p-5 backdrop-blur-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d7b765] text-[#15231c]">
                      <MapPinned size={18} />
                    </div>
                    <p className="font-semibold">{state}</p>
                  </motion.div>
                ))}
              </div>
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

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-[#056839]">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-top transition duration-700 group-hover:scale-105"
                    />
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

        {/* FEATURED EVENTS */}
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
                href="/events"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-[#056839]/20 bg-white px-5 py-3 text-sm font-bold text-[#056839] transition hover:bg-[#056839] hover:text-white"
              >
                View All Events
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
                      <span className="text-xl font-bold leading-none">{event.date}</span>
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
                      href="/events"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#056839]"
                    >
                      View event
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

        {/* FEATURED GALLERY */}
        <section id="gallery" className="bg-white">
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
                  Gallery
                </p>
                <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#15231c] sm:text-5xl">
                  Moments from our community.
                </h2>
                <p className="mt-5 text-base leading-8 text-[#66746c] sm:text-lg">
                  Explore a selection of moments, gatherings and memories from
                  the AIJR community.
                </p>
              </motion.div>

              <a
                href="/gallery"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-[#056839]/20 bg-[#f8f7f1] px-5 py-3 text-sm font-bold text-[#056839] transition hover:bg-[#056839] hover:text-white"
              >
                View Full Gallery
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4, 6, 7, 8, 9].map((image, index) => (
                <motion.a
                  key={image}
                  href="/gallery"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className={`group relative overflow-hidden rounded-[1.5rem] bg-[#034d2a] ${
                    index === 0 ? "col-span-2 row-span-2 min-h-[260px] sm:min-h-[360px]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={`/images/gallery/${image}.jpeg`}
                    alt={`AIJR community moment ${image}`}
                    fill
                    sizes={
                      index === 0
                        ? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
                        : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    }
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                </motion.a>
              ))}
            </div>
          </div>
        </section>

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
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-8">
                  <div className="rounded-[1.5rem] border border-[#d7b765]/20 bg-[#034d2a]/60 p-6 sm:p-8">
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
                className="rounded-[2rem] border border-[#e3e4dc] bg-[#f8f7f1] p-5 sm:p-8"
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
                      The live email connection will be enabled once official AIJR
                      contact credentials are available.
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
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSubmitting(true);
                      setFormError("");

                      const form = e.currentTarget;
                      setTimeout(() => {
                        setSubmitting(false);
                        setSubmitted(true);
                        form.reset();
                      }, 900);

                      /*
                       * ================================================
                       * REAL BACKEND — RECONNECT WHEN AIJR CREDENTIALS
                       * ARE AVAILABLE
                       * ================================================
                       * Replace the demo setTimeout above with this flow:
                       *
                       * const formData = new FormData(form);
                       * const payload = {
                       *   name: String(formData.get("name") || ""),
                       *   fatherName: String(formData.get("fatherName") || ""),
                       *   phone: String(formData.get("phone") || ""),
                       *   email: String(formData.get("email") || ""),
                       *   city: String(formData.get("city") || ""),
                       *   message: String(formData.get("message") || ""),
                       * };
                       *
                       * const response = await fetch("/api/membership", {
                       *   method: "POST",
                       *   headers: { "Content-Type": "application/json" },
                       *   body: JSON.stringify(payload),
                       * });
                       *
                       * const data = await response.json();
                       * if (!response.ok || !data.success) {
                       *   throw new Error(data.message || "Submission failed.");
                       * }
                       * setSubmitted(true);
                       * form.reset();
                       *
                       * ================================================
                       */
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
                          autoComplete="off"
                          placeholder="Your father's name"
                          className="w-full rounded-xl border border-[#dfe1d8] bg-white px-4 py-3.5 text-sm text-[#15231c] outline-none transition placeholder:text-[#66746c]/55 hover:border-[#056839]/30 focus:border-[#056839] focus:ring-4 focus:ring-[#056839]/10"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
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
                    </div>

                    <div>
                      <label
                        htmlFor="membership-city"
                        className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]"
                      >
                        Address
                      </label>

                      <input
                        id="membership-city"
                        type="text"
                        name="Address"
                        autoComplete="address-level2"
                        placeholder="Your city"
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
                  Connect With Us
                </p>

                <h2 className="mt-5 text-4xl font-bold tracking-tight text-[#15231c] sm:text-5xl">
                  Let&apos;s build a stronger community together.
                </h2>

                <p className="mt-5 max-w-xl text-base leading-8 text-[#66746c]">
                  Have a question, suggestion or community initiative to share?
                  Get in touch with the AIJR team.
                </p>

                <div className="mt-9 space-y-4">
                  <div className="flex items-start gap-4 rounded-2xl border border-[#e3e4dc] bg-white p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#056839] text-white">
                      <Mail size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#15231c]">
                        Email
                      </p>

                      <a
                        href="mailto:allindiajamiatrayeen@yahoo.com"
                        className="mt-1 block text-sm leading-6 text-[#66746c] transition hover:text-[#056839]"
                      >
                        allindiajamiatrayeen@yahoo.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl border border-[#e3e4dc] bg-white p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#056839] text-white">
                      <Phone size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#15231c]">
                        Phone
                      </p>

                      <a
                        href="tel:+919919990421"
                        className="mt-1 block text-sm leading-6 text-[#66746c] transition hover:text-[#056839]"
                      >
                        +91 99199 90421
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl border border-[#e3e4dc] bg-white p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#056839] text-white">
                      <MapPin size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#15231c]">
                        Location
                      </p>

                      <p className="mt-1 text-sm leading-6 text-[#66746c]">
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
                className="rounded-[2rem] border border-[#e3e4dc] bg-white p-5 shadow-sm sm:p-8"
              >
                {contactSent ? (
                  <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#056839] text-white">
                      <Check size={28} />
                    </div>

                    <h3 className="mt-6 text-2xl font-semibold text-[#15231c]">
                      Message sent successfully.
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-7 text-[#66746c]">
                      Thank you for contacting AIJR. Your message has been
                      submitted successfully. The live email connection will be
                      enabled once official AIJR contact credentials are available.
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
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSubmitting(true);
                      setContactError("");

                      const form = e.currentTarget;
                      setTimeout(() => {
                        setContactSubmitting(false);
                        setContactSent(true);
                        form.reset();
                      }, 900);

                      /*
                       * ================================================
                       * REAL BACKEND — RECONNECT WHEN AIJR CREDENTIALS
                       * ARE AVAILABLE
                       * ================================================
                       * Replace the demo setTimeout above with this flow:
                       *
                       * const formData = new FormData(form);
                       * const payload = {
                       *   name: String(formData.get("name") || ""),
                       *   email: String(formData.get("email") || ""),
                       *   subject: String(formData.get("subject") || ""),
                       *   message: String(formData.get("message") || ""),
                       * };
                       *
                       * const response = await fetch("/api/contact", {
                       *   method: "POST",
                       *   headers: { "Content-Type": "application/json" },
                       *   body: JSON.stringify(payload),
                       * });
                       *
                       * const data = await response.json();
                       * if (!response.ok || !data.success) {
                       *   throw new Error(data.message || "Message could not be sent.");
                       * }
                       * setContactSent(true);
                       * form.reset();
                       *
                       * ================================================
                       */
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="text-2xl font-semibold text-[#15231c]">
                        Send us a message
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#66746c]">
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

              <div className="mt-5 flex items-center gap-3">
                <a
                  href="https://www.facebook.com/share/1DfVWVoZgv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow All India Jamiat Rayeen on Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition hover:border-[#d7b765] hover:bg-[#d7b765] hover:text-[#15231c]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 fill-current"
                  >
                    <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6H17V3.8c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V10H7v3h3v8h3.5Z" />
                  </svg>
                </a>

                <a
                  href="https://www.instagram.com/allindiajamiatrayeen?stkn=MTM3bTA1bm1oZDN2Nw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow All India Jamiat Rayeen on Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition hover:border-[#d7b765] hover:bg-[#d7b765] hover:text-[#15231c]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 fill-none stroke-current stroke-[1.8]"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: "Home", href: "#home" },
                { label: "About", href: "#about" },
                { label: "Team", href: "#team" },
                { label: "Events", href: "/events" },
                { label: "Gallery", href: "/gallery" },
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
