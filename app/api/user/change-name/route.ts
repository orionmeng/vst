import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { newName } = await req.json();

    if (newName === undefined || newName === null) {
      return NextResponse.json(
        { error: "Display name is required" },
        { status: 400 }
      );
    }

    const trimmedName = newName.trim();
    if (trimmedName.length === 0) {
      return NextResponse.json(
        { error: "Display name cannot be empty" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: trimmedName },
    });

    return NextResponse.json({
      message: "Display name updated successfully",
      name: updatedUser.name,
    });
  } catch (error) {
    console.error("Change name error:", error);
    return NextResponse.json(
      { error: "Failed to change display name" },
      { status: 500 }
    );
  }
}
