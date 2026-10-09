import Image from "next/image";
import Link from "next/link";

import MediaLibraryPicker from "@/components/admin/MediaLibraryPicker";
import LeadershipDeleteButton from "@/components/admin/LeadershipDeleteButton";
import { saveLeadership } from "@/lib/admin-content-actions";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 10;

type SearchParams = {
  edit?: string;
  error?: string;
  saved?: string;
  deleted?: string;
  q?: string;
  status?: string;
  page?: string;
};

function getFeedback(error?: string) {
  if (!error) return "";

  if (error === "invalid") {
    return "Please provide a name and designation, and make sure the selected photo is a valid image.";
  }

  if (error === "not-found") {
    return "The selected leadership member could not be found.";
  }

  return error;
}

function buildListHref({
  q,
  status,
  page,
  edit,
}: {
  q: string;
  status: string;
  page?: number;
  edit?: string;
}) {
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (status !== "all") params.set("status", status);
  if (page && page > 1) params.set("page", String(page));
  if (edit) params.set("edit", edit);

  const query = params.toString();
  return `/admin/leadership${query ? `?${query}` : ""}`;
}

export default async function LeadershipAdmin({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const edit = params.edit ?? "";
  const q = params.q?.trim() ?? "";
  const status =
    params.status === "active" || params.status === "inactive"
      ? params.status
      : "all";

  const requestedPage = Math.max(
    1,
    Number.parseInt(params.page ?? "1", 10) || 1
  );

  const where = {
    ...(status === "active"
      ? { active: true }
      : status === "inactive"
        ? { active: false }
        : {}),
    ...(q
      ? {
          OR: [
            {
              name: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
            {
              designation: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
            {
              bio: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [filteredCount, total, activeCount, inactiveCount, withPhotoCount] =
    await Promise.all([
      prisma.leadershipMember.count({ where }),
      prisma.leadershipMember.count(),
      prisma.leadershipMember.count({
        where: { active: true },
      }),
      prisma.leadershipMember.count({
        where: { active: false },
      }),
      prisma.leadershipMember.count({
        where: {
          photoMediaId: {
            not: null,
          },
        },
      }),
    ]);

  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);

  const [members, current] = await Promise.all([
    prisma.leadershipMember.findMany({
      where,
      include: {
        photoMedia: true,
      },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    edit
      ? prisma.leadershipMember.findUnique({
          where: { id: edit },
          include: {
            photoMedia: true,
          },
        })
      : null,
  ]);

  const currentPhoto = current?.photoMedia?.publicUrl
    ? {
        id: current.photoMedia.id,
        storageKey: current.photoMedia.storageKey,
        publicUrl: current.photoMedia.publicUrl,
        mediaType: current.photoMedia.mediaType,
        mimeType: current.photoMedia.mimeType,
        fileSize: current.photoMedia.fileSize,
        altText: current.photoMedia.altText,
        caption: current.photoMedia.caption,
        createdAt: current.photoMedia.createdAt.toISOString(),
      }
    : null;

  const feedback = getFeedback(params.error);

  const field =
    "mt-1 w-full rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-3 py-2.5 text-sm text-[#15231c] outline-none transition placeholder:text-[#8b958f] focus:border-[#056839] focus:ring-2 focus:ring-[#056839]/10";

  const listBase = {
    q,
    status,
  };

  return (
    <>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#056839]">
            Content management
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#15231c]">
            Leadership
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66746c]">
            Manage the people, roles, order and photos shown in your
            leadership content.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-[#056839]/10 px-3 py-2 text-[#056839]">
            {total} total
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">
            {activeCount} active
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-700">
            {inactiveCount} inactive
          </span>
        </div>
      </div>

      {(params.saved === "1" ||
        params.deleted === "1" ||
        feedback ||
        (edit && !current)) && (
        <div className="mt-6 space-y-3">
          {params.saved === "1" && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              Leadership member saved successfully.
            </div>
          )}

          {params.deleted === "1" && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              Leadership member deleted successfully.
            </div>
          )}

          {feedback && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {feedback}
            </div>
          )}

          {edit && !current && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              The selected leadership member no longer exists.
            </div>
          )}
        </div>
      )}

      <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "All members",
            value: total,
            meta: "Total profiles",
          },
          {
            label: "Active",
            value: activeCount,
            meta: "Visible profiles",
          },
          {
            label: "Inactive",
            value: inactiveCount,
            meta: "Hidden profiles",
          },
          {
            label: "With photo",
            value: withPhotoCount,
            meta: "Media linked",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-[1.25rem] border border-[#e3e4dc] bg-white p-4 sm:p-5"
          >
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-[#15231c]">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-[#89948d]">{card.meta}</p>
          </div>
        ))}
      </section>

      <section className="mt-7 rounded-[1.5rem] border border-[#e3e4dc] bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
              Member directory
            </p>
            <h2 className="mt-2 text-xl font-bold text-[#15231c]">
              {filteredCount} matching{" "}
              {filteredCount === 1 ? "member" : "members"}
            </h2>
          </div>

          <form
            method="get"
            className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px_auto]"
          >
            <input
              name="q"
              defaultValue={q}
              placeholder="Search name, position or bio..."
              className={field}
            />

            <select
              name="status"
              defaultValue={status}
              className={field}
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </select>

            <button
              type="submit"
              className="rounded-xl bg-[#056839] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#04572f]"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="mt-5 rounded-[1.5rem] border border-[#e3e4dc] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#e8e9e3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-base font-bold text-[#15231c]">
              {current ? "Edit member" : "Add member"}
            </h2>
            <p className="mt-1 text-xs text-[#66746c]">
              {current
                ? "Update the selected leadership profile."
                : "Create a new leadership profile."}
            </p>
          </div>

          {current && (
            <Link
              href={buildListHref(listBase)}
              className="rounded-full border border-[#dfe1d8] px-4 py-2 text-xs font-bold text-[#056839] transition hover:bg-[#f8f7f1]"
            >
              Cancel edit
            </Link>
          )}
        </div>

        <form action={saveLeadership} className="p-5 sm:p-6">
          {current && (
            <input type="hidden" name="id" value={current.id} />
          )}

          <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                  Name
                </span>
                <input
                  required
                  name="name"
                  defaultValue={current?.name ?? ""}
                  placeholder="Full name"
                  className={field}
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                  Position
                </span>
                <input
                  required
                  name="designation"
                  defaultValue={current?.designation ?? ""}
                  placeholder="e.g. President"
                  className={field}
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                  Display order
                </span>
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={current?.sortOrder ?? 0}
                  min="0"
                  className={field}
                />
                <span className="mt-1 block text-xs text-[#89948d]">
                  Lower numbers appear first.
                </span>
              </label>

              <label className="flex items-center gap-3 self-end rounded-xl border border-[#e3e4dc] bg-[#f8f7f1] px-4 py-3">
                <input
                  name="active"
                  type="checkbox"
                  defaultChecked={current?.active ?? true}
                  className="h-4 w-4 rounded border-[#cbd0ca] text-[#056839] focus:ring-[#056839]"
                />
                <span>
                  <span className="block text-sm font-bold text-[#15231c]">
                    Active member
                  </span>
                  <span className="block text-xs text-[#66746c]">
                    Keep this profile visible to consumers of leadership data.
                  </span>
                </span>
              </label>
            </div>

            <div className="rounded-[1.25rem] border border-[#e3e4dc] bg-[#fafaf7] p-4">
              <MediaLibraryPicker
                name="photoMediaId"
                urlName="photoUrl"
                mode="single"
                folder="leadership"
                label="Leadership photo"
                helperText="Select an existing image or upload a new leadership photo."
                initialItems={currentPhoto ? [currentPhoto] : []}
              />
            </div>
          </div>

          <label className="mt-5 block">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
              Bio
            </span>

            <textarea
              name="bio"
              rows={6}
              defaultValue={current?.bio ?? ""}
              placeholder="Optional short biography..."
              className={`${field} resize-y`}
            />
          </label>

          <div className="mt-5 flex flex-col gap-3 border-t border-[#e8e9e3] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[#89948d]">
              Existing shared Media Library assets are referenced, not modified,
              when selected here.
            </p>

            <button
              type="submit"
              className="rounded-full bg-[#056839] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#04572f]"
            >
              {current ? "Save changes" : "Add member"}
            </button>
          </div>
        </form>
      </section>

      <section className="mt-6 hidden overflow-hidden rounded-[1.5rem] border border-[#e3e4dc] bg-white lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-[#f8f7f1] text-left text-xs font-bold uppercase tracking-[0.1em] text-[#66746c]">
              <tr>
                <th className="px-5 py-4">Member</th>
                <th className="px-4 py-4">Position</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Order</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {members.length ? (
                members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-t border-[#ecece7] transition hover:bg-[#fbfbf8]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {member.photoMedia?.publicUrl ? (
                          <Image
                            src={member.photoMedia.publicUrl}
                            alt={member.photoMedia.altText || member.name}
                            width={56}
                            height={56}
                            unoptimized
                            className="h-14 w-14 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f1f2ec] text-xs font-bold text-[#89948d]">
                            No photo
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate font-bold text-[#15231c]">
                            {member.name}
                          </p>
                          <p className="mt-1 line-clamp-2 max-w-[280px] text-xs leading-5 text-[#66746c]">
                            {member.bio || "No biography added."}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-medium text-[#34423a]">
                      {member.designation}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          member.active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {member.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-4 font-semibold text-[#34423a]">
                      {member.sortOrder}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={buildListHref({
                            ...listBase,
                            edit: member.id,
                            page: currentPage,
                          })}
                          className="rounded-lg px-3 py-2 text-xs font-bold text-[#056839] transition hover:bg-[#056839]/5"
                        >
                          Edit
                        </Link>

                        <LeadershipDeleteButton
                          id={member.id}
                          name={member.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <p className="text-base font-bold text-[#15231c]">
                      No leadership members found
                    </p>
                    <p className="mt-2 text-sm text-[#66746c]">
                      Try changing the search or status filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 space-y-3 lg:hidden">
        {members.length ? (
          members.map((member) => (
            <article
              key={member.id}
              className="rounded-[1.25rem] border border-[#e3e4dc] bg-white p-4"
            >
              <div className="flex gap-4">
                {member.photoMedia?.publicUrl ? (
                  <Image
                    src={member.photoMedia.publicUrl}
                    alt={member.photoMedia.altText || member.name}
                    width={72}
                    height={72}
                    unoptimized
                    className="h-[72px] w-[72px] shrink-0 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-[#f1f2ec] text-xs font-bold text-[#89948d]">
                    No photo
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-[#15231c]">
                        {member.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#66746c]">
                        {member.designation}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        member.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {member.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-3 text-xs leading-5 text-[#66746c]">
                    {member.bio || "No biography added."}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#ecece7] pt-3">
                <span className="text-xs font-semibold text-[#89948d]">
                  Display order: {member.sortOrder}
                </span>

                <div className="flex gap-1">
                  <Link
                    href={buildListHref({
                      ...listBase,
                      edit: member.id,
                      page: currentPage,
                    })}
                    className="rounded-lg px-3 py-2 text-xs font-bold text-[#056839] hover:bg-[#056839]/5"
                  >
                    Edit
                  </Link>

                  <LeadershipDeleteButton
                    id={member.id}
                    name={member.name}
                  />
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.25rem] border border-[#e3e4dc] bg-white px-6 py-14 text-center">
            <p className="font-bold text-[#15231c]">
              No leadership members found
            </p>
            <p className="mt-2 text-sm text-[#66746c]">
              Try changing the search or status filter.
            </p>
          </div>
        )}
      </section>

      {filteredCount > 0 && (
        <div className="mt-5 flex flex-col gap-3 rounded-[1.25rem] border border-[#e3e4dc] bg-white px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#66746c]">
            Showing{" "}
            <span className="font-bold text-[#15231c]">
              {(currentPage - 1) * PAGE_SIZE + 1}
            </span>
            {"–"}
            <span className="font-bold text-[#15231c]">
              {Math.min(currentPage * PAGE_SIZE, filteredCount)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[#15231c]">{filteredCount}</span>
          </p>

          <div className="flex items-center gap-2">
            {currentPage > 1 ? (
              <Link
                href={buildListHref({
                  ...listBase,
                  page: currentPage - 1,
                })}
                className="rounded-full border border-[#dfe1d8] px-4 py-2 text-xs font-bold text-[#34423a] transition hover:bg-[#f8f7f1]"
              >
                Previous
              </Link>
            ) : (
              <span className="rounded-full border border-[#ecece7] px-4 py-2 text-xs font-bold text-[#b1b8b3]">
                Previous
              </span>
            )}

            <span className="rounded-full bg-[#056839]/10 px-4 py-2 text-xs font-bold text-[#056839]">
              {currentPage} / {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link
                href={buildListHref({
                  ...listBase,
                  page: currentPage + 1,
                })}
                className="rounded-full border border-[#dfe1d8] px-4 py-2 text-xs font-bold text-[#34423a] transition hover:bg-[#f8f7f1]"
              >
                Next
              </Link>
            ) : (
              <span className="rounded-full border border-[#ecece7] px-4 py-2 text-xs font-bold text-[#b1b8b3]">
                Next
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
