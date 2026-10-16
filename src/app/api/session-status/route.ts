import { NextResponse } from "next/server";

import { ABSOLUTE_SESSION_MAX_AGE_MS, INACTIVITY_TIMEOUT_MS, auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const shouldRefreshActivity = searchParams.get("heartbeat") === "1" || searchParams.get("heartbeat") === "true";

    if (!session?.user?.id) {
      return NextResponse.json({ valid: false, reason: "no_session" });
    }

    const now = new Date();
    const inactivityCutoff = new Date(now.getTime() - INACTIVITY_TIMEOUT_MS);

    const activeSession = await prisma.userSession.findFirst({
      where: {
        userId: session.user.id,
        revokedAt: null,
        expiresAt: {
          gt: now,
        },
        lastSeenAt: {
          gt: inactivityCutoff,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!activeSession) {
      await prisma.userSession.updateMany({
        where: {
          userId: session.user.id,
          revokedAt: null,
        },
        data: {
          revokedAt: now,
          revokedReason: "session_timeout",
        },
      });

      await prisma.user.update({
        where: { id: session.user.id },
        data: { activeSessionToken: null },
      });

      return NextResponse.json({ valid: false, reason: "session_revoked" });
    }

    if (shouldRefreshActivity) {
      await prisma.userSession.update({
        where: { id: activeSession.id },
        data: {
          lastSeenAt: now,
          expiresAt: new Date(now.getTime() + ABSOLUTE_SESSION_MAX_AGE_MS),
        },
      });
      return NextResponse.json({ valid: true, reason: "ok", refreshed: true });
    }

    return NextResponse.json({ valid: true, reason: "ok", refreshed: false });
  } catch {
    return NextResponse.json({ valid: false, reason: "error" }, { status: 500 });
  }
}
