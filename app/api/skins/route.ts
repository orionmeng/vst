/**
 * Skins Catalog API Route
 * 
 * Retrieves skins with filtering, search, and pagination.
 * For authenticated users, includes collection/wishlist status.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * GET /api/skins
 * Retrieves paginated skins with optional filtering
 * 
 * @param searchParams.weapon - Filter by weapon type
 * @param searchParams.search - Search by skin name (case-insensitive)
 * @param searchParams.page - Page number (default: 1)
 * @param searchParams.limit - Items per page (default: 20)
 * @returns Array of skins with collection/wishlist flags if authenticated
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const weapon = searchParams.get("weapon");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const session = await getServerSession(authOptions);

  const skip = (page - 1) * limit;

  // Fetch skins with filters
  const skins = await prisma.skin.findMany({
    where: {
      AND: [
        weapon ? { weapon } : {},
        search ? { name: { contains: search, mode: "insensitive" } } : {},
      ],
    },
    select: {
      id: true,
      name: true,
      weapon: true,
      imageUrl: true,
    },
    orderBy: { name: "asc" },
    skip,
    take: limit,
  });

  // Enrich skins with user-specific collection/wishlist data
  if (session?.user?.id) {
    const enrichedSkins = await Promise.all(
      skins.map(async (skin) => {
        const inCollection = await prisma.collectionEntry.findUnique({
          where: {
            userId_skinId: {
              userId: session.user.id,
              skinId: skin.id,
            },
          },
        });

        const inWishlist = await prisma.wishlistEntry.findUnique({
          where: {
            userId_skinId: {
              userId: session.user.id,
              skinId: skin.id,
            },
          },
        });

        return {
          ...skin,
          inCollection: !!inCollection,
          inWishlist: !!inWishlist,
        };
      })
    );

    return NextResponse.json(enrichedSkins);
  }

  // Return skins without collection/wishlist info if not authenticated
  return NextResponse.json(
    skins.map((skin) => ({
      ...skin,
      inCollection: false,
      inWishlist: false,
    }))
  );
}
