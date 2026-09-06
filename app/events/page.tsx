import { prisma } from "@/lib/prisma";
import PublicEvents from "@/components/PublicEvents";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await prisma.eventNews.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { eventStart: "asc" }, { publishedAt: "desc" }],
    include: { coverMedia: { select: { publicUrl: true, altText: true } } },
  });
  return <PublicEvents events={events.map((event) => ({ ...event, eventStart: event.eventStart?.toISOString() ?? null, coverUrl: event.coverMedia?.publicUrl ?? null, coverAlt: event.coverMedia?.altText ?? event.title }))} />;
}
