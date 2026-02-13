/**
 * Individual Loadout API Routes
 * 
 * Manages operations on a specific loadout (GET, DELETE, PUT).
 * All operations enforce ownership checks.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/loadouts/[id]
 * Retrieves a specific loadout with all entries
 * 
 * @param params.id - Loadout UUID
 * @returns Loadout object with nested skin entries
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const loadout = await prisma.loadout.findUnique({
      where: { id },
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

    if (!loadout) {
      return NextResponse.json(
        { error: "Loadout not found" },
        { status: 404 }
      );
    }

    if (loadout.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json(loadout);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/loadouts/[id]
 * Deletes a loadout and its entries
 * 
 * @param params.id - Loadout UUID
 * @returns Success confirmation
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify loadout exists
    const loadout = await prisma.loadout.findUnique({
      where: { id },
    });

    if (!loadout) {
      return NextResponse.json(
        { error: "Loadout not found" },
        { status: 404 }
      );
    }

    // Verify ownership to prevent unauthorized deletion
    if (loadout.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Delete entries first due to foreign key constraints
    await prisma.loadoutEntry.deleteMany({
      where: { loadoutId: id },
    });

    // Delete the loadout itself
    await prisma.loadout.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
/**
 * PUT /api/loadouts/[id]
 * Updates a loadout's name, icon, and weapon assignments
 * 
 * @param params.id - Loadout UUID
 * @param req.body.name - New loadout name (required, max 26 chars)
 * @param req.body.icon - New icon identifier
 * @param req.body.entries - New weapon -> skin ID mappings
 * @returns Updated loadout with entries
 */export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const { name, icon, entries } = (await req.json()) as {
    name: string;
    icon?: string | null;
    entries: Record<string, string | null>;
  };

  // Verify loadout exists
  const loadout = await prisma.loadout.findUnique({
    where: { id },
  });

  if (!loadout) {
    return NextResponse.json(
      { error: "Loadout not found" },
      { status: 404 }
    );
  }

  // Verify ownership
  if (loadout.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  // Validate new name
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

  // Delete existing entries
  await prisma.loadoutEntry.deleteMany({
    where: { loadoutId: id },
  });

  // Update loadout with new entries
  const updated = await prisma.loadout.update({
    where: { id },
    data: {
      name: name.trim(),
      ...(icon !== undefined && { icon: icon || null }),
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

  return NextResponse.json(updated);
}
