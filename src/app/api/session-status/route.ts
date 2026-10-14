import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ valid: false, reason: "no_session" });
    }

    const activeSession = await prisma.userSession.findFirst({
      where: {
        userId: session.user.id,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!activeSession) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { activeSessionToken: null },
      });

      return NextResponse.json({ valid: false, reason: "session_revoked" });
    }

    return NextResponse.json({ valid: true, reason: "ok" });
  } catch {
    return NextResponse.json({ valid: false, reason: "error" }, { status: 500 });
  }
}
