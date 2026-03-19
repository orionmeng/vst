import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
})
export async function PUT(
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

  const loadout = await prisma.loadout.findUnique({
    where: { id },
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

  await prisma.loadoutEntry.deleteMany({
    where: { loadoutId: id },
  });

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
