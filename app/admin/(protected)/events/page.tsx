import Link from "next/link";
import { CalendarDays, Pencil, Plus } from "lucide-react";

import EventDeleteButton from "@/components/admin/EventDeleteButton";
import { changeEventNewsStatus } from "@/lib/event-news-actions";
import { prisma } from "@/lib/prisma";

type EventsPageProps = {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
};

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const [{ saved, deleted, error }, events] = await Promise.all([
    searchParams,
    prisma.eventNews.findMany({ orderBy: [{ updatedAt: "desc" }], take: 100 }),
  ]);

  const message = saved ? "Changes saved successfully." : deleted ? "Item deleted successfully." : null;
  const errorMessage = error === "not-found" ? "That item could not be found." : error === "delete-failed" ? "This item could not be deleted." : error === "invalid" ? "The requested action was invalid." : null;

  return (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#056839]">Content management</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Events & News</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#66746c]">Create and manage draft or published AIJR events and news. Public pages are not connected to these records yet.</p>
        </div>
        <Link href="/admin/events/new" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#056839] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#034d2a]">
          <Plus size={17} />
          Add Event / News
        </Link>
      </div>

      {message && <p className="mt-7 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}
      {errorMessage && <p className="mt-7 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}

      <section className="mt-8 overflow-hidden rounded-[1.5rem] border border-[#e3e4dc] bg-white">
        {events.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <CalendarDays className="mx-auto text-[#056839]" size={28} />
            <h2 className="mt-4 text-xl font-semibold">No events or news yet.</h2>
            <p className="mt-2 text-sm text-[#66746c]">Create the first item to begin building the CMS content library.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-[#f8f7f1] text-xs uppercase tracking-[0.12em] text-[#66746c]">
                <tr>
                  <th className="px-6 py-4 font-bold">Title</th>
                  <th className="px-4 py-4 font-bold">Type</th>
                  <th className="px-4 py-4 font-bold">Status</th>
                  <th className="px-4 py-4 font-bold">Event date</th>
                  <th className="px-4 py-4 font-bold">Location</th>
                  <th className="px-4 py-4 font-bold">Updated</th>
                  <th className="px-6 py-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e4dc]">
                {events.map((event) => (
                  <tr key={event.id} className="align-top">
                    <td className="max-w-xs px-6 py-5">
                      <p className="font-semibold text-[#15231c]">{event.title}</p>
                      <p className="mt-1 truncate text-xs text-[#66746c]">/{event.slug}</p>
                    </td>
                    <td className="px-4 py-5"><span className="rounded-full bg-[#056839]/8 px-2.5 py-1 text-xs font-semibold text-[#056839]">{event.type}</span></td>
                    <td className="px-4 py-5"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${event.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{event.status}</span></td>
                    <td className="px-4 py-5 text-[#66746c]">{formatDate(event.eventStart)}</td>
                    <td className="max-w-40 truncate px-4 py-5 text-[#66746c]">{event.location || "—"}</td>
                    <td className="px-4 py-5 text-[#66746c]">{formatDate(event.updatedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/events/${event.id}/edit`} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-[#056839] transition hover:bg-[#056839]/5"><Pencil size={14} />Edit</Link>
                        <form action={changeEventNewsStatus}>
                          <input type="hidden" name="id" value={event.id} />
                          <input type="hidden" name="status" value={event.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"} />
                          <button type="submit" className="rounded-lg px-2.5 py-2 text-xs font-semibold text-[#66746c] transition hover:bg-[#f8f7f1]">{event.status === "PUBLISHED" ? "Unpublish" : "Publish"}</button>
                        </form>
                        <EventDeleteButton id={event.id} title={event.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
