/**
 * Remove Skin from Collection API Route
 * 
 * Removes a skin from user's collection.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

/**
 * POST /api/collection/remove
 * Removes skin from user's collection
 * 
 * @param req.body.skinId - UUID of skin to remove
 * @returns 200 OK (idempotent - succeeds even if not in collection)
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

  // Remove from collection (idempotent - no error if not exists)
  await prisma.collectionEntry.deleteMany({
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
