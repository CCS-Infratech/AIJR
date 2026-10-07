import Link from "next/link";
import { notFound } from "next/navigation";

import EventNewsForm from "@/components/admin/EventNewsForm";
import { prisma } from "@/lib/prisma";

type EditEventPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditEventPage({
  params,
  searchParams,
}: EditEventPageProps) {
  const { id } = await params;
  const [{ error }, item] = await Promise.all([
    searchParams,
    prisma.eventNews.findUnique({
      where: { id },
      include: {
        coverMedia: true,
        galleryItems: {
          include: {
            media: true,
          },
          orderBy: [
            { sortOrder: "asc" },
            { createdAt: "asc" },
          ],
        },
      },
    }),
  ]);

  if (!item) {
    notFound();
  }

  const coverMedia = item.coverMedia
    ? {
        id: item.coverMedia.id,
        storageKey: item.coverMedia.storageKey,
        publicUrl: item.coverMedia.publicUrl || "",
        mediaType: item.coverMedia.mediaType,
        mimeType: item.coverMedia.mimeType,
        fileSize: item.coverMedia.fileSize,
        altText: item.coverMedia.altText,
        caption: item.coverMedia.caption,
        createdAt: item.coverMedia.createdAt.toISOString(),
      }
    : null;

  const galleryMedia = item.galleryItems
    .filter((galleryItem) => galleryItem.media.publicUrl)
    .map((galleryItem) => ({
      id: galleryItem.media.id,
      storageKey: galleryItem.media.storageKey,
      publicUrl: galleryItem.media.publicUrl!,
      mediaType: galleryItem.media.mediaType,
      mimeType: galleryItem.media.mimeType,
      fileSize: galleryItem.media.fileSize,
      altText: galleryItem.media.altText,
      caption: galleryItem.media.caption,
      createdAt: galleryItem.media.createdAt.toISOString(),
    }));

  return (
    <>
      <Link
        href="/admin/events"
        className="text-sm font-semibold text-[#056839] hover:text-[#034d2a]"
      >
        ← Back to Events & News
      </Link>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#056839]">
          Edit content
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {item.title}
        </h1>
      </div>

      <div className="mt-8 max-w-5xl">
        <EventNewsForm
          item={item}
          error={error}
          coverMedia={coverMedia}
          galleryMedia={galleryMedia}
        />
      </div>
    </>
  );
}
