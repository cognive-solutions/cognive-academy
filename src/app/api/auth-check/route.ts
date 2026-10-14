import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function hasUserColumn(columnName: string) {
  try {
    const rows = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS(
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'users'
          AND column_name = ${columnName}
      ) AS "exists";
    `;

    return Boolean(rows[0]?.exists);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const requestedRole = typeof body?.role === "string" ? body.role.trim().toUpperCase() : "";

    if (!email) {
      return NextResponse.json({ status: "missing" });
    }

    const supportsActiveSessionToken = await hasUserColumn("activeSessionToken");
    const supportsEmailVerifiedAt = await hasUserColumn("emailVerifiedAt");
    const supportsPhoneVerifiedAt = await hasUserColumn("phoneVerifiedAt");

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        isActive: true,
        email: true,
        role: true,
        updatedAt: true,
        ...(supportsActiveSessionToken ? { activeSessionToken: true } : {}),
        ...(supportsEmailVerifiedAt ? { emailVerifiedAt: true } : {}),
        ...(supportsPhoneVerifiedAt ? { phoneVerifiedAt: true } : {}),
      },
    });

    if (!user) {
      return NextResponse.json({ status: "missing" });
    }

    if (supportsActiveSessionToken) {
      const activeSession = await prisma.userSession.findFirst({
        where: {
          userId: user.id,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
      });

      if (activeSession) {
        return NextResponse.json({ status: "session_conflict" });
      }

      await prisma.userSession.deleteMany({
        where: {
          userId: user.id,
          OR: [
            { revokedAt: { not: null } },
            { expiresAt: { lte: new Date() } },
          ],
        },
      });
    }

    const isInternalAdmin = user.role?.toUpperCase?.() === "ADMIN";

    if (requestedRole === "ADMIN" && !isInternalAdmin) {
      return NextResponse.json({ status: "not_admin" });
    }

    if (user.isActive === false) {
      return NextResponse.json({ status: "inactive" });
    }

    if (!isInternalAdmin && supportsEmailVerifiedAt && supportsPhoneVerifiedAt && (!user.emailVerifiedAt || !user.phoneVerifiedAt)) {
      return NextResponse.json({ status: "verification_required" });
    }

    return NextResponse.json({ status: "active" });
  } catch (error) {
    console.error("Login status check failed:", error);
    return NextResponse.json({ status: "missing" });
  }
}
