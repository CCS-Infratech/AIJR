import Link from "next/link";
import { notFound } from "next/navigation";

import EventNewsForm from "@/components/admin/EventNewsForm";
import { prisma } from "@/lib/prisma";

type EditEventPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditEventPage({ params, searchParams }: EditEventPageProps) {
  const { id } = await params;
  const [{ error }, item, media] = await Promise.all([
    searchParams,
    prisma.eventNews.findUnique({ where: { id } }),
    prisma.mediaAsset.findMany({ select: { id: true, mediaType: true, altText: true, caption: true, publicUrl: true }, orderBy: { createdAt: "desc" } }),
  ]);

  if (!item) notFound();

  return (
    <>
      <Link href="/admin/events" className="text-sm font-semibold text-[#056839] hover:text-[#034d2a]">← Back to Events & News</Link>
      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#056839]">Edit content</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{item.title}</h1>
      </div>
      <div className="mt-8 max-w-4xl"><EventNewsForm item={item} media={media} error={error} /></div>
    </>
  );
}
