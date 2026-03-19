import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const skins = await prisma.skin.findMany({
    where: {
      OR: [
        {
          name: {
            startsWith: "Standard",
          },
        },
        {
          name: "Melee",
        },
      ],
    },
    select: {
      id: true,
      weapon: true,
      imageUrl: true,
    },
  });

  const map: Record<string, string | null> = {};
  for (const skin of skins) {
    map[skin.weapon] = skin.imageUrl;
  }

  return NextResponse.json(map);
}
