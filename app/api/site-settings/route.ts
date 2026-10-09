import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  DEFAULT_SITE_SETTINGS,
  isSiteSettingKey,
  type PublicSiteSettings,
} from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings: PublicSiteSettings = {
    ...DEFAULT_SITE_SETTINGS,
  };

  try {
    const rows = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: Object.keys(DEFAULT_SITE_SETTINGS),
        },
      },
      select: {
        key: true,
        value: true,
      },
    });

    for (const row of rows) {
      if (isSiteSettingKey(row.key) && typeof row.value === "string") {
        settings[row.key] = row.value;
      }
    }
  } catch {
    // Keep the public site usable with its known-safe defaults.
  }

  return NextResponse.json(
    {
      success: true,
      data: settings,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
