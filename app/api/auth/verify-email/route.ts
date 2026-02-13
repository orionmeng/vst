/**
 * Email Verification API Route
 * 
 * Validates email verification token and marks user account as verified.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/verify-email
 * Verifies user email address using token from email link
 * 
 * @param req.body.token - Verification token from email
 * @returns 200 OK on success, 400 for invalid/expired token
 */
export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 400 }
      );
    }

    // Look up verification token
    const record = await prisma.verificationToken.findUnique({
      where: { token },
    });

    // Validate token exists and hasn't expired
    if (!record || record.expires < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    });

    // Clean up used token
    await prisma.verificationToken.delete({
      where: { id: record.id },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("VERIFY EMAIL ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
