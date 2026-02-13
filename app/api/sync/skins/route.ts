/**
 * Skin Sync API Endpoint
 * 
 * Automatically syncs skins from Valorant API to database.
 * Protected by CRON_SECRET environment variable.
 * 
 * POST /api/sync/skins
 */

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type WeaponResponse = {
  data: {
    displayName: string;
    skins: {
      uuid: string;
    }[];
  }[];
};

type SkinResponse = {
  data: {
    uuid: string;
    displayName: string;
    contentTierUuid: string | null;
    chromas: {
      uuid: string;
      fullRender: string | null;
      swatch: string | null;
    }[];
    levels: {
      streamedVideo: string | null;
    }[];
  }[];
};

export async function POST(req: NextRequest) {
  try {
    // Verify authorization
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("CRON_SECRET not configured");
      return NextResponse.json(
        { error: "Cron job not configured" },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const startTime = Date.now();
    console.log("Starting skin sync...");

    // Fetch weapons to build skin-to-weapon mapping
    const weaponsRes = await fetch("https://valorant-api.com/v1/weapons");
    if (!weaponsRes.ok) {
      throw new Error(`Failed to fetch weapons: ${weaponsRes.statusText}`);
    }

    const weaponsJson = (await weaponsRes.json()) as WeaponResponse;
    const skinToWeapon = new Map<string, string>();

    for (const weapon of weaponsJson.data) {
      for (const skin of weapon.skins) {
        skinToWeapon.set(skin.uuid, weapon.displayName);
      }
    }

    // Fetch all skins
    const skinsRes = await fetch("https://valorant-api.com/v1/weapons/skins");
    if (!skinsRes.ok) {
      throw new Error(`Failed to fetch skins: ${skinsRes.statusText}`);
    }

    const skinsJson = (await skinsRes.json()) as SkinResponse;

    let newCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const skin of skinsJson.data) {
      // Skip invalid skins
      if (!skin.displayName || !skin.chromas.length) {
        skippedCount++;
        continue;
      }

      const weapon = skinToWeapon.get(skin.uuid);
      if (!weapon) {
        skippedCount++;
        continue;
      }

      const imageUrl = skin.chromas.find((c) => c.fullRender)?.fullRender ?? null;
      if (!imageUrl) {
        skippedCount++;
        continue;
      }

      // Check if skin exists
      const existingSkin = await prisma.skin.findUnique({
        where: { id: skin.uuid },
      });

      await prisma.skin.upsert({
        where: { id: skin.uuid },
        update: {
          name: skin.displayName,
          weapon,
          tier: skin.contentTierUuid ?? "Unknown",
          imageUrl,
          chromas: skin.chromas as unknown as Prisma.InputJsonValue,
          levels: skin.levels as unknown as Prisma.InputJsonValue,
          videoUrl: skin.levels[0]?.streamedVideo ?? null,
        },
        create: {
          id: skin.uuid,
          name: skin.displayName,
          weapon,
          tier: skin.contentTierUuid ?? "Unknown",
          cost: 0,
          imageUrl,
          chromas: skin.chromas as unknown as Prisma.InputJsonValue,
          levels: skin.levels as unknown as Prisma.InputJsonValue,
          videoUrl: skin.levels[0]?.streamedVideo ?? null,
        },
      });

      if (existingSkin) {
        updatedCount++;
      } else {
        newCount++;
      }
    }

    const duration = Date.now() - startTime;

    const result = {
      success: true,
      stats: {
        new: newCount,
        updated: updatedCount,
        skipped: skippedCount,
        total: newCount + updatedCount,
        duration: `${duration}ms`,
      },
      timestamp: new Date().toISOString(),
    };

    console.log("Skin sync completed:", result.stats);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Skin sync failed:", error);
    return NextResponse.json(
      {
        error: "Sync failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
