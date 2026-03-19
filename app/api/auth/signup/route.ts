import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { createTestMailer } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email, password, name, username } = await req.json();

    if (!email || !password || !username || !name) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (email.trim().length === 0) {
      return NextResponse.json({ error: "Email cannot be empty" }, { status: 400 });
    }

    if (name.trim().length === 0) {
      return NextResponse.json({ error: "Display name cannot be empty" }, { status: 400 });
    }

    if (username.trim().length === 0) {
      return NextResponse.json({ error: "Username cannot be empty" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: email.trim().toLowerCase() }, { username: username.trim() }] }
    });
    if (existing) {
      return NextResponse.json({ error: "Email or username already taken" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashed,
        name: name.trim(),
        username: username.trim(),
        emailVerified: null,
      },
    });

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
      to: email,
      from: "Valorant Skins <no-reply@valorantskins.dev>",
      subject: "Verify your Valorant Skin Tracker account",
      html: `
        <p>Hey ${name ?? username},</p>
        <p>Click the link below to verify your email:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      `,
      text: `Verify your account: ${verifyUrl}`,
    });

    return NextResponse.json({ ok: true });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
