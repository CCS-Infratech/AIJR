"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type AdminShellProps = {
  children: ReactNode;
  logoutAction: () => Promise<void>;
};

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Events & News",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    label: "Gallery / Media",
    href: "/admin/gallery",
    icon: Images,
  },
  {
    label: "Leadership",
    href: "/admin/leadership",
    icon: Users,
  },
  {
    label: "Membership",
    href: "/admin/membership",
    icon: CreditCard,
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

const pageNames: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/events": "Events & News",
  "/admin/gallery": "Gallery / Media",
  "/admin/leadership": "Leadership",
  "/admin/membership": "Membership",
  "/admin/messages": "Messages",
  "/admin/settings": "Settings",
};

export default function AdminShell({
  children,
  logoutAction,
}: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPage = useMemo(() => {
    if (pathname.startsWith("/admin/events/")) {
      return "Edit Event";
    }

    return pageNames[pathname] ?? "Administration";
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="min-h-screen bg-[#f5f7f3] text-[#15231c]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/10 bg-[#056839] text-white shadow-[10px_0_40px_rgba(3,77,42,0.08)] lg:flex">
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <Link
            href="/admin"
            className="group flex items-center gap-3"
            aria-label="AIJR Admin Dashboard"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 transition-transform duration-200 group-hover:scale-105">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div>
              <div className="text-sm font-semibold tracking-[0.18em]">
                AIJR
              </div>
              <div className="text-xs text-white/60">Administration</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
            Manage
          </div>

          <div className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-white text-[#056839] shadow-lg shadow-black/10"
                      : "text-white/75 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  {active && (
                    <motion.span
                      layoutId="admin-active-indicator"
                      className="absolute left-0 h-8 w-1 rounded-r-full bg-[#d7b765]"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}

                  <Icon
                    className={[
                      "h-[18px] w-[18px] shrink-0 transition-transform duration-200",
                      active
                        ? "text-[#056839]"
                        : "text-white/55 group-hover:scale-105 group-hover:text-white",
                    ].join(" ")}
                  />

                  <span className="flex-1">{item.label}</span>

                  {active && (
                    <ChevronRight className="h-4 w-4 text-[#056839]/60" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="mb-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-[18px] w-[18px]" />
            <span className="flex-1">View Website</span>
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/70 transition hover:bg-red-400/10 hover:text-white"
            >
              <LogOut className="h-[18px] w-[18px]" />
              <span>Sign out</span>
            </button>
          </form>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
              Admin Session
            </div>
            <div className="mt-1 text-xs text-white/65">
              Super Administrator
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[min(88vw,340px)] flex-col bg-[#056839] text-white shadow-2xl lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
              }}
            >
              <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
                <Link
                  href="/admin"
                  className="flex items-center gap-3"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="text-sm font-semibold tracking-[0.18em]">
                      AIJR
                    </div>
                    <div className="text-xs text-white/60">Administration</div>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation"
                  className="rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-6">
                <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
                  Manage
                </div>

                <div className="space-y-1.5">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={[
                          "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition",
                          active
                            ? "bg-white text-[#056839] shadow-lg"
                            : "text-white/75 hover:bg-white/10 hover:text-white",
                        ].join(" ")}
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {active && (
                          <ChevronRight className="h-4 w-4 text-[#056839]/60" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </nav>

              <div className="border-t border-white/10 p-4">
                <Link
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="mb-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <ExternalLink className="h-[18px] w-[18px]" />
                  <span>View Website</span>
                </Link>

                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    <LogOut className="h-[18px] w-[18px]" />
                    <span>Sign out</span>
                  </button>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-[#e3e4dc]/80 bg-[#f5f7f3]/90 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e3e4dc] bg-white text-[#056839] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <div className="hidden items-center gap-2 text-xs text-[#66746c] sm:flex">
                  <span>Admin</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="truncate">{currentPage}</span>
                </div>

                <h1 className="truncate text-base font-semibold text-[#15231c] sm:mt-0.5 sm:text-lg">
                  {currentPage}
                </h1>
              </div>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#e3e4dc] bg-white px-3.5 py-2 text-xs font-semibold text-[#056839] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <ExternalLink className="h-4 w-4" />
                View Website
              </Link>
            </div>
          </div>
        </header>

        <main className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
