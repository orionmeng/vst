/**
 * Bulk Skin Retrieval API Route
 * 
 * Fetches multiple skins by their IDs.
 * Used for loadout displays where only image URLs are needed.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/skins/by-ids
 * Retrieves skins by array of IDs (returns only id and imageUrl)
 * 
 * @param req.body.ids - Array of skin UUID strings
 * @returns Array of skins with id and imageUrl fields
 */
export async function POST(req: Request) {
  const { ids } = await req.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json([]);
  }

  const skins = await prisma.skin.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      imageUrl: true,
    },
  });

  return NextResponse.json(skins);
}
