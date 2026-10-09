import Image from "next/image";
import Link from "next/link";

import {
  deleteLeadership,
  saveLeadership,
} from "@/lib/admin-content-actions";
import { prisma } from "@/lib/prisma";
import MediaLibraryPicker from "@/components/admin/MediaLibraryPicker";

export default async function LeadershipAdmin({
  searchParams,
}: {
  searchParams: Promise<{
    edit?: string;
    error?: string;
  }>;
}) {
  const { edit, error } = await searchParams;

  const [members, current] =
    await Promise.all([
      prisma.leadershipMember.findMany({
        include: {
          photoMedia: true,
        },
        orderBy: [
          { sortOrder: "asc" },
          { createdAt: "desc" },
        ],
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
        storageKey:
          current.photoMedia.storageKey,
        publicUrl:
          current.photoMedia.publicUrl,
        mediaType:
          current.photoMedia.mediaType,
        mimeType:
          current.photoMedia.mimeType,
        fileSize:
          current.photoMedia.fileSize,
        altText:
          current.photoMedia.altText,
        caption:
          current.photoMedia.caption,
        createdAt:
          current.photoMedia.createdAt.toISOString(),
      }
    : null;

  const field =
    "mt-1 w-full rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-3 py-2.5 text-sm";

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.28em] text-[#056839]">
            Content management
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Leadership
          </h1>
        </div>

        {current && (
          <Link
            href="/admin/leadership"
            className="text-sm font-semibold text-[#056839]"
          >
            Cancel edit
          </Link>
        )}
      </div>

      {error && (
        <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        action={saveLeadership}
        className="mt-7 rounded-[1.5rem] border border-[#e3e4dc] bg-white p-5 sm:p-7"
      >
        {current && (
          <input
            type="hidden"
            name="id"
            value={current.id}
          />
        )}

        <h2 className="text-lg font-semibold">
          {current
            ? "Edit member"
            : "Add member"}
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label>
            Name
            <input
              required
              name="name"
              defaultValue={current?.name ?? ""}
              className={field}
            />
          </label>

          <label>
            Position
            <input
              required
              name="designation"
              defaultValue={
                current?.designation ?? ""
              }
              className={field}
            />
          </label>

          <label>
            Display order
            <input
              name="sortOrder"
              type="number"
              defaultValue={
                current?.sortOrder ?? 0
              }
              className={field}
            />
          </label>
        </div>

        <div className="mt-6">
          <MediaLibraryPicker
            name="photoMediaId"
            urlName="photoUrl"
            mode="single"
            folder="leadership"
            label="Photo"
            helperText="Select an existing image or upload a new leadership photo."
            initialItems={
              currentPhoto ? [currentPhoto] : []
            }
          />
        </div>

        <label className="mt-6 block">
          Bio
          <textarea
            name="bio"
            rows={5}
            defaultValue={current?.bio ?? ""}
            className={field}
          />
        </label>

        <label className="mt-5 flex gap-2 text-sm font-semibold">
          <input
            name="active"
            type="checkbox"
            defaultChecked={
              current?.active ?? true
            }
          />
          Active
        </label>

        <button className="mt-5 rounded-full bg-[#056839] px-5 py-3 text-sm font-bold text-white">
          Save member
        </button>
      </form>

      <section className="mt-8 overflow-x-auto rounded-[1.5rem] border border-[#e3e4dc] bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-[#f8f7f1] text-left">
            <tr>
              <th className="p-4">Photo</th>
              <th>Name</th>
              <th>Position</th>
              <th>Active</th>
              <th>Order</th>
              <th className="p-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr
                className="border-t"
                key={member.id}
              >
                <td className="p-4">
                  {member.photoMedia?.publicUrl ? (
                    <Image
                      src={member.photoMedia.publicUrl}
                      alt={
                        member.photoMedia.altText ||
                        member.name
                      }
                      width={56}
                      height={56}
                      unoptimized
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f8f7f1] text-xs text-[#66746c]">
                      No photo
                    </div>
                  )}
                </td>

                <td className="font-semibold">
                  {member.name}
                </td>

                <td>
                  {member.designation}
                </td>

                <td>
                  {member.active ? "Yes" : "No"}
                </td>

                <td>
                  {member.sortOrder}
                </td>

                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/leadership?edit=${member.id}`}
                      className="rounded-lg px-2.5 py-2 text-xs font-semibold text-[#056839] hover:bg-[#056839]/5"
                    >
                      Edit
                    </Link>

                    <form
                      action={deleteLeadership}
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={member.id}
                      />

                      <button
                        type="submit"
                        className="rounded-lg px-2.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
