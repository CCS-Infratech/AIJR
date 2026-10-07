import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { notFound } from "next/navigation";

import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await prisma.eventNews.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
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
              caption: true,
            },
          },
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const galleryImages = event.galleryItems.filter(
    (item) => item.media.publicUrl
  );

  return (
    <>
      <Navbar />

      <main className="bg-[#f8f7f1] text-[#15231c]">
        <section className="bg-[#056839] text-white">
          <div className="container py-20 pt-32 sm:py-28 sm:pt-36">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#ead493]"
            >
              <ArrowLeft size={16} />
              Back to Events
            </Link>

            <p className="mt-10 text-xs font-bold uppercase tracking-[.28em] text-[#ead493]">
              {event.category || event.type}
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
              {event.title}
            </h1>

            {event.excerpt && (
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
                {event.excerpt}
              </p>
            )}
          </div>
        </section>

        <section>
          <div className="container py-12 sm:py-20">
            {event.coverMedia?.publicUrl && (
              <div className="overflow-hidden rounded-[2rem] bg-[#034d2a]">
                <img
                  src={event.coverMedia.publicUrl}
                  alt={event.coverMedia.altText || event.title}
                  className="max-h-[620px] w-full object-cover"
                />
              </div>
            )}

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
              <article className="rounded-[2rem] border border-[#e3e4dc] bg-white p-6 sm:p-8">
                <h2 className="text-2xl font-semibold">About this event</h2>

                <div className="mt-6 whitespace-pre-line text-sm leading-8 text-[#66746c]">
                  {event.body}
                </div>
              </article>

              <aside className="h-fit rounded-[2rem] border border-[#e3e4dc] bg-white p-6">
                <h2 className="text-lg font-semibold">Event details</h2>

                {event.eventStart && (
                  <div className="mt-5 flex gap-3 text-sm">
                    <CalendarDays
                      size={18}
                      className="mt-0.5 shrink-0 text-[#056839]"
                    />
                    <div>
                      <p className="font-semibold">Date</p>
                      <p className="mt-1 text-[#66746c]">
                        {formatDate(event.eventStart)}
                      </p>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="mt-5 flex gap-3 text-sm">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-[#056839]"
                    />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="mt-1 text-[#66746c]">
                        {event.location}
                      </p>
                    </div>
                  </div>
                )}
              </aside>
            </div>

            {galleryImages.length > 0 && (
              <section className="mt-14">
                <h2 className="text-2xl font-semibold">
                  Event gallery
                </h2>

                <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {galleryImages.map((item) => (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-[1.5rem] bg-[#034d2a]"
                    >
                      <img
                        src={item.media.publicUrl!}
                        alt={
                          item.media.altText ||
                          item.title ||
                          event.title
                        }
                        className="aspect-square h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <Link
              href="/events"
              className="mt-12 inline-flex items-center gap-2 text-sm font-bold text-[#056839]"
            >
              <ArrowLeft size={16} />
              Back to Events
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#034d2a] text-white">
        <div className="container py-10 text-xs text-white/35">
          © {new Date().getFullYear()} All India Jamat Rayeen. All rights reserved.
        </div>
      </footer>
    </>
  );
}
