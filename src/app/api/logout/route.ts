import bcrypt from "bcryptjs";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    let body: { email?: string; password?: string } | null = null;

    try {
      body = await request.json();
    } catch {
      body = null;
    }

    const session = await auth();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : null;
    const password = typeof body?.password === "string" ? body.password : null;

    const currentUserId = session?.user?.id ?? null;

    if (currentUserId) {
      await prisma.userSession.updateMany({
        where: {
          userId: currentUserId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
          revokedReason: "user_logout",
        },
      });

      await prisma.user.update({
        where: { id: currentUserId },
        data: { activeSessionToken: null },
      });

      return NextResponse.json({ ok: true, revoked: true, mode: "session" });
    }

    if (email && password) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, passwordHash: true },
      });

      if (!user?.passwordHash) {
        return NextResponse.json({ ok: false, revoked: false, reason: "invalid_user" }, { status: 401 });
      }

      const validPassword = await bcrypt.compare(password, user.passwordHash);

      if (!validPassword) {
        return NextResponse.json({ ok: false, revoked: false, reason: "invalid_password" }, { status: 401 });
      }

      await prisma.userSession.updateMany({
        where: {
          userId: user.id,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
          revokedReason: "credential_logout",
        },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { activeSessionToken: null },
      });

      return NextResponse.json({ ok: true, revoked: true, mode: "credentials" });
    }

    return NextResponse.json({ ok: true, revoked: false, mode: "noop" });
  } catch (error) {
    console.error("Logout failed:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
