/**
 * Add Skin to Collection API Route
 * 
 * Adds a skin to user's collection and removes it from wishlist
 * if it exists there (enforces mutual exclusivity).
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * POST /api/collection/add
 * Adds skin to collection and removes from wishlist
 * 
 * @param req.body.skinId - UUID of skin to add
 * @returns 200 OK on success (even if already exists)
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { skinId } = await req.json();

  if (!skinId) {
    return NextResponse.json({ error: "Missing skinId" }, { status: 400 });
  }

  try {
    // Enforce mutual exclusivity: remove from wishlist if present
    await prisma.wishlistEntry.deleteMany({
      where: {
        userId: session.user.id,
        skinId,
      },
    });

    // Add to collection
    await prisma.collectionEntry.create({
      data: {
        userId: session.user.id,
        skinId,
      },
    });

    // Revalidate affected pages
    revalidatePath("/collection");
    revalidatePath("/wishlist");
    revalidatePath(`/skins/${skinId}`);

    return NextResponse.json({ ok: true });
  } catch {
    // Return success even on duplicate key errors (idempotent)
    return NextResponse.json({ ok: true });
  }
}
