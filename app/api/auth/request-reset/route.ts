import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    // Always return success even if user doesn't exist (prevents enumeration attacks)
    if (!user) {
      return NextResponse.json({ ok: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiry

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    });

    const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER as string);

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset?token=${token}`;

    const info = await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_FROM,
      subject: "Reset your password",
      text: `Reset your password: ${resetUrl}`,
      html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
