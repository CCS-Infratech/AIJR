
"use client";

import { useState } from "react";
import { ArrowRight, Check, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

import About from "@/components/About";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Navbar />

      <main>
        <Hero />

        {/* ABOUT */}
        <section id="about" className="section bg-[#f8f7f1]">
          <div className="container">
            <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <div className="section-label">About AIJR</div>

                <h2 className="section-title">
                  A community connected by identity, values and progress.
                </h2>
              </div>

              <div>
                <p className="section-description mt-0">
                  All India Jamiat Rayeen is focused on bringing the Rayeen
                  community together, strengthening relationships and creating
                  meaningful opportunities for collective growth.
                </p>

                <a
                  href="#membership"
                  className="mt-7 inline-flex items-center gap-2 font-semibold text-[#056839]"
                >
                  Become part of AIJR
                  <ArrowRight size={17} />
                </a>
              </div>
            </div>

            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["01", "Community", "Connecting members and families."],
                ["02", "Unity", "Building relationships through shared values."],
                ["03", "Opportunity", "Creating platforms for growth."],
                ["04", "Progress", "Working toward a stronger future."],
              ].map(([number, title, description]) => (
                <motion.div
                  key={number}
                  whileHover={{ y: -7 }}
                  className="rounded-3xl border border-[#e3e4dc] bg-white p-7 shadow-sm"
                >
                  <span className="text-sm font-bold text-[#d7b765]">
                    {number}
                  </span>

                  <h3 className="mt-7 text-2xl font-semibold">{title}</h3>

                  <p className="mt-3 leading-7 text-[#66746c]">
                    {description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HIGHLIGHT STRIP */}
        <section className="bg-[#056839] py-10 text-white">
          <div className="container grid gap-8 text-center sm:grid-cols-3 sm:text-left">
            <div>
              <p className="text-4xl font-bold">Community</p>
              <p className="mt-1 text-sm text-white/60">
                Connected across India
              </p>
            </div>

            <div>
              <p className="text-4xl font-bold">Together</p>
              <p className="mt-1 text-sm text-white/60">
                Stronger through unity
              </p>
            </div>

            <div>
              <p className="text-4xl font-bold">Forward</p>
              <p className="mt-1 text-sm text-white/60">
                Building for the future
              </p>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section id="team" className="section bg-white">
          <div className="container">
            <div className="section-label">Our Team</div>

            <h2 className="section-title">
              Leadership built around service.
            </h2>

            <p className="section-description">
              Profiles and leadership information will be added once the
              approved AIJR details are available.
            </p>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "President",
                "General Secretary",
                "Community Coordinator",
              ].map((role, index) => (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -7 }}
                  className="overflow-hidden rounded-3xl border border-[#e3e4dc] bg-[#f8f7f1]"
                >
                  <div className="flex aspect-[4/3] items-center justify-center bg-[#034d2a] text-white">
                    <div className="text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#d7b765]/60 text-xl font-bold text-[#ead493]">
                        AIJR
                      </div>

                      <p className="mt-5 text-sm text-white/50">
                        Profile photo coming soon
                      </p>
                    </div>
                  </div>

                  <div className="p-7">
                    <p className="text-xl font-semibold">Community Leader</p>

                    <p className="mt-1 font-semibold text-[#056839]">
                      {role}
                    </p>

                    <p className="mt-4 leading-7 text-[#66746c]">
                      Leadership profile and introduction will be added here.
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section id="events" className="section bg-[#f8f7f1]">
          <div className="container">
            <div className="section-label">Events & News</div>

            <h2 className="section-title">
              Stay connected with the community.
            </h2>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((event) => (
                <motion.article
                  key={event}
                  whileHover={{ y: -7 }}
                  className="group overflow-hidden rounded-3xl border border-[#e3e4dc] bg-white"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#034d2a]">
                    <img
                      src={`/images/gallery/${event}.jpeg`}
                      alt={`AIJR event ${event}`}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-7">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#056839]">
                      Community Update
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold">
                      Community Event
                    </h3>

                    <p className="mt-3 leading-7 text-[#66746c]">
                      Event details, announcements and community updates will
                      appear here.
                    </p>

                    <a
                      href="#contact"
                      className="mt-6 inline-flex items-center gap-2 font-semibold text-[#056839]"
                    >
                      Read more
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <Gallery />

        {/* RAYEEN SHADI */}
        <section className="relative overflow-hidden bg-[#034d2a] py-28 text-white">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-[#d7b765]/10" />

          <div className="container relative">
            <div className="max-w-4xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ead493]">
                Rayeen Shadi
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
                A dedicated platform for meaningful connections.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
                Explore the Rayeen Shadi platform and discover its services
                for the wider community.
              </p>

              <a
                href="#"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#d7b765] px-7 py-4 font-bold text-[#15231c] transition hover:bg-[#ead493]"
              >
                Visit Rayeen Shadi
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </section>

        {/* MEMBERSHIP */}
        <section id="membership" className="section bg-[#f8f7f1]">
          <div className="container">
            <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <div className="section-label">Membership</div>

                <h2 className="section-title">
                  Be part of the journey.
                </h2>

                <p className="section-description">
                  Stay connected with AIJR, participate in community
                  initiatives and be part of a growing network.
                </p>

                <div className="mt-9 space-y-3">
                  {[
                    "Stay connected with community activities",
                    "Receive news and event updates",
                    "Connect with other members",
                    "Support community initiatives",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl bg-white p-4"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#056839]/10 text-[#056839]">
                        <Check size={15} />
                      </span>

                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-[#e3e4dc] bg-white p-7 shadow-xl shadow-black/5 sm:p-9">
                {submitted ? (
                  <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#056839]/10 text-[#056839]">
                      <Check size={28} />
                    </div>

                    <h3 className="mt-6 text-3xl font-semibold">
                      Thank you!
                    </h3>

                    <p className="mt-3 max-w-sm leading-7 text-[#66746c]">
                      Your membership request has been recorded for this
                      demonstration.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-semibold">
                      Membership Registration
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#66746c]">
                      Fill in your details and we'll stay connected.
                    </p>

                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        setSubmitted(true);
                      }}
                      className="mt-7 space-y-4"
                    >
                      <input
                        required
                        type="text"
                        placeholder="Full Name"
                        className="w-full rounded-xl border border-[#dfe2d9] px-4 py-3.5 outline-none transition focus:border-[#056839]"
                      />

                      <input
                        required
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full rounded-xl border border-[#dfe2d9] px-4 py-3.5 outline-none transition focus:border-[#056839]"
                      />

                      <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full rounded-xl border border-[#dfe2d9] px-4 py-3.5 outline-none transition focus:border-[#056839]"
                      />

                      <textarea
                        rows={4}
                        placeholder="Tell us a little about yourself"
                        className="w-full resize-none rounded-xl border border-[#dfe2d9] px-4 py-3.5 outline-none transition focus:border-[#056839]"
                      />

                      <button
                        type="submit"
                        className="w-full rounded-xl bg-[#056839] px-5 py-4 font-bold text-white transition hover:bg-[#034d2a]"
                      >
                        Submit Membership Request
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section bg-white">
          <div className="container">
            <div className="section-label">Contact Us</div>

            <h2 className="section-title">
              Let&apos;s stay connected.
            </h2>

            <p className="section-description">
              Have a question, suggestion or community initiative? Get in
              touch with AIJR.
            </p>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              <div className="rounded-3xl bg-[#f8f7f1] p-8">
                <Phone className="text-[#056839]" size={22} />
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-[#66746c]">
                  Phone
                </p>
                <p className="mt-2 text-lg font-semibold">
                  +91 XXXXX XXXXX
                </p>
              </div>

              <div className="rounded-3xl bg-[#f8f7f1] p-8">
                <Mail className="text-[#056839]" size={22} />
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-[#66746c]">
                  Email
                </p>
                <p className="mt-2 text-lg font-semibold">
                  contact@aijr.org
                </p>
              </div>

              <div className="rounded-3xl bg-[#f8f7f1] p-8">
                <MapPin className="text-[#056839]" size={22} />
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-[#66746c]">
                  Location
                </p>
                <p className="mt-2 text-lg font-semibold">India</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#034d2a] py-12 text-white">
        <div className="container">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-2xl font-bold">AIJR</p>
              <p className="mt-2 text-sm text-white/55">
                All India Jamiat Rayeen
              </p>
            </div>

            <p className="text-sm text-white/45">
              © {new Date().getFullYear()} AIJR. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}