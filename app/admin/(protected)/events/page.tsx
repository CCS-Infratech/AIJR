import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  Images,
  MapPin,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  EventNewsType,
  Prisma,
  PublicationStatus,
} from "@prisma/client";

import EventDeleteButton from "@/components/admin/EventDeleteButton";
import { changeEventNewsStatus } from "@/lib/event-news-actions";
import { prisma } from "@/lib/prisma";

type EventsPageProps = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    status?: string;
    page?: string;
    saved?: string;
    deleted?: string;
    error?: string;
  }>;
};

const PAGE_SIZE = 10;

function formatDate(date: Date | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function statusLabel(status: string) {
  return status === "PUBLISHED" ? "Published" : "Draft";
}

function typeLabel(type: string) {
  return type === "EVENT" ? "Event" : "News";
}

function buildQuery(
  params: {
    q?: string;
    type?: string;
    status?: string;
    page?: number;
  },
  overrides: Record<string, string | number | null | undefined> = {}
) {
  const merged = {
    q: params.q,
    type: params.type,
    status: params.status,
    page: params.page,
    ...overrides,
  };

  const search = new URLSearchParams();

  if (merged.q) search.set("q", merged.q);
  if (merged.type) search.set("type", merged.type);
  if (merged.status) search.set("status", merged.status);
  if (merged.page && merged.page > 1) {
    search.set("page", String(merged.page));
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

function StatusBadge({ status }: { status: string }) {
  const published = status === "PUBLISHED";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold",
        published
          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
          : "border-amber-100 bg-amber-50 text-amber-700",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          published ? "bg-emerald-500" : "bg-amber-500",
        ].join(" ")}
      />
      {statusLabel(status)}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#056839]/10 bg-[#056839]/5 px-2.5 py-1 text-[11px] font-bold text-[#056839]">
      {typeLabel(type)}
    </span>
  );
}

