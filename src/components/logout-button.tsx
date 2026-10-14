"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import ConfirmDialog from "./confirm-dialog";
import { markIntentionalLogout } from "./session-monitor";

function getLogoutRedirectPath() {
  return "/logout";
}

export function LogoutButton() {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    setOpen(false);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("cognive-profile-sync");
    }
    markIntentionalLogout();

    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } catch (error) {
      console.error("Logout API failed:", error);
    }

    await signOut({ callbackUrl: getLogoutRedirectPath(), redirect: true });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800"
      >
        Logout
      </button>

      <ConfirmDialog
        open={open}
        title="Sign out"
        description="You will be signed out of your account. Are you sure you want to continue?"
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        onConfirm={handleLogout}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
