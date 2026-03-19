import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
