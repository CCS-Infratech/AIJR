import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageSquare,
  Search,
  X,
} from "lucide-react";
import {
  ContactMessageStatus,
  Prisma,
} from "@prisma/client";

import MessageDeleteButton from "@/components/admin/MessageDeleteButton";
import { updateMessage } from "@/lib/admin-content-actions";
import { prisma } from "@/lib/prisma";

type MessagesPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
    saved?: string;
    deleted?: string;
  }>;
};

const PAGE_SIZE = 10;

const statuses = [
  "NEW",
  "READ",
  "REPLIED",
  "CLOSED",
] as const;

function statusLabel(status: string) {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(date: Date) {
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

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "NEW"
      ? "border-amber-100 bg-amber-50 text-amber-700"
      : status === "REPLIED"
        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
        : status === "CLOSED"
          ? "border-slate-200 bg-slate-50 text-slate-600"
          : "border-sky-100 bg-sky-50 text-sky-700";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${className}`}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          status === "NEW"
            ? "bg-amber-500"
            : status === "REPLIED"
              ? "bg-emerald-500"
              : status === "CLOSED"
                ? "bg-slate-400"
                : "bg-sky-500",
        ].join(" ")}
      />
      {statusLabel(status)}
    </span>
  );
}

function buildQuery(
  params: {
    q?: string;
    status?: string;
  },
  page?: number
) {
  const search = new URLSearchParams();

  if (params.q) search.set("q", params.q);
  if (params.status) search.set("status", params.status);
  if (page && page > 1) search.set("page", String(page));

  const query = search.toString();

  return query ? `?${query}` : "";
}

export default async function MessagesAdmin({
  searchParams,
}: MessagesPageProps) {
  const params = await searchParams;

  const q = params.q?.trim() ?? "";
  const status = statuses.includes(
    params.status as (typeof statuses)[number]
  )
    ? params.status!
    : "";

  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const safeRequestedPage = Number.isFinite(requestedPage)
    ? Math.max(1, requestedPage)
    : 1;

  const where: Prisma.ContactMessageWhereInput = {};

  if (q) {
    where.OR = [
      {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        subject: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        message: {
          contains: q,
          mode: "insensitive",
        },
      },
    ];
  }

  if (status) {
    where.status = status as ContactMessageStatus;
  }

  const [
    totalItems,
    newCount,
    readCount,
    repliedCount,
    closedCount,
  ] = await Promise.all([
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.count({
      where: {
        ...where,
        status: ContactMessageStatus.NEW,
      },
    }),
    prisma.contactMessage.count({
      where: {
        ...where,
        status: ContactMessageStatus.READ,
      },
    }),
    prisma.contactMessage.count({
      where: {
        ...where,
        status: ContactMessageStatus.REPLIED,
      },
    }),
    prisma.contactMessage.count({
      where: {
        ...where,
        status: ContactMessageStatus.CLOSED,
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const page = Math.min(safeRequestedPage, totalPages);
  const skip = (page - 1) * PAGE_SIZE;

  const [rows, allCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.contactMessage.count(),
  ]);

  const firstItem = totalItems === 0 ? 0 : skip + 1;
  const lastItem = Math.min(skip + PAGE_SIZE, totalItems);
  const hasFilters = Boolean(q || status);

  const filteredQuery = (nextStatus?: string, nextPage?: number) =>
    buildQuery(
      {
        q,
        status: nextStatus ?? status,
      },
      nextPage
    );

  return (
    <div className="mx-auto max-w-[1500px]">
      {/* Header */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#056839]">
          Inbox
        </p>

        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#15231c] sm:text-4xl">
              Messages
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#66746c] sm:text-base">
              Review enquiries received from the AIJR website and keep track
              of their response status.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {params.saved && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3.5 text-sm font-medium text-emerald-800">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600">
            ✓
          </span>
          Message status updated successfully.
        </div>
      )}

      {params.deleted && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3.5 text-sm font-medium text-emerald-800">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600">
            ✓
          </span>
          Message deleted successfully.
        </div>
      )}

      {/* Overview */}
      <section className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/messages"
          className="rounded-2xl border border-[#e3e4dc] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#66746c]">
              All messages
            </span>
            <MessageSquare className="h-4 w-4 text-[#056839]" />
          </div>

          <p className="mt-3 text-2xl font-bold text-[#15231c]">
            {allCount}
          </p>
        </Link>

        <Link
          href={`/admin/messages${filteredQuery("NEW", 1)}`}
          className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-800">
              New
            </span>
            <Mail className="h-4 w-4 text-amber-700" />
          </div>

          <p className="mt-3 text-2xl font-bold text-amber-900">
            {newCount}
          </p>
        </Link>

        <Link
          href={`/admin/messages${filteredQuery("READ", 1)}`}
          className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-800">
              Read
            </span>
            <CheckCircle2 className="h-4 w-4 text-sky-700" />
          </div>

          <p className="mt-3 text-2xl font-bold text-sky-900">
            {readCount}
          </p>
        </Link>

        <div className="rounded-2xl border border-[#e3e4dc] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#66746c]">
              Pipeline
            </span>
            <ArrowRight className="h-4 w-4 text-[#056839]" />
          </div>

          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold">
            <span className="text-emerald-700">
              {repliedCount} replied
            </span>
            <span className="text-slate-500">
              {closedCount} closed
            </span>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="mt-6 rounded-[1.5rem] border border-[#e3e4dc] bg-white p-4 shadow-sm sm:p-5">
        <form
          method="GET"
          className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_auto]"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#66746c]" />

            <input
              name="q"
              defaultValue={q}
              placeholder="Search sender, email, subject or message..."
              className="h-12 w-full rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] pl-10 pr-4 text-sm outline-none transition placeholder:text-[#89948e] focus:border-[#056839] focus:bg-white focus:ring-4 focus:ring-[#056839]/10"
            />
          </div>

          <select
            name="status"
            defaultValue={status}
            className="h-12 rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-4 text-sm font-medium outline-none transition focus:border-[#056839] focus:bg-white focus:ring-4 focus:ring-[#056839]/10"
          >
            <option value="">All statuses</option>

            {statuses.map((item) => (
              <option key={item} value={item}>
                {statusLabel(item)}
              </option>
            ))}
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
                href="/admin/messages"
                aria-label="Clear filters"
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e3e4dc] bg-white text-[#66746c] transition hover:bg-[#f8f7f1] hover:text-[#056839]"
              >
                <X className="h-4 w-4" />
              </Link>
            )}
          </div>
        </form>

        <div className="mt-4 border-t border-[#eef0ec] pt-4 text-xs text-[#66746c]">
          {totalItems === 0
            ? "No matching messages"
            : `Showing ${firstItem}–${lastItem} of ${totalItems} messages`}
        </div>
      </section>

      {/* Results */}
      {rows.length === 0 ? (
        <section className="mt-6 rounded-[1.5rem] border border-[#e3e4dc] bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#056839]/7 text-[#056839]">
            {hasFilters ? (
              <Search className="h-6 w-6" />
            ) : (
              <MessageSquare className="h-6 w-6" />
            )}
          </div>

          <h3 className="mt-5 text-xl font-bold">
            {hasFilters
              ? "No matching messages."
              : "No messages yet."}
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#66746c]">
            {hasFilters
              ? "Try adjusting the search term or status filter."
              : "Messages submitted through the website will appear here."}
          </p>

          {hasFilters && (
            <Link
              href="/admin/messages"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#e3e4dc] bg-white px-4 py-3 text-sm font-semibold text-[#056839] transition hover:bg-[#f8f7f1]"
            >
              Clear filters
            </Link>
          )}
        </section>
      ) : (
        <>
          {/* Desktop inbox */}
          <section className="mt-6 hidden overflow-hidden rounded-[1.5rem] border border-[#e3e4dc] bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#e3e4dc] bg-[#f8f7f1] text-[10px] uppercase tracking-[0.14em] text-[#66746c]">
                  <tr>
                    <th className="px-6 py-4 font-bold">Sender</th>
                    <th className="px-4 py-4 font-bold">Message</th>
                    <th className="px-4 py-4 font-bold">Status</th>
                    <th className="px-4 py-4 font-bold">Received</th>
                    <th className="px-6 py-4 text-right font-bold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eef0ec]">
                  {rows.map((row) => {
                    const isNew = row.status === "NEW";

                    return (
                      <tr
                        key={row.id}
                        className={[
                          "align-top transition hover:bg-[#f8f7f1]/60",
                          isNew ? "bg-amber-50/20" : "",
                        ].join(" ")}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-start gap-3">
                            <div
                              className={[
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                                isNew
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-[#056839]/7 text-[#056839]",
                              ].join(" ")}
                            >
                              <Mail className="h-[18px] w-[18px]" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                {isNew && (
                                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                                )}

                                <p className="font-semibold text-[#15231c]">
                                  {row.name}
                                </p>
                              </div>

                              <a
                                href={`mailto:${row.email}`}
                                className="mt-1 block max-w-[220px] truncate text-xs text-[#056839] hover:underline"
                              >
                                {row.email}
                              </a>
                            </div>
                          </div>
                        </td>

                        <td className="max-w-[380px] px-4 py-5">
                          <p className="truncate font-semibold text-[#15231c]">
                            {row.subject}
                          </p>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#66746c]">
                            {row.message}
                          </p>
                        </td>

                        <td className="px-4 py-5">
                          <form
                            action={updateMessage}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="hidden"
                              name="id"
                              value={row.id}
                            />

                            <select
                              name="status"
                              defaultValue={row.status}
                              className="rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-2.5 py-2 text-xs font-semibold outline-none focus:border-[#056839]"
                            >
                              {statuses.map((item) => (
                                <option key={item} value={item}>
                                  {statusLabel(item)}
                                </option>
                              ))}
                            </select>

                            <button
                              type="submit"
                              className="text-xs font-bold text-[#056839] hover:underline"
                            >
                              Save
                            </button>
                          </form>

                          <div className="mt-2">
                            <StatusBadge status={row.status} />
                          </div>
                        </td>

                        <td className="px-4 py-5 text-xs text-[#66746c]">
                          <p>{formatDate(row.createdAt)}</p>
                          <p className="mt-1 text-[#89948e]">
                            {formatDateTime(row.createdAt)}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-1">
                            <details className="group relative">
                              <summary className="cursor-pointer list-none rounded-xl px-3 py-2 text-xs font-semibold text-[#056839] transition hover:bg-[#056839]/5">
                                View message
                              </summary>

                              <div className="absolute right-0 top-11 z-20 w-96 rounded-2xl border border-[#e3e4dc] bg-white p-5 shadow-xl">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-sm font-bold text-[#15231c]">
                                      {row.subject}
                                    </p>
                                    <p className="mt-1 truncate text-xs text-[#66746c]">
                                      From {row.name}
                                    </p>
                                  </div>

                                  <StatusBadge status={row.status} />
                                </div>

                                <p className="mt-4 whitespace-pre-wrap border-t border-[#eef0ec] pt-4 text-xs leading-6 text-[#66746c]">
                                  {row.message}
                                </p>

                                <a
                                  href={`mailto:${row.email}`}
                                  className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#056839] hover:underline"
                                >
                                  <Mail className="h-3.5 w-3.5" />
                                  Reply by email
                                </a>
                              </div>
                            </details>

                            <MessageDeleteButton
                              id={row.id}
                              name={row.name}
                              subject={row.subject}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Mobile */}
          <section className="mt-6 space-y-3 lg:hidden">
            {rows.map((row) => {
              const isNew = row.status === "NEW";

              return (
                <article
                  key={row.id}
                  className={[
                    "rounded-[1.35rem] border bg-white p-4 shadow-sm sm:p-5",
                    isNew
                      ? "border-amber-200"
                      : "border-[#e3e4dc]",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={[
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                        isNew
                          ? "bg-amber-50 text-amber-700"
                          : "bg-[#056839]/7 text-[#056839]",
                      ].join(" ")}
                    >
                      <Mail className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {isNew && (
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                        )}

                        <p className="text-sm font-bold">
                          {row.name}
                        </p>

                        <StatusBadge status={row.status} />
                      </div>

                      <a
                        href={`mailto:${row.email}`}
                        className="mt-1 block truncate text-xs text-[#056839]"
                      >
                        {row.email}
                      </a>

                      <p className="mt-1 text-[11px] text-[#89948e]">
                        {formatDateTime(row.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-[#f8f7f1]/70 p-3">
                    <p className="text-sm font-bold text-[#15231c]">
                      {row.subject}
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-[#66746c]">
                      {row.message}
                    </p>
                  </div>

                  <div className="mt-4">
                    <form
                      action={updateMessage}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={row.id}
                      />

                      <select
                        name="status"
                        defaultValue={row.status}
                        className="min-w-0 flex-1 rounded-xl border border-[#dfe1d8] bg-white px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#056839]"
                      >
                        {statuses.map((item) => (
                          <option key={item} value={item}>
                            {statusLabel(item)}
                          </option>
                        ))}
                      </select>

                      <button
                        type="submit"
                        className="rounded-xl bg-[#056839] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#034d2a]"
                      >
                        Save
                      </button>
                    </form>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <a
                      href={`mailto:${row.email}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#e3e4dc] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#056839] transition hover:bg-[#f8f7f1]"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Reply
                    </a>

                    <MessageDeleteButton
                      id={row.id}
                      name={row.name}
                      subject={row.subject}
                    />
                  </div>
                </article>
              );
            })}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#e3e4dc] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#66746c]">
                Page{" "}
                <span className="font-bold text-[#15231c]">
                  {page}
                </span>{" "}
                of{" "}
                <span className="font-bold text-[#15231c]">
                  {totalPages}
                </span>
              </p>

              <div className="flex items-center justify-between gap-2 sm:justify-end">
                {page > 1 ? (
                  <Link
                    href={`/admin/messages${buildQuery(
                      { q, status },
                      page - 1
                    )}`}
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

                <span className="px-2 text-xs font-bold text-[#15231c] sm:hidden">
                  {page}/{totalPages}
                </span>

                {page < totalPages ? (
                  <Link
                    href={`/admin/messages${buildQuery(
                      { q, status },
                      page + 1
                    )}`}
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
        </>
      )}
    </div>
  );
}
