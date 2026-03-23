import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 400 }
      );
    }

    const record = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!record || record.expires < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    });

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
