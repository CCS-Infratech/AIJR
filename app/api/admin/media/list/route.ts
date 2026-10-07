import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  await requireAdmin();

  try {
    const media = await prisma.mediaAsset.findMany({
      where: {
        mediaType: "IMAGE",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 500,
      select: {
        id: true,
        storageKey: true,
        publicUrl: true,
        mediaType: true,
        mimeType: true,
        fileSize: true,
        altText: true,
        caption: true,
        createdAt: true,
        _count: {
          select: {
            eventCovers: true,
            galleryItems: true,
            leadershipPhotos: true,
            thumbnails: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: media.map((item) => ({
          id: item.id,
          storageKey: item.storageKey,
          publicUrl: item.publicUrl,
          mediaType: item.mediaType,
          mimeType: item.mimeType,
          fileSize: item.fileSize,
          altText: item.altText,
          caption: item.caption,
          createdAt: item.createdAt,
          usage: {
            eventCovers: item._count.eventCovers,
            galleryItems: item._count.galleryItems,
            leadershipPhotos: item._count.leadershipPhotos,
            thumbnails: item._count.thumbnails,
          },
        })),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("AIJR media library failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load media library.",
      },
      { status: 500 }
    );
  }
}
