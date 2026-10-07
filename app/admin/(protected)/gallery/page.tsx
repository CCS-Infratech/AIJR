import Link from "next/link";
import { Images, Pencil, Trash2 } from "lucide-react";
import { deleteGallery, saveGallery } from "@/lib/admin-content-actions";
import { prisma } from "@/lib/prisma";
import MediaUploadField from "./MediaUploadField";

export default async function GalleryAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; error?: string }>;
}) {
  const { edit, error } = await searchParams;

  const [items, events, current] = await Promise.all([
    prisma.galleryItem.findMany({
      include: { media: true, eventNews: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.eventNews.findMany({
      select: { id: true, title: true },
    }),
    edit
      ? prisma.galleryItem.findUnique({
          where: { id: edit },
          include: { media: true },
        })
      : null,
  ]);

  const field =
    "mt-1 w-full rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-3 py-2.5 text-sm";

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.28em] text-[#056839]">
            Content management
          </p>
          <h1 className="mt-3 text-3xl font-bold">Gallery / Media</h1>
        </div>

        {current && (
          <Link
            href="/admin/gallery"
            className="text-sm font-semibold text-[#056839]"
          >
            Cancel edit
          </Link>
        )}
      </div>

      {error && (
        <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          Enter a valid media URL and required values.
        </p>
      )}

      <form
        action={saveGallery}
        className="mt-7 rounded-[1.5rem] border border-[#e3e4dc] bg-white p-5 sm:p-7"
      >
        {current && (
          <input type="hidden" name="id" value={current.id} />
        )}

        <h2 className="text-lg font-semibold">
          {current ? "Edit gallery item" : "Add gallery item"}
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <MediaUploadField
            initialUrl={current?.media.publicUrl ?? ""}
            initialMediaId={current?.media.id ?? ""}
          />

          <label>
            Media type
            <select
              name="mediaType"
              defaultValue={current?.media.mediaType ?? "IMAGE"}
              className={field}
            >
              <option>IMAGE</option>
              <option>VIDEO</option>
            </select>
          </label>

          <label>
            Title
            <input
              name="title"
              defaultValue={current?.title ?? ""}
              className={field}
            />
          </label>

          <label>
            Category
            <input
              name="category"
              defaultValue={current?.category ?? ""}
              className={field}
            />
          </label>

          <label>
            Display order
            <input
              name="sortOrder"
              type="number"
              defaultValue={current?.sortOrder ?? 0}
              className={field}
            />
          </label>

          <label>
            Associated Event / News
            <select
              name="eventNewsId"
              defaultValue={current?.eventNewsId ?? ""}
              className={field}
            >
              <option value="">None</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-4 block">
          Caption
          <textarea
            name="caption"
            defaultValue={current?.caption ?? ""}
            className={field}
          />
        </label>

        <label className="mt-4 flex gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            name="published"
            defaultChecked={current?.published ?? false}
          />
          Published
        </label>

        <button className="mt-5 rounded-full bg-[#056839] px-5 py-3 text-sm font-bold text-white">
          {current ? "Save changes" : "Add item"}
        </button>
      </form>

      <section className="mt-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#056839]">
              Current media
            </p>
            <h2 className="mt-2 text-2xl font-bold">Gallery Images</h2>
            <p className="mt-1 text-sm text-[#66746c]">
              {items.length}{" "}
              {items.length === 1 ? "gallery item" : "gallery items"}
              {" "}currently configured.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-[#f8f7f1] px-4 py-2 text-xs font-semibold text-[#66746c] sm:flex">
            <Images size={15} className="text-[#056839]" />
            {items.length} images
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#dfe1d8] bg-white px-6 py-16 text-center">
            <Images size={34} className="mx-auto text-[#056839]" />
            <h3 className="mt-4 text-lg font-semibold">
              No gallery images yet
            </h3>
            <p className="mt-2 text-sm text-[#66746c]">
              Upload or select an image above to start building the gallery.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[1.25rem] border border-[#e3e4dc] bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f8f7f1]">
                  {item.media.publicUrl ? (
                    <img
                      src={item.media.publicUrl}
                      alt={
                        item.media.altText ||
                        item.title ||
                        "Gallery image"
                      }
                      className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#66746c]">
                      No preview available
                    </div>
                  )}

                  <div className="absolute left-3 top-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        item.published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-white/90 text-[#66746c]"
                      }`}
                    >
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="truncate font-semibold text-[#15231c]">
                    {item.title || "Untitled gallery image"}
                  </h3>

                  <div className="mt-2 space-y-1 text-xs text-[#66746c]">
                    <p>
                      Type:{" "}
                      <span className="font-semibold">
                        {item.media.mediaType}
                      </span>
                    </p>

                    <p>
                      Order:{" "}
                      <span className="font-semibold">
                        {item.sortOrder}
                      </span>
                    </p>

                    <p className="truncate">
                      Event:{" "}
                      <span className="font-semibold">
                        {item.eventNews?.title || "Not assigned"}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#e3e4dc] pt-3">
                    <Link
                      href={`/admin/gallery?edit=${item.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-[#056839] transition hover:bg-[#056839]/5"
                    >
                      <Pencil size={14} />
                      Edit
                    </Link>

                    <form action={deleteGallery}>
                      <input
                        type="hidden"
                        name="id"
                        value={item.id}
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
