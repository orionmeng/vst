/**
 * Password Reset Completion API Route
 * 
 * Validates reset token and updates user password.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * POST /api/auth/reset-password
 * Completes password reset using token from email
 * 
 * @param req.body.token - Password reset token
 * @param req.body.password - New password (will be hashed)
 * @returns 200 OK on success, 400 for invalid/expired token
 */
export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Missing token or password" }, { status: 400 });
    }

    // Look up reset token
    const record = await prisma.passwordResetToken.findUnique({ where: { token } });

    // Validate token exists and hasn't expired
    if (!record || record.expires < new Date()) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Hash new password with bcrypt (10 salt rounds)
    const hashed = await bcrypt.hash(password, 10);

    // Update user's password
    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    });

    // Clean up used token
    await prisma.passwordResetToken.delete({ where: { id: record.id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
