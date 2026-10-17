"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

const INTENTIONAL_LOGOUT_KEY = "cognive-intentional-logout";
const LOGOUT_REASON_KEY = "cognive-logout-reason";
const HEARTBEAT_INTERVAL_MS = 60_000;
const VALIDATION_INTERVAL_MS = 10_000;

export function markIntentionalLogout() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("cognive-profile-sync");
  window.localStorage.setItem(INTENTIONAL_LOGOUT_KEY, "1");
  window.localStorage.setItem(LOGOUT_REASON_KEY, "manual");
}

export function clearIntentionalLogout() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("cognive-profile-sync");
  window.localStorage.removeItem(INTENTIONAL_LOGOUT_KEY);
  window.localStorage.removeItem(LOGOUT_REASON_KEY);
}

export function SessionMonitor() {
  const { status } = useSession();
  const lastHeartbeatRef = useRef(0);

  useEffect(() => {
    if (status !== "authenticated" && typeof window !== "undefined") {
      window.localStorage.removeItem("cognive-profile-sync");
      if (status === "unauthenticated") {
        window.localStorage.removeItem(INTENTIONAL_LOGOUT_KEY);
        window.localStorage.removeItem(LOGOUT_REASON_KEY);
      }
    }
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    if (typeof window !== "undefined" && window.localStorage.getItem(INTENTIONAL_LOGOUT_KEY) === "1") {
      return;
    }

    const checkSession = async () => {
      try {
        const response = await fetch("/api/session-status", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { valid?: boolean; reason?: string };

        if (data.valid === false) {
          const reason = data.reason === "session_timeout" || data.reason === "inactive" ? "inactive" : "remote";
          window.localStorage.removeItem("cognive-profile-sync");
          window.localStorage.setItem(LOGOUT_REASON_KEY, reason);
          await signOut({ redirect: false });
          window.location.replace(`/logout?reason=${reason}`);
        }
      } catch {
        // Ignore transient polling failures; the next cycle will retry.
      }
    };

    const sendHeartbeat = async () => {
      const now = Date.now();
      if (now - lastHeartbeatRef.current < HEARTBEAT_INTERVAL_MS) {
        return;
      }

      lastHeartbeatRef.current = now;

      try {
        const response = await fetch("/api/session-status?heartbeat=1", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { valid?: boolean; reason?: string };

        if (data.valid === false) {
          const reason = data.reason === "session_timeout" || data.reason === "inactive" ? "inactive" : "remote";
          window.localStorage.removeItem("cognive-profile-sync");
          window.localStorage.setItem(LOGOUT_REASON_KEY, reason);
          await signOut({ redirect: false });
          window.location.replace(`/logout?reason=${reason}`);
        }
      } catch {
        // Ignore heartbeat failures; validation polling will catch stale sessions.
      }
    };

    const activityEvents = ["pointerdown", "keydown", "touchstart", "scroll", "mousemove", "click"];

    const onActivity = () => {
      void sendHeartbeat();
    };

    activityEvents.forEach((eventName) => window.addEventListener(eventName, onActivity, { passive: true }));

    const validationTimer = window.setInterval(() => {
      void checkSession();
    }, VALIDATION_INTERVAL_MS);

    return () => {
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, onActivity));
      window.clearInterval(validationTimer);
    };
  }, [status]);

  return null;
}
