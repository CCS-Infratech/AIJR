import { prisma } from "@/lib/prisma";
import PublicEvents from "@/components/PublicEvents";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await prisma.eventNews.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [
      { sortOrder: "asc" },
      { eventStart: "asc" },
      { publishedAt: "desc" },
    ],
    include: {
      coverMedia: {
        select: {
          publicUrl: true,
          altText: true,
        },
      },
      galleryItems: {
        where: {
          published: true,
        },
        orderBy: [
          { sortOrder: "asc" },
          { createdAt: "asc" },
        ],
        include: {
          media: {
            select: {
              publicUrl: true,
              altText: true,
            },
          },
        },
      },
    },
  });

  return (
    <PublicEvents
      events={events.map((event) => {
        const fallbackGalleryImage = event.galleryItems.find(
          (item) => item.media.publicUrl
        );

        return {
          ...event,
          eventStart: event.eventStart?.toISOString() ?? null,
          coverUrl:
            event.coverMedia?.publicUrl ??
            fallbackGalleryImage?.media.publicUrl ??
            null,
          coverAlt:
            event.coverMedia?.altText ??
            fallbackGalleryImage?.media.altText ??
            event.title,
        };
      })}
    />
  );
}
