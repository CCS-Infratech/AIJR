import { prisma } from "@/lib/prisma";
import PublicGallery from "@/components/PublicGallery";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({
    where: {
      published: true,
    },
    include: {
      media: {
        select: {
          publicUrl: true,
          altText: true,
          caption: true,
          mediaType: true,
        },
      },
    },
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "asc" },
    ],
  });

  return (
    <PublicGallery
      items={items
        .filter((item) => item.media.publicUrl)
        .map((item) => ({
          id: item.id,
          url: item.media.publicUrl!,
          alt:
            item.media.altText ||
            item.title ||
            "AIJR community gallery image",
          type: item.media.mediaType,
          title: item.title,
          caption: item.caption || item.media.caption,
          category: item.category?.trim() || "Community",
        }))}
    />
  );
}
