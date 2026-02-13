/**
 * Change Email API Route
 * 
 * Allows authenticated users to change their email address
 * Requires email verification after change
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidEmail } from "@/lib/validation";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { newEmail, password } = await req.json();

    // Validate input
    if (!newEmail || !password) {
      return NextResponse.json(
        { error: "New email and password are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(newEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "User not found or no password set" },
        { status: 404 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Check if new email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser && existingUser.id !== user.id) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    // Update email and reset email verification
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: newEmail,
        emailVerified: null, // Require re-verification
      },
    });

    return NextResponse.json({
      message: "Email updated successfully. Please verify your new email address.",
    });
  } catch (error) {
    console.error("Change email error:", error);
    return NextResponse.json(
      { error: "Failed to change email" },
      { status: 500 }
    );
  }
}
