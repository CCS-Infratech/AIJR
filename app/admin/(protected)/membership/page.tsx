import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Mail,
  Phone,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  MembershipStatus,
  Prisma,
} from "@prisma/client";

import MembershipDeleteButton from "@/components/admin/MembershipDeleteButton";
import { updateMembership } from "@/lib/admin-content-actions";
import { prisma } from "@/lib/prisma";

type MembershipPageProps = {
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
  "REVIEWED",
  "CONTACTED",
  "APPROVED",
  "REJECTED",
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
    status === "APPROVED"
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : status === "REJECTED"
        ? "border-red-100 bg-red-50 text-red-700"
        : status === "NEW"
          ? "border-amber-100 bg-amber-50 text-amber-700"
          : status === "CONTACTED"
            ? "border-sky-100 bg-sky-50 text-sky-700"
            : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${className}`}
    >
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

export default async function MembershipAdmin({
  searchParams,
}: MembershipPageProps) {
  const params = await searchParams;

  const q = params.q?.trim() ?? "";
  const status =
    statuses.includes(params.status as (typeof statuses)[number])
      ? params.status!
      : "";

  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const safeRequestedPage = Number.isFinite(requestedPage)
    ? Math.max(1, requestedPage)
    : 1;

  const where: Prisma.MembershipApplicationWhereInput = {};

  if (q) {
    where.OR = [
      {
        fullName: {
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
        phone: {
          contains: q,
        },
      },
    ];
  }

  if (status) {
    where.status = status as MembershipStatus;
  }

  const [totalItems, newCount, contactedCount, approvedCount] =
    await Promise.all([
      prisma.membershipApplication.count({ where }),
      prisma.membershipApplication.count({
        where: {
          ...where,
          status: MembershipStatus.NEW,
        },
      }),
      prisma.membershipApplication.count({
        where: {
          ...where,
          status: MembershipStatus.CONTACTED,
        },
      }),
      prisma.membershipApplication.count({
        where: {
          ...where,
          status: MembershipStatus.APPROVED,
        },
      }),
    ]);

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const page = Math.min(safeRequestedPage, totalPages);
  const skip = (page - 1) * PAGE_SIZE;

  const [rows, allCount] = await Promise.all([
    prisma.membershipApplication.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.membershipApplication.count(),
  ]);

  const firstItem = totalItems === 0 ? 0 : skip + 1;
  const lastItem = Math.min(skip + PAGE_SIZE, totalItems);
  const hasFilters = Boolean(q || status);

  const buildFilteredQuery = (
    overrideStatus?: string | null,
    overridePage?: number
  ) =>
    buildQuery(
      {
        q,
        status: overrideStatus ?? status,
      },
      overridePage
    );

  return (
    <div className="mx-auto max-w-[1500px]">
      {/* Header */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#056839]">
            Applications
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#15231c] sm:text-4xl">
            Membership
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#66746c] sm:text-base">
            Review membership applications, update their status and follow up
            with applicants.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/membership"
          className="rounded-2xl border border-[#e3e4dc] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#66746c]">
              All applications
            </span>
            <Users className="h-4 w-4 text-[#056839]" />
          </div>
          <p className="mt-3 text-2xl font-bold">{allCount}</p>
        </Link>

        <Link
          href={`/admin/membership${buildFilteredQuery("NEW", 1)}`}
          className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-800">
              New
            </span>
            <Clock3 className="h-4 w-4 text-amber-700" />
          </div>
          <p className="mt-3 text-2xl font-bold text-amber-900">
            {newCount}
          </p>
        </Link>

        <Link
          href={`/admin/membership${buildFilteredQuery("CONTACTED", 1)}`}
          className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-800">
              Contacted
            </span>
            <Phone className="h-4 w-4 text-sky-700" />
          </div>
          <p className="mt-3 text-2xl font-bold text-sky-900">
            {contactedCount}
          </p>
        </Link>

        <Link
          href={`/admin/membership${buildFilteredQuery("APPROVED", 1)}`}
          className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-800">
              Approved
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
          </div>
          <p className="mt-3 text-2xl font-bold text-emerald-900">
            {approvedCount}
          </p>
        </Link>
      </div>

      {/* Filters */}
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
              placeholder="Search name, email or phone..."
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
                href="/admin/membership"
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
            ? "No matching applications"
            : `Showing ${firstItem}–${lastItem} of ${totalItems} applications`}
        </div>
      </section>

      {/* Results */}
      {rows.length === 0 ? (
        <section className="mt-6 rounded-[1.5rem] border border-[#e3e4dc] bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#056839]/7 text-[#056839]">
            {hasFilters ? (
              <Search className="h-6 w-6" />
            ) : (
              <UserPlus className="h-6 w-6" />
            )}
          </div>

          <h3 className="mt-5 text-xl font-bold">
            {hasFilters
              ? "No matching applications."
              : "No membership applications yet."}
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#66746c]">
            {hasFilters
              ? "Try changing the search term or status filter."
              : "New applications submitted through the website will appear here."}
          </p>

          {hasFilters && (
            <Link
              href="/admin/membership"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#e3e4dc] bg-white px-4 py-3 text-sm font-semibold text-[#056839] transition hover:bg-[#f8f7f1]"
            >
              Clear filters
            </Link>
          )}
        </section>
      ) : (
        <>
          {/* Desktop */}
          <section className="mt-6 hidden overflow-hidden rounded-[1.5rem] border border-[#e3e4dc] bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#e3e4dc] bg-[#f8f7f1] text-[10px] uppercase tracking-[0.14em] text-[#66746c]">
                  <tr>
                    <th className="px-6 py-4 font-bold">Applicant</th>
                    <th className="px-4 py-4 font-bold">Contact</th>
                    <th className="px-4 py-4 font-bold">Status</th>
                    <th className="px-4 py-4 font-bold">Received</th>
                    <th className="px-6 py-4 text-right font-bold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eef0ec]">
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className="align-top transition hover:bg-[#f8f7f1]/50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                            <UserPlus className="h-[18px] w-[18px]" />
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-[#15231c]">
                              {row.fullName}
                            </p>

                            <p className="mt-1 text-xs text-[#66746c]">
                              Father&apos;s Name: {row.fatherName}
                            </p>

                            <p className="mt-1 max-w-[280px] truncate text-xs text-[#89948e]">
                              {row.address || "No address provided"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <div className="space-y-1.5">
                          <a
                            href={`mailto:${row.email}`}
                            className="flex items-center gap-2 text-xs font-medium text-[#056839] hover:underline"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span className="truncate">{row.email}</span>
                          </a>

                          <a
                            href={`tel:${row.phone}`}
                            className="flex items-center gap-2 text-xs text-[#66746c] hover:text-[#056839]"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            {row.phone}
                          </a>
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <form
                          action={updateMembership}
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
                              View details
                            </summary>

                            <div className="absolute right-0 top-11 z-20 w-80 rounded-2xl border border-[#e3e4dc] bg-white p-4 text-xs shadow-xl">
                              <p className="font-bold text-[#15231c]">
                                Application message
                              </p>

                              <p className="mt-2 whitespace-pre-wrap leading-6 text-[#66746c]">
                                {row.message || "No message provided."}
                              </p>
                            </div>
                          </details>

                          <MembershipDeleteButton
                            id={row.id}
                            name={row.fullName}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Mobile */}
          <section className="mt-6 space-y-3 lg:hidden">
            {rows.map((row) => (
              <article
                key={row.id}
                className="rounded-[1.35rem] border border-[#e3e4dc] bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <UserPlus className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold">{row.fullName}</p>
                      <StatusBadge status={row.status} />
                    </div>

                    <p className="mt-1 text-xs text-[#66746c]">
                      Father&apos;s Name: {row.fatherName}
                    </p>

                    <p className="mt-1 text-xs text-[#89948e]">
                      Applied {formatDate(row.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 rounded-xl bg-[#f8f7f1]/70 p-3">
                  <a
                    href={`mailto:${row.email}`}
                    className="flex items-center gap-2 text-xs font-medium text-[#056839]"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{row.email}</span>
                  </a>

                  <a
                    href={`tel:${row.phone}`}
                    className="flex items-center gap-2 text-xs font-medium text-[#66746c]"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {row.phone}
                  </a>

                  <div className="text-xs leading-5 text-[#66746c]">
                    <span className="font-semibold text-[#15231c]">
                      Address:
                    </span>{" "}
                    {row.address || "Not provided"}
                  </div>

                  <details className="mt-1">
                    <summary className="cursor-pointer text-xs font-bold text-[#056839]">
                      View application message
                    </summary>

                    <p className="mt-2 whitespace-pre-wrap border-t border-[#e3e4dc] pt-3 text-xs leading-6 text-[#66746c]">
                      {row.message || "No message provided."}
                    </p>
                  </details>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
                  <form
                    action={updateMembership}
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
                      className="rounded-xl bg-[#056839] px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-[#034d2a]"
                    >
                      Save
                    </button>
                  </form>

                  <MembershipDeleteButton
                    id={row.id}
                    name={row.fullName}
                  />
                </div>
              </article>
            ))}
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
                    href={`/admin/membership${buildQuery(
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
                    href={`/admin/membership${buildQuery(
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

      <div className="mt-4 flex items-center gap-2 px-1 text-[11px] text-[#89948e]">
        <ArrowRight className="h-3.5 w-3.5 text-[#056839]" />
        Membership applications are managed directly from this dashboard.
      </div>
    </div>
  );
}
