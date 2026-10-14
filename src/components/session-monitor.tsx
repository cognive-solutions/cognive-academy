"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const INTENTIONAL_LOGOUT_KEY = "cognive-intentional-logout";
const LOGOUT_REASON_KEY = "cognive-logout-reason";

export function markIntentionalLogout() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(INTENTIONAL_LOGOUT_KEY, "1");
  window.localStorage.setItem(LOGOUT_REASON_KEY, "manual");
}

export function clearIntentionalLogout() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(INTENTIONAL_LOGOUT_KEY);
  window.localStorage.removeItem(LOGOUT_REASON_KEY);
}

export function SessionMonitor() {
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    if (typeof window !== "undefined" && window.localStorage.getItem(INTENTIONAL_LOGOUT_KEY) === "1") {
      return;
    }

    const timer = window.setInterval(async () => {
      try {
        const response = await fetch("/api/session-status", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { valid?: boolean };

        if (data.valid === false) {
          window.localStorage.setItem(LOGOUT_REASON_KEY, "remote");
          await signOut({ redirect: false });
          window.clearInterval(timer);
          window.location.replace("/logout?reason=remote");
        }
      } catch {
        // Ignore transient polling failures; the next cycle will retry.
      }
    }, 5000);

    return () => window.clearInterval(timer);
  }, [status]);

  return null;
}
