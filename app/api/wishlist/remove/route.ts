/**
 * Remove Skin from Wishlist API Route
 * 
 * Removes a skin from user's wishlist.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * POST /api/wishlist/remove
 * Removes skin from user's wishlist
 * 
 * @param req.body.skinId - UUID of skin to remove
 * @returns 200 OK (idempotent - succeeds even if not in wishlist)
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

  // Remove from wishlist (idempotent - no error if not exists)
  await prisma.wishlistEntry.deleteMany({
    where: {
      userId: session.user.id,
      skinId,
    },
  });

  // Revalidate affected pages
  revalidatePath("/collection");
  revalidatePath(`/skins/${skinId}`);

  return NextResponse.json({ ok: true });
}
