import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

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

    await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashed,
        name: name.trim(),
        username: username.trim(),
        emailVerified: new Date(),
      },
    });

    return NextResponse.json({ ok: true });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
