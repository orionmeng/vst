import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  const wishlistEntries = await prisma.wishlistEntry.findMany({
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

  const skins = wishlistEntries.map((entry) => entry.skin);

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

  await prisma.wishlistEntry.create({
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

  await prisma.wishlistEntry.delete({
    where: {
      userId_skinId: {
        userId: session.user.id,
        skinId,
      },
    },
  });

  return NextResponse.json({ success: true });
}
