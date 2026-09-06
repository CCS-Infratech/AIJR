"use server";

import { EventNewsType, Prisma, PublicationStatus } from "@prisma/client";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalTextValue(formData: FormData, key: string) {
  const value = textValue(formData, key);
  return value || null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseDate(value: string) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function errorRedirect(id: string | null, message: string) {
  const path = id ? `/admin/events/${id}/edit` : "/admin/events/new";
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function saveEventNews(formData: FormData) {
  await requireAdmin();

  const id = optionalTextValue(formData, "id");
  const title = textValue(formData, "title");
  const slug = slugify(textValue(formData, "slug") || title);
  const body = textValue(formData, "body");
  const typeValue = textValue(formData, "type");
  const intent = textValue(formData, "intent");
  const eventStart = parseDate(textValue(formData, "eventStart"));
  const eventEnd = parseDate(textValue(formData, "eventEnd"));
  const publishedAtInput = parseDate(textValue(formData, "publishedAt"));
  const sortOrderValue = textValue(formData, "sortOrder");
  const sortOrder = Number(sortOrderValue || 0);
  const coverMediaId = optionalTextValue(formData, "coverMediaId");

  if (!title || !slug || !body) {
    errorRedirect(id, "Title, slug, and description are required.");
  }

  if (typeValue !== EventNewsType.EVENT && typeValue !== EventNewsType.NEWS) {
    errorRedirect(id, "Please select a valid content type.");
  }

  const type = typeValue as EventNewsType;

  if (eventStart === undefined || eventEnd === undefined || publishedAtInput === undefined) {
    errorRedirect(id, "One or more dates are invalid.");
  }

  if (!Number.isInteger(sortOrder)) {
    errorRedirect(id, "Display order must be a whole number.");
  }

  const existing = id
    ? await prisma.eventNews.findUnique({ where: { id }, select: { id: true, publishedAt: true } })
    : null;

  if (id && !existing) {
    redirect("/admin/events?error=not-found");
  }

  if (coverMediaId) {
    const media = await prisma.mediaAsset.findUnique({
      where: { id: coverMediaId },
      select: { id: true },
    });

    if (!media) errorRedirect(id, "The selected cover media is no longer available.");
  }

  const status = intent === "publish" ? PublicationStatus.PUBLISHED : PublicationStatus.DRAFT;
  const publishedAt = status === PublicationStatus.PUBLISHED
    ? publishedAtInput ?? existing?.publishedAt ?? new Date()
    : null;

  const data = {
    type,
    title,
    slug,
    excerpt: optionalTextValue(formData, "excerpt"),
    body,
    category: optionalTextValue(formData, "category"),
    coverMediaId,
    eventStart: eventStart ?? null,
    eventEnd: eventEnd ?? null,
    location: optionalTextValue(formData, "location"),
    externalUrl: optionalTextValue(formData, "externalUrl"),
    featured: formData.get("featured") === "on",
    status,
    publishedAt,
    sortOrder,
  } satisfies Prisma.EventNewsUncheckedCreateInput;

  try {
    if (existing) {
      await prisma.eventNews.update({ where: { id: existing.id }, data });
    } else {
      await prisma.eventNews.create({ data });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      errorRedirect(id, "That slug is already in use. Please choose a different one.");
    }

    errorRedirect(id, "Unable to save this item. Please try again.");
  }

  redirect("/admin/events?saved=1");
}

export async function changeEventNewsStatus(formData: FormData) {
  await requireAdmin();

  const id = textValue(formData, "id");
  const statusValue = textValue(formData, "status");

  if (!id || (statusValue !== PublicationStatus.DRAFT && statusValue !== PublicationStatus.PUBLISHED)) {
    redirect("/admin/events?error=invalid");
  }

  const existing = await prisma.eventNews.findUnique({
    where: { id },
    select: { publishedAt: true },
  });

  if (!existing) redirect("/admin/events?error=not-found");

  await prisma.eventNews.update({
    where: { id },
    data: {
      status: statusValue,
      publishedAt: statusValue === PublicationStatus.PUBLISHED ? existing.publishedAt ?? new Date() : null,
    },
  });

  redirect("/admin/events?saved=1");
}

export async function deleteEventNews(formData: FormData) {
  await requireAdmin();

  const id = textValue(formData, "id");
  if (!id) redirect("/admin/events?error=invalid");

  try {
    await prisma.eventNews.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      redirect("/admin/events?error=not-found");
    }

    redirect("/admin/events?error=delete-failed");
  }

  redirect("/admin/events?deleted=1");
}
