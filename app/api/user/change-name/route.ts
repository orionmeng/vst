/**
 * Change Display Name API Route
 * 
 * Allows authenticated users to change their display name
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

    // Validate input
    if (newName === undefined || newName === null) {
      return NextResponse.json(
        { error: "Display name is required" },
        { status: 400 }
      );
    }

    // Validate name is not empty or just whitespace
    const trimmedName = newName.trim();
    if (trimmedName.length === 0) {
      return NextResponse.json(
        { error: "Display name cannot be empty" },
        { status: 400 }
      );
    }

    console.log("Updating display name for user:", session.user.id);
    console.log("New name:", trimmedName);

    // Update display name
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: trimmedName },
    });

    console.log("Display name updated successfully:", updatedUser.name);

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
