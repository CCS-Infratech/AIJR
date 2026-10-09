import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ImageIcon,
  Mail,
  MessageSquare,
  Plus,
  Users,
  UserPlus,
} from "lucide-react";
import { MembershipStatus, ContactMessageStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

function formatDate(date: Date | null) {
  if (!date) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function statusLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function StatusBadge({ value }: { value: string }) {
  const styles =
    value === "PUBLISHED" ||
    value === "APPROVED" ||
    value === "REPLIED"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : value === "NEW"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : value === "REJECTED" || value === "CLOSED"
          ? "bg-red-50 text-red-700 border-red-100"
          : "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles}`}
    >
      {statusLabel(value)}
    </span>
  );
}

const quickActions = [
  {
    label: "Create Event / News",
    description: "Publish a new event or news article.",
    href: "/admin/events/new",
    icon: CalendarDays,
  },
  {
    label: "Upload Media",
    description: "Add photos and manage the media library.",
    href: "/admin/gallery",
    icon: ImageIcon,
  },
  {
    label: "Add Leadership",
    description: "Create or update a leadership profile.",
    href: "/admin/leadership",
    icon: Users,
  },
  {
    label: "View Messages",
    description: "Review contact enquiries and messages.",
    href: "/admin/messages",
    icon: MessageSquare,
  },
];

export default async function AdminDashboardPage() {
  const now = new Date();

  const [
    events,
    publishedEvents,
    gallery,
    leadership,
    activeLeadership,
    membership,
    newMembership,
    messages,
    newMessages,
    recentEvents,
    recentMembership,
    recentMessages,
  ] = await Promise.all([
    prisma.eventNews.count(),
    prisma.eventNews.count({
      where: { status: "PUBLISHED" },
    }),
    prisma.galleryItem.count(),
    prisma.leadershipMember.count(),
    prisma.leadershipMember.count({
      where: { active: true },
    }),
    prisma.membershipApplication.count(),
    prisma.membershipApplication.count({
      where: { status: MembershipStatus.NEW },
    }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({
      where: { status: ContactMessageStatus.NEW },
    }),
    prisma.eventNews.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        eventStart: true,
        updatedAt: true,
      },
    }),
    prisma.membershipApplication.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        subject: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const upcomingEvents = await prisma.eventNews.count({
    where: {
      type: "EVENT",
      status: "PUBLISHED",
      eventStart: {
        gte: now,
      },
    },
  });

  const stats = [
    {
      label: "Events & News",
      value: events,
      meta: `${publishedEvents} published`,
      href: "/admin/events",
      icon: CalendarDays,
      iconClass: "bg-emerald-50 text-[#056839]",
    },
    {
      label: "Gallery Media",
      value: gallery,
      meta: "Media items",
      href: "/admin/gallery",
      icon: ImageIcon,
      iconClass: "bg-amber-50 text-amber-700",
    },
    {
      label: "Leadership",
      value: leadership,
      meta: `${activeLeadership} active`,
      href: "/admin/leadership",
      icon: Users,
      iconClass: "bg-sky-50 text-sky-700",
    },
    {
      label: "Membership",
      value: membership,
      meta: `${newMembership} new`,
      href: "/admin/membership",
      icon: UserPlus,
      iconClass: "bg-violet-50 text-violet-700",
    },
    {
      label: "Messages",
      value: messages,
      meta: `${newMessages} new`,
      href: "/admin/messages",
      icon: Mail,
      iconClass: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <div className="mx-auto max-w-[1500px]">
      {/* Welcome */}
      <section>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#056839]">
              Administration overview
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#15231c] sm:text-4xl">
              Good to see you.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#66746c] sm:text-base">
              Manage AIJR events, media, leadership, memberships and incoming
              messages from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/events/new"
              className="inline-flex items-center gap-2 rounded-xl bg-[#056839] px-4 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#034d2a] hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              Create Event
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-[#e3e4dc] bg-white px-4 py-3 text-sm font-semibold text-[#056839] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              View Website
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-[1.35rem] border border-[#e3e4dc] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.iconClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <ArrowRight className="h-4 w-4 text-[#66746c]/40 transition duration-200 group-hover:translate-x-0.5 group-hover:text-[#056839]" />
              </div>

              <p className="mt-6 text-3xl font-bold tracking-tight text-[#15231c]">
                {stat.value}
              </p>

              <p className="mt-1 text-sm font-semibold text-[#15231c]">
                {stat.label}
              </p>

              <p className="mt-1 text-xs text-[#66746c]">{stat.meta}</p>
            </Link>
          );
        })}
      </section>

      {/* Attention strip */}
      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.35rem] border border-amber-100 bg-amber-50/80 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm">
              <Mail className="h-5 w-5" />
            </div>

            <div>
              <p className="text-2xl font-bold text-amber-900">{newMessages}</p>
              <p className="text-xs font-semibold text-amber-800">
                New messages
              </p>
            </div>
          </div>

          <Link
            href="/admin/messages"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:underline"
          >
            Open inbox
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-[1.35rem] border border-violet-100 bg-violet-50/80 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
              <UserPlus className="h-5 w-5" />
            </div>

            <div>
              <p className="text-2xl font-bold text-violet-900">
                {newMembership}
              </p>
              <p className="text-xs font-semibold text-violet-800">
                New applications
              </p>
            </div>
          </div>

          <Link
            href="/admin/membership"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-violet-800 hover:underline"
          >
            Review applications
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-[1.35rem] border border-emerald-100 bg-emerald-50/80 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-2xl font-bold text-emerald-900">
                {upcomingEvents}
              </p>
              <p className="text-xs font-semibold text-emerald-800">
                Upcoming published events
              </p>
            </div>
          </div>

          <Link
            href="/admin/events"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline"
          >
            Manage events
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Main dashboard grid */}
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        {/* Recent events */}
        <div className="rounded-[1.5rem] border border-[#e3e4dc] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e3e4dc] px-5 py-5 sm:px-6">
            <div>
              <h3 className="text-base font-bold text-[#15231c]">
                Recent events & news
              </h3>
              <p className="mt-1 text-xs text-[#66746c]">
                Latest content activity
              </p>
            </div>

            <Link
              href="/admin/events"
              className="text-xs font-bold text-[#056839] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-[#e3e4dc]">
            {recentEvents.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <CalendarDays className="mx-auto h-7 w-7 text-[#056839]" />
                <p className="mt-3 text-sm font-semibold">
                  No events or news yet.
                </p>
                <Link
                  href="/admin/events/new"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#056839] hover:underline"
                >
                  Create the first item
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              recentEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/admin/events/${event.id}/edit`}
                  className="group flex items-center gap-4 px-5 py-4 transition hover:bg-[#f8f7f1]/70 sm:px-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#056839]/7 text-[#056839]">
                    <CalendarDays className="h-[18px] w-[18px]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-[#15231c]">
                        {event.title}
                      </p>
                      <StatusBadge value={event.status} />
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#66746c]">
                      <span>{event.type}</span>
                      <span>
                        {event.eventStart
                          ? formatDate(event.eventStart)
                          : "No event date"}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 shrink-0 text-[#66746c]/40 transition group-hover:translate-x-0.5 group-hover:text-[#056839]" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent messages */}
        <div className="rounded-[1.5rem] border border-[#e3e4dc] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e3e4dc] px-5 py-5 sm:px-6">
            <div>
              <h3 className="text-base font-bold text-[#15231c]">
                Recent messages
              </h3>
              <p className="mt-1 text-xs text-[#66746c]">
                Latest enquiries from the website
              </p>
            </div>

            <Link
              href="/admin/messages"
              className="text-xs font-bold text-[#056839] hover:underline"
            >
              Open inbox
            </Link>
          </div>

          <div className="divide-y divide-[#e3e4dc]">
            {recentMessages.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <MessageSquare className="mx-auto h-7 w-7 text-[#056839]" />
                <p className="mt-3 text-sm font-semibold">
                  No messages yet.
                </p>
              </div>
            ) : (
              recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start gap-3 px-5 py-4 sm:px-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
                    <Mail className="h-[18px] w-[18px]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold">
                        {message.name}
                      </p>
                      <StatusBadge value={message.status} />
                    </div>

                    <p className="mt-1 truncate text-xs text-[#66746c]">
                      {message.subject}
                    </p>

                    <p className="mt-2 text-[11px] text-[#66746c]">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Membership + quick actions */}
      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[1.5rem] border border-[#e3e4dc] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e3e4dc] px-5 py-5 sm:px-6">
            <div>
              <h3 className="text-base font-bold text-[#15231c]">
                Recent membership applications
              </h3>
              <p className="mt-1 text-xs text-[#66746c]">
                Latest applications received
              </p>
            </div>

            <Link
              href="/admin/membership"
              className="text-xs font-bold text-[#056839] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-[#e3e4dc]">
            {recentMembership.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <UserPlus className="mx-auto h-7 w-7 text-[#056839]" />
                <p className="mt-3 text-sm font-semibold">
                  No membership applications yet.
                </p>
              </div>
            ) : (
              recentMembership.map((application) => (
                <Link
                  key={application.id}
                  href="/admin/membership"
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-[#f8f7f1]/70 sm:px-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <UserPlus className="h-[18px] w-[18px]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {application.fullName}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#66746c]">
                      {application.email}
                    </p>
                  </div>

                  <div className="hidden shrink-0 sm:block">
                    <StatusBadge value={application.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[#e3e4dc] bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h3 className="text-base font-bold text-[#15231c]">
              Quick actions
            </h3>
            <p className="mt-1 text-xs text-[#66746c]">
              Jump directly into the most common admin tasks.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group rounded-2xl border border-[#e3e4dc] bg-[#f8f7f1]/60 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#056839]/20 hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#056839] shadow-sm">
                      <Icon className="h-[18px] w-[18px]" />
                    </div>

                    <ArrowRight className="h-4 w-4 text-[#66746c]/40 transition group-hover:translate-x-0.5 group-hover:text-[#056839]" />
                  </div>

                  <p className="mt-4 text-sm font-bold">{action.label}</p>
                  <p className="mt-1 text-xs leading-5 text-[#66746c]">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer status */}
      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-[#e3e4dc] bg-white px-5 py-4 text-xs text-[#66746c] shadow-sm">
        <Clock3 className="h-4 w-4 text-[#056839]" />
        Dashboard data is loaded directly from the current AIJR content
        database.
      </div>
    </div>
  );
}
