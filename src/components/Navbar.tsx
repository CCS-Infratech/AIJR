"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const navigation = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Events", href: "#events" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65 }}
      className="fixed left-0 right-0 top-0 z-50"
    >
      <div className="container pt-4">
        <div className="flex h-[74px] items-center justify-between rounded-2xl border border-white/15 bg-[#056839]/90 px-4 text-white shadow-2xl shadow-[#034d2a]/20 backdrop-blur-xl sm:px-6">
          <a href="#home" className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[#d7b765]/70 bg-white">
              <Image
                src="/images/Logo.jpeg"
                alt="AIJR Logo"
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-bold tracking-wide">
                ALL INDIA JAMIAT RAYEEN
              </p>

              <p className="mt-0.5 text-[9px] uppercase tracking-[0.25em] text-white/55">
                Unity • Community • Progress
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl px-3.5 py-2.5 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}

            <a
              href="#membership"
              className="ml-3 rounded-full bg-[#d7b765] px-5 py-3 text-sm font-bold text-[#15231c] transition hover:bg-[#ead493]"
            >
              Become a Member
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-xl border border-white/15 p-2.5 lg:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 rounded-2xl border border-white/10 bg-[#056839]/98 p-3 text-white shadow-2xl backdrop-blur-xl lg:hidden"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}

            <a
              href="#membership"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-xl bg-[#d7b765] px-4 py-3 text-center text-sm font-bold text-[#15231c]"
            >
              Become a Member
            </a>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}