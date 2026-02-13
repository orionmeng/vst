/**
 * User Loadouts API Routes
 * 
 * Manages user's weapon loadout presets.
 * Each loadout contains skin assignments for multiple weapons.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/loadouts
 * Retrieves all loadouts for authenticated user
 * 
 * @returns Array of loadouts with nested skin entries
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const loadouts = await prisma.loadout.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      entries: {
        include: {
          skin: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(loadouts);
}

/**
 * POST /api/loadouts
 * Creates a new loadout for authenticated user
 * 
 * @param req.body.name - Loadout name (required, max 26 chars)
 * @param req.body.icon - Optional icon identifier
 * @param req.body.entries - Object mapping weapon names to skin IDs
 * @returns Created loadout with entries
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { name, icon, entries } = (await req.json()) as {
    name: string;
    icon?: string | null;
    entries: Record<string, string | null>;
  };

  // Validate loadout name
  if (!name.trim()) {
    return NextResponse.json(
      { error: "Loadout name is required" },
      { status: 400 }
    );
  }

  if (name.trim().length > 26) {
    return NextResponse.json(
      { error: "Loadout name must be 26 characters or less" },
      { status: 400 }
    );
  }

  // Enforce 8 loadout limit per user
  const loadoutCount = await prisma.loadout.count({
    where: {
      userId: session.user.id,
    },
  });

  if (loadoutCount >= 8) {
    return NextResponse.json(
      { error: "Maximum of 8 loadouts allowed per account" },
      { status: 400 }
    );
  }

  const loadout = await prisma.loadout.create({
    data: {
      userId: session.user.id,
      name: name.trim(),
      icon: icon ?? undefined,
      entries: {
        create: Object.entries(entries).map(([weapon, skinId]) => ({
          weapon,
          skinId,
        })),
      },
    },
    include: {
      entries: {
        include: {
          skin: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(loadout, { status: 201 });
}