export default async function EventsPage({
  searchParams,
}: EventsPageProps) {
  const params = await searchParams;

  const q = params.q?.trim() ?? "";
  const requestedType =
    params.type === "EVENT" || params.type === "NEWS"
      ? params.type
      : "";
  const requestedStatus =
    params.status === "PUBLISHED" || params.status === "DRAFT"
      ? params.status
      : "";

  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const safeRequestedPage = Number.isFinite(requestedPage)
    ? Math.max(1, requestedPage)
    : 1;

  const where: Prisma.EventNewsWhereInput = {};

  if (q) {
    where.OR = [
      {
        title: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        slug: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        excerpt: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        category: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        location: {
          contains: q,
          mode: "insensitive",
        },
      },
    ];
  }

  if (requestedType) {
    where.type = requestedType as EventNewsType;
  }

  if (requestedStatus) {
    where.status = requestedStatus as PublicationStatus;
  }

  const [totalItems, publishedCount, draftCount, eventCount, newsCount] =
    await Promise.all([
      prisma.eventNews.count({ where }),
      prisma.eventNews.count({
        where: {
          ...where,
          status: PublicationStatus.PUBLISHED,
        },
      }),
      prisma.eventNews.count({
        where: {
          ...where,
          status: PublicationStatus.DRAFT,
        },
      }),
      prisma.eventNews.count({
        where: {
          ...where,
          type: EventNewsType.EVENT,
        },
      }),
      prisma.eventNews.count({
        where: {
          ...where,
          type: EventNewsType.NEWS,
        },
      }),
    ]);

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const page = Math.min(safeRequestedPage, totalPages);
  const skip = (page - 1) * PAGE_SIZE;

  const [events, allCount] = await Promise.all([
    prisma.eventNews.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }],
      skip,
      take: PAGE_SIZE,
      include: {
        coverMedia: {
          select: {
            publicUrl: true,
            altText: true,
          },
        },
        _count: {
          select: {
            galleryItems: true,
          },
        },
      },
    }),
    prisma.eventNews.count(),
  ]);

  const firstItem = totalItems === 0 ? 0 : skip + 1;
  const lastItem = Math.min(skip + PAGE_SIZE, totalItems);

  const hasFilters = Boolean(q || requestedType || requestedStatus);

  const message = params.saved
    ? "Changes saved successfully."
    : params.deleted
      ? "Item deleted successfully."
      : null;

  const errorMessage =
    params.error === "not-found"
      ? "That item could not be found."
      : params.error === "delete-failed"
        ? "This item could not be deleted."
        : params.error === "invalid"
          ? "The requested action was invalid."
          : null;

  const queryParams = {
    q,
    type: requestedType,
    status: requestedStatus,
  };

  return (
    <div className="mx-auto max-w-[1500px]">
      {/* Header */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#056839]">
            Content management
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#15231c] sm:text-4xl">
            Events &amp; News
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#66746c] sm:text-base">
            Create, publish and manage the events and news that appear across
            the AIJR website.
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#056839] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#034d2a] hover:shadow-md"
        >
          <Plus className="h-[18px] w-[18px]" />
          Add Event / News
        </Link>
      </div>

      {/* Feedback */}
      {message && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3.5 text-sm font-medium text-emerald-800">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600">
            ✓
          </span>
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-700">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white">
            !
          </span>
          {errorMessage}
        </div>
      )}

      {/* Overview */}
      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/events"
          className={[
            "rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
            !requestedType && !requestedStatus && !q
              ? "border-[#056839]/30 ring-1 ring-[#056839]/10"
              : "border-[#e3e4dc]",
          ].join(" ")}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#66746c]">
              All content
            </span>
            <CalendarDays className="h-4 w-4 text-[#056839]" />
          </div>
          <p className="mt-3 text-2xl font-bold text-[#15231c]">
            {allCount}
          </p>
        </Link>

        <Link
          href={`/admin/events${buildQuery(queryParams, {
            status: "PUBLISHED",
            page: null,
          })}`}
          className="rounded-2xl border border-[#e3e4dc] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#66746c]">
              Published
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-3 text-2xl font-bold text-[#15231c]">
            {publishedCount}
          </p>
        </Link>

        <Link
          href={`/admin/events${buildQuery(queryParams, {
            status: "DRAFT",
            page: null,
          })}`}
          className="rounded-2xl border border-[#e3e4dc] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#66746c]">
              Drafts
            </span>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <p className="mt-3 text-2xl font-bold text-[#15231c]">
            {draftCount}
          </p>
        </Link>

        <div className="rounded-2xl border border-[#e3e4dc] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#66746c]">
              By type
            </span>
            <SlidersHorizontal className="h-4 w-4 text-[#056839]" />
          </div>
          <div className="mt-3 flex items-center gap-3 text-sm font-semibold">
            <span>{eventCount} events</span>
            <span className="h-1 w-1 rounded-full bg-[#c9cec8]" />
            <span>{newsCount} news</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <section className="mt-6 rounded-[1.5rem] border border-[#e3e4dc] bg-white p-4 shadow-sm sm:p-5">
        <form method="GET" className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#66746c]" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search title, slug, category or location..."
              className="h-12 w-full rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] pl-10 pr-4 text-sm text-[#15231c] outline-none transition placeholder:text-[#89948e] focus:border-[#056839] focus:bg-white focus:ring-4 focus:ring-[#056839]/10"
            />
          </div>

          <select
            name="type"
            defaultValue={requestedType}
            className="h-12 rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-4 text-sm font-medium text-[#15231c] outline-none transition focus:border-[#056839] focus:bg-white focus:ring-4 focus:ring-[#056839]/10"
          >
            <option value="">All types</option>
            <option value="EVENT">Events</option>
            <option value="NEWS">News</option>
          </select>

          <select
            name="status"
            defaultValue={requestedStatus}
            className="h-12 rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-4 text-sm font-medium text-[#15231c] outline-none transition focus:border-[#056839] focus:bg-white focus:ring-4 focus:ring-[#056839]/10"
          >
            <option value="">All statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#056839] px-5 text-sm font-bold text-white transition hover:bg-[#034d2a]"
            >
              <Search className="h-4 w-4" />
              Search
            </button>

            {hasFilters && (
              <Link
                href="/admin/events"
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e3e4dc] bg-white text-[#66746c] transition hover:bg-[#f8f7f1] hover:text-[#056839]"
                aria-label="Clear filters"
                title="Clear filters"
              >
                <X className="h-4 w-4" />
              </Link>
            )}
          </div>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eef0ec] pt-4 text-xs text-[#66746c]">
          <span>
            {totalItems === 0
              ? "No results"
              : `Showing ${firstItem}–${lastItem} of ${totalItems} results`}
          </span>

          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {q && (
                <span className="rounded-full bg-[#f8f7f1] px-3 py-1.5 font-medium">
                  Search: {q}
                </span>
              )}
              {requestedType && <TypeBadge type={requestedType} />}
              {requestedStatus && (
                <StatusBadge status={requestedStatus} />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Empty state */}
      {events.length === 0 ? (
        <section className="mt-6 rounded-[1.5rem] border border-[#e3e4dc] bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#056839]/7 text-[#056839]">
            {hasFilters ? (
              <Search className="h-6 w-6" />
            ) : (
              <CalendarDays className="h-6 w-6" />
            )}
          </div>

          <h3 className="mt-5 text-xl font-bold text-[#15231c]">
            {hasFilters
              ? "No matching content found."
              : "No events or news yet."}
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#66746c]">
            {hasFilters
              ? "Try adjusting your search or filters to find what you are looking for."
              : "Create your first event or news article to start managing AIJR content."}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {hasFilters && (
              <Link
                href="/admin/events"
                className="inline-flex items-center gap-2 rounded-xl border border-[#e3e4dc] bg-white px-4 py-3 text-sm font-semibold text-[#056839] transition hover:bg-[#f8f7f1]"
              >
                Clear filters
              </Link>
            )}

            <Link
              href="/admin/events/new"
              className="inline-flex items-center gap-2 rounded-xl bg-[#056839] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#034d2a]"
            >
              <Plus className="h-4 w-4" />
              Create Event / News
            </Link>
          </div>
        </section>
      ) : (
        <>
          {/* Desktop */}
          <section className="mt-6 hidden overflow-hidden rounded-[1.5rem] border border-[#e3e4dc] bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#e3e4dc] bg-[#f8f7f1] text-[10px] uppercase tracking-[0.14em] text-[#66746c]">
                  <tr>
                    <th className="px-6 py-4 font-bold">Content</th>
                    <th className="px-4 py-4 font-bold">Type</th>
                    <th className="px-4 py-4 font-bold">Status</th>
                    <th className="px-4 py-4 font-bold">Date</th>
                    <th className="px-4 py-4 font-bold">Gallery</th>
                    <th className="px-4 py-4 font-bold">Updated</th>
                    <th className="px-6 py-4 text-right font-bold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eef0ec]">
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="group align-middle transition hover:bg-[#f8f7f1]/60"
                    >
                      <td className="max-w-[360px] px-6 py-4">
                        <div className="flex items-center gap-3">
                          {event.coverMedia?.publicUrl ? (
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#eef1ec]">
                              <Image
                                src={event.coverMedia.publicUrl}
                                alt={event.coverMedia.altText || event.title}
                                fill
                                sizes="56px"
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f8f7f1] text-[#056839]">
                              <CalendarDays className="h-5 w-5" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <Link
                              href={`/admin/events/${event.id}/edit`}
                              className="block truncate font-semibold text-[#15231c] hover:text-[#056839]"
                            >
                              {event.title}
                            </Link>

                            <p className="mt-1 truncate text-xs text-[#66746c]">
                              /{event.slug}
                            </p>

                            {event.location && (
                              <p className="mt-1 flex items-center gap-1 truncate text-xs text-[#89948e]">
                                <MapPin className="h-3 w-3 shrink-0" />
                                {event.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <TypeBadge type={event.type} />
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={event.status} />
                      </td>

                      <td className="px-4 py-4 text-[#66746c]">
                        {formatDate(event.eventStart)}
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#056839]">
                          <Images className="h-3.5 w-3.5" />
                          {event._count.galleryItems}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-xs text-[#66746c]">
                        {formatDateTime(event.updatedAt)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {event.status === "PUBLISHED" && (
                            <Link
                              href={`/events/${event.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-[#66746c] transition hover:bg-[#f8f7f1] hover:text-[#056839]"
                              title="View on website"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Link>
                          )}

                          <Link
                            href={`/admin/events/${event.id}/edit`}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-[#056839] transition hover:bg-[#056839]/5"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>

                          <form action={changeEventNewsStatus}>
                            <input
                              type="hidden"
                              name="id"
                              value={event.id}
                            />
                            <input
                              type="hidden"
                              name="status"
                              value={
                                event.status === "PUBLISHED"
                                  ? "DRAFT"
                                  : "PUBLISHED"
                              }
                            />
                            <button
                              type="submit"
                              className="rounded-lg px-2.5 py-2 text-xs font-semibold text-[#66746c] transition hover:bg-[#f8f7f1] hover:text-[#15231c]"
                            >
                              {event.status === "PUBLISHED"
                                ? "Unpublish"
                                : "Publish"}
                            </button>
                          </form>

                          <EventDeleteButton
                            id={event.id}
                            title={event.title}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Mobile / tablet */}
          <section className="mt-6 space-y-3 lg:hidden">
            {events.map((event) => (
              <article
                key={event.id}
                className="rounded-[1.35rem] border border-[#e3e4dc] bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
              >
                <div className="flex gap-3">
                  {event.coverMedia?.publicUrl ? (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#eef1ec] sm:h-20 sm:w-20">
                      <Image
                        src={event.coverMedia.publicUrl}
                        alt={event.coverMedia.altText || event.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#f8f7f1] text-[#056839] sm:h-20 sm:w-20">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <TypeBadge type={event.type} />
                      <StatusBadge status={event.status} />
                    </div>

                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="mt-2 block line-clamp-2 text-sm font-bold leading-5 text-[#15231c] hover:text-[#056839]"
                    >
                      {event.title}
                    </Link>

                    <p className="mt-1 truncate text-xs text-[#66746c]">
                      /{event.slug}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#f8f7f1]/70 p-3 text-xs">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#89948e]">
                      Date
                    </p>
                    <p className="mt-1 font-semibold text-[#15231c]">
                      {formatDate(event.eventStart)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#89948e]">
                      Gallery
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 font-semibold text-[#056839]">
                      <Images className="h-3.5 w-3.5" />
                      {event._count.galleryItems} images
                    </p>
                  </div>

                  {event.location && (
                    <div className="col-span-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#89948e]">
                        Location
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 font-semibold text-[#15231c]">
                        <MapPin className="h-3.5 w-3.5 text-[#056839]" />
                        {event.location}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#056839] px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-[#034d2a]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>

                  {event.status === "PUBLISHED" && (
                    <Link
                      href={`/events/${event.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#e3e4dc] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#056839] transition hover:bg-[#f8f7f1]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>
                  )}

                  <form action={changeEventNewsStatus}>
                    <input
                      type="hidden"
                      name="id"
                      value={event.id}
                    />
                    <input
                      type="hidden"
                      name="status"
                      value={
                        event.status === "PUBLISHED"
                          ? "DRAFT"
                          : "PUBLISHED"
                      }
                    />
                    <button
                      type="submit"
                      className="rounded-xl border border-[#e3e4dc] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#66746c] transition hover:bg-[#f8f7f1] hover:text-[#15231c]"
                    >
                      {event.status === "PUBLISHED"
                        ? "Unpublish"
                        : "Publish"}
                    </button>
                  </form>

                  <EventDeleteButton
                    id={event.id}
                    title={event.title}
                  />
                </div>
              </article>
            ))}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#e3e4dc] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#66746c]">
                Page <span className="font-bold text-[#15231c]">{page}</span>{" "}
                of{" "}
                <span className="font-bold text-[#15231c]">
                  {totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">
                {page > 1 ? (
                  <Link
                    href={`/admin/events${buildQuery(queryParams, {
                      page: page - 1,
                    })}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#e3e4dc] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#66746c] transition hover:bg-[#f8f7f1] hover:text-[#056839]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#eef0ec] bg-[#f8f7f1] px-3.5 py-2.5 text-xs font-semibold text-[#b0b7b2]">
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </span>
                )}

                <div className="hidden items-center gap-1 sm:flex">
                  {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .filter((pageNumber) => {
                      if (totalPages <= 7) return true;
                      return (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        Math.abs(pageNumber - page) <= 1
                      );
                    })
                    .map((pageNumber, index, visiblePages) => {
                      const previous = visiblePages[index - 1];
                      const showEllipsis =
                        previous !== undefined &&
                        pageNumber - previous > 1;

                      return (
                        <span key={pageNumber} className="contents">
                          {showEllipsis && (
                            <span className="px-1 text-xs text-[#a3aca6]">
                              …
                            </span>
                          )}

                          <Link
                            href={`/admin/events${buildQuery(queryParams, {
                              page: pageNumber,
                            })}`}
                            className={[
                              "inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-xs font-bold transition",
                              pageNumber === page
                                ? "bg-[#056839] text-white shadow-sm"
                                : "text-[#66746c] hover:bg-[#f8f7f1] hover:text-[#056839]",
                            ].join(" ")}
                          >
                            {pageNumber}
                          </Link>
                        </span>
                      );
                    })}
                </div>

                {page < totalPages ? (
                  <Link
                    href={`/admin/events${buildQuery(queryParams, {
                      page: page + 1,
                    })}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#e3e4dc] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#66746c] transition hover:bg-[#f8f7f1] hover:text-[#056839]"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#eef0ec] bg-[#f8f7f1] px-3.5 py-2.5 text-xs font-semibold text-[#b0b7b2]">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between px-1 text-[11px] text-[#89948e]">
            <span>
              {totalItems} result{totalItems === 1 ? "" : "s"} in current
              filter
            </span>

            <Link
              href="/admin/events/new"
              className="hidden items-center gap-1 font-bold text-[#056839] hover:underline sm:inline-flex"
            >
              Create another
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
