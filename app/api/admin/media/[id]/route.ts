import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Media ID is required." },
      { status: 400 }
    );
  }

  try {
    const media = await prisma.mediaAsset.findUnique({
      where: { id },
      select: {
        id: true,
        storageKey: true,
        publicUrl: true,
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

    if (!media) {
      return NextResponse.json(
        { success: false, error: "Media not found." },
        { status: 404 }
      );
    }

    const usage = media._count;

    if (
      usage.eventCovers > 0 ||
      usage.galleryItems > 0 ||
      usage.leadershipPhotos > 0 ||
      usage.thumbnails > 0
    ) {
      const usedIn = [];

      if (usage.eventCovers > 0) {
        usedIn.push(`event cover (${usage.eventCovers})`);
      }

      if (usage.galleryItems > 0) {
        usedIn.push(`gallery item (${usage.galleryItems})`);
      }

      if (usage.leadershipPhotos > 0) {
        usedIn.push(`leadership photo (${usage.leadershipPhotos})`);
      }

      if (usage.thumbnails > 0) {
        usedIn.push(`thumbnail (${usage.thumbnails})`);
      }

      return NextResponse.json(
        {
          success: false,
          error: `This image is currently used by ${usedIn.join(", ")}. Remove those references first.`,
        },
        { status: 409 }
      );
    }

    if (media.storageKey.startsWith("aijr/")) {
      const bucket = process.env.AWS_S3_BUCKET;
      const region = process.env.AWS_REGION;

      if (!bucket || !region) {
        throw new Error("AWS S3 configuration is missing.");
      }

      const s3 = new S3Client({ region });

      await s3.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: media.storageKey,
        })
      );
    }

    await prisma.mediaAsset.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Media deleted successfully.",
    });
  } catch (error) {
    console.error("AIJR media deletion failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete media.",
      },
      { status: 500 }
    );
  }
}
