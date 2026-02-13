/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Resend Verification Email API Route
 * 
 * Generates new verification token and resends verification email.
 * Only sends if user exists and email is not already verified.
 * Always returns success to prevent user enumeration.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { createTestMailer } from "@/lib/mailer";

/**
 * POST /api/auth/resend-verification
 * Resends verification email for unverified accounts
 * 
 * @param req.body.email - User's email or username
 * @returns 200 OK always (to prevent user enumeration)
 */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ ok: true });
    }

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username: email }],
      },
    });

    // Always return success to prevent user enumeration attacks
    // Don't send if user doesn't exist or is already verified
    if (!user || user.emailVerified) {
      return NextResponse.json({ ok: true });
    }

    // Clean up any existing verification tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate new secure random verification token (256 bits)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiry

    await prisma.verificationToken.create({
      data: {
        token,
        userId: user.id,
        expires,
      },
    });

    const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;

    const { transporter } = await createTestMailer();

    const info = await transporter.sendMail({
      to: user.email,
      from: "Valorant Skins <no-reply@valorantskins.dev>",
      subject: "Verify your Valorant Skin Tracker account",
      html: `
        <p>Hey ${user.name ?? user.username},</p>
        <p>Click the link below to verify your email:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      `,
      text: `Verify your account: ${verifyUrl}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("RESEND VERIFICATION ERROR:", err);
    return NextResponse.json({ ok: true });
  }
}
