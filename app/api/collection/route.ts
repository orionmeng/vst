/**
 * User Collection API Routes
 * 
 * Manages user's owned skin collection.
 * Supports filtering, search, and pagination.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/collection
 * Retrieves user's skin collection with optional filtering
 * 
 * @param searchParams.weapon - Filter by weapon type
 * @param searchParams.search - Search by skin name (case-insensitive)
 * @param searchParams.page - Page number (default: 1)
 * @param searchParams.limit - Items per page (default: 20)
 * @returns Array of skins in user's collection
 */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const weapon = searchParams.get("weapon") || undefined;
  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const skip = (page - 1) * limit;

  // Query collection entries with filters and pagination
  const collectionEntries = await prisma.collectionEntry.findMany({
    where: {
      userId: session.user.id,
      skin: {
        AND: [
          weapon ? { weapon } : {},
          search ? { name: { contains: search, mode: "insensitive" } } : {},
        ],
      },
    },
    include: {
      skin: true,
    },
    orderBy: { skin: { name: "asc" } },
    skip,
    take: limit,
  });

  const skins = collectionEntries.map((entry) => entry.skin);

  return NextResponse.json(skins);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { skinId } = (await req.json()) as { skinId: string };

  await prisma.collectionEntry.create({
    data: {
      userId: session.user.id,
      skinId,
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { skinId } = (await req.json()) as { skinId: string };

  await prisma.collectionEntry.delete({
    where: {
      userId_skinId: {
        userId: session.user.id,
        skinId,
      },
    },
  });

  return NextResponse.json({ success: true });
}
