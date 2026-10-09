"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Team", href: "/#team" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="fixed left-0 right-0 top-0 z-50"
    >
      <div
        className={`container px-0 transition-all duration-500 ${
          scrolled ? "pt-2 sm:pt-2.5" : "pt-3 sm:pt-4"
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-2xl border border-white/15 bg-[#056839]/90 px-3.5 text-white shadow-2xl shadow-[#034d2a]/20 backdrop-blur-xl transition-all duration-500 sm:px-6 ${
            scrolled ? "h-16" : "h-16 sm:h-[74px]"
          }`}
        >
          <Link
            href="/#home"
            onClick={() => setOpen(false)}
            className="flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#d7b765]/70 bg-white sm:h-11 sm:w-11">
              <Image
                src="/images/Logo.jpeg"
                alt="AIJR Logo"
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>

            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-bold tracking-wide">
                ALL INDIA JAMIAT RAYEEN
              </p>

              <p className="mt-0.5 text-[9px] uppercase tracking-[0.25em] text-white/55">
                Unity • Community • Progress
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative rounded-xl px-3.5 py-2.5 text-sm text-white/75 transition duration-300 hover:bg-white/10 hover:text-white"
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3.5 bottom-1.5 h-px origin-left scale-x-0 bg-[#d7b765] transition-transform duration-300 group-hover:scale-x-100"
                />
              </Link>
            ))}

            <Link
              href="/#membership"
              className="group ml-3 inline-flex items-center gap-2 rounded-full bg-[#d7b765] px-5 py-3 text-sm font-bold text-[#15231c] shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:bg-[#ead493] hover:shadow-xl"
            >
              Become a Member
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 transition hover:bg-white/10 lg:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <>
            <button
              type="button"
              aria-label="Close navigation overlay"
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-[4.5rem] -z-10 bg-black/25 backdrop-blur-[2px] lg:hidden"
            />

            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-2 rounded-2xl border border-white/10 bg-[#056839]/98 p-2.5 text-white shadow-2xl backdrop-blur-xl lg:hidden"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm text-white/80 transition duration-300 hover:bg-white/10 hover:text-white"
                >
                  <span>{item.label}</span>
                  <ArrowRight
                    size={15}
                    className="translate-x-0 opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </Link>
              ))}

              <Link
                href="/#membership"
                onClick={() => setOpen(false)}
                className="group mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#d7b765] px-4 py-3.5 text-sm font-bold text-[#15231c] transition duration-300 hover:bg-[#ead493]"
              >
                Become a Member
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </motion.header>
  );
}
