/**
 * Standard Skins API Route
 * 
 * Retrieves default/standard skins for each weapon.
 * Used to populate loadouts with default weapon skins.
 */

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Force dynamic rendering for API route
export const dynamic = 'force-dynamic';

/**
 * GET /api/skins/standard
 * Retrieves default skin for each weapon type
 * 
 * @returns Object mapping weapon names to standard skin image URLs
 */
export async function GET() {
  // Query for Standard and Melee skins
  const skins = await prisma.skin.findMany({
    where: {
      OR: [
        {
          name: {
            startsWith: "Standard",
          },
        },
        {
          name: "Melee",
        },
      ],
    },
    select: {
      id: true,
      weapon: true,
      imageUrl: true,
    },
  });

  // Build weapon -> imageUrl map
  const map: Record<string, string | null> = {};
  for (const skin of skins) {
    map[skin.weapon] = skin.imageUrl;
  }

  return NextResponse.json(map);
}
