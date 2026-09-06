import { BarChart3, FolderOpen, ImageIcon, Mail, Users } from "lucide-react";

import { prisma } from "@/lib/prisma";

const cards = [
  { label: "Events & News", key: "events", icon: BarChart3 },
  { label: "Gallery", key: "gallery", icon: ImageIcon },
  { label: "Leadership", key: "leadership", icon: Users },
  { label: "Membership Applications", key: "membership", icon: FolderOpen },
  { label: "Contact Messages", key: "messages", icon: Mail },
] as const;

export default async function AdminDashboardPage() {
  const [events, gallery, leadership, membership, messages] = await Promise.all([
    prisma.eventNews.count(),
    prisma.galleryItem.count(),
    prisma.leadershipMember.count(),
    prisma.membershipApplication.count(),
    prisma.contactMessage.count(),
  ]);

  const counts = { events, gallery, leadership, membership, messages };

  return (
    <>
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#056839]">Dashboard</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">AIJR operations at a glance.</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#66746c] sm:text-base">
        This foundation is ready for the upcoming content-management modules. No public website content is managed here yet.
      </p>

      <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <section key={card.key} className="rounded-[1.5rem] border border-[#e3e4dc] bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#056839]/8 text-[#056839]">
                <Icon size={20} />
              </div>
              <p className="mt-6 text-3xl font-bold tracking-tight">{counts[card.key]}</p>
              <h2 className="mt-1 text-sm font-semibold text-[#66746c]">{card.label}</h2>
            </section>
          );
        })}
      </div>
    </>
  );
}
