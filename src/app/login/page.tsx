"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense, useEffect, useRef, useState } from "react";

import { AuthMessage } from "@/components/auth-message";
import { clearIntentionalLogout } from "@/components/session-monitor";

const SINGLE_SESSION_MESSAGE = "This account is already logged in on another device. Please log out from that device and try again.";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionConflictActionLoading, setSessionConflictActionLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const passwordHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") ?? "/home";

  useEffect(() => {
    return () => {
      if (passwordHideTimeoutRef.current) {
        clearTimeout(passwordHideTimeoutRef.current);
      }
    };
  }, []);

  const handlePasswordToggle = () => {
    if (showPassword) {
      setShowPassword(false);
      if (passwordHideTimeoutRef.current) {
        clearTimeout(passwordHideTimeoutRef.current);
      }
      return;
    }

    setShowPassword(true);
    if (passwordHideTimeoutRef.current) {
      clearTimeout(passwordHideTimeoutRef.current);
    }
    passwordHideTimeoutRef.current = setTimeout(() => {
      setShowPassword(false);
    }, 1800);
  };
  const error = searchParams.get("error");

  async function tryCredentialsLogin(normalizedEmail: string, passwordValue: string) {
    const result = await signIn("credentials", {
      email: normalizedEmail,
      password: passwordValue,
      redirect: false,
    });

    if (!result || result.error || result.ok === false) {
      return result;
    }

    clearIntentionalLogout();
    return result;
  }

  async function handleSessionConflictAction() {
    if (!email.trim() || !password) {
      setFormError("Please enter your email and password to log out from all devices and continue.");
      return;
    }

    setSessionConflictActionLoading(true);
    setFormError(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const logoutResponse = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      if (!logoutResponse.ok) {
        throw new Error("Logout failed");
      }

      const authStatusResponse = await fetch("/api/auth-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const authStatus = await authStatusResponse.json();
      if (authStatus?.status === "session_conflict") {
        setFormError(SINGLE_SESSION_MESSAGE);
        return;
      }

      const result = await tryCredentialsLogin(normalizedEmail, password);
      if (!result || result.error || result.ok === false) {
        const loginErrorMessage = result?.error === "VerificationRequired"
          ? "Please verify your email and mobile number before logging in."
          : result?.error === "SessionConflict"
            ? SINGLE_SESSION_MESSAGE
            : "Invalid credentials. Please make sure you are using the correct email and password.";
        setFormError(loginErrorMessage);
        return;
      }

      router.replace(callbackUrl);
    } catch {
      setFormError(SINGLE_SESSION_MESSAGE);
    } finally {
      setSessionConflictActionLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const userStatusResponse = await fetch("/api/auth-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const userStatus = await userStatusResponse.json();

      if (userStatus?.status === "inactive") {
        setFormError("This account is currently inactive. Please contact support.");
        return;
      }

      if (userStatus?.status === "missing") {
        setFormError("Invalid credentials. Please make sure you are using the correct email and password.");
        return;
      }

      if (userStatus?.status === "verification_required") {
        setFormError("Please verify your email and mobile number before logging in.");
        return;
      }

      if (userStatus?.status === "session_conflict") {
        setFormError(SINGLE_SESSION_MESSAGE);
        return;
      }

      const result = await signIn("credentials", {
        email: normalizedEmail,
        password,
        redirect: false,
      });

      if (!result || result.error || result.ok === false) {
        const loginErrorMessage = result?.error === "VerificationRequired"
          ? "Please verify your email and mobile number before logging in."
          : result?.error === "SessionConflict"
            ? SINGLE_SESSION_MESSAGE
            : "Invalid credentials. Please make sure you are using the correct email and password.";
        setFormError(loginErrorMessage);
        return;
      }

      router.replace(callbackUrl);
    } catch {
      setFormError("Invalid credentials. Please make sure you are using the correct email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_26%),linear-gradient(135deg,_#f8fbff_0%,_#f5f3ff_45%,_#eef7ff_100%)] px-4 py-8 transition-colors duration-300 sm:px-6 sm:py-12 dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_26%),linear-gradient(135deg,_#020817_0%,_#0f172a_35%,_#111827_100%)]">
      <div className="w-full max-w-md rounded-[22px] border border-slate-200 bg-white/90 p-5 shadow-[0_28px_70px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:rounded-[30px] sm:p-9 dark:border-slate-700 dark:bg-slate-900/85 dark:shadow-[0_28px_70px_rgba(2,6,23,0.52)]">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 text-lg font-black text-white shadow-lg shadow-indigo-200 dark:shadow-[0_16px_28px_rgba(99,102,241,0.35)]">
            C
          </div>
        </div>

        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-600 sm:text-xs dark:text-indigo-300">Student login</p>
        <h1 className="mt-3 text-center text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">Welcome back</h1>

        <AuthMessage
          message={
            formError ??
            (error === "AccountInactive"
              ? "This account is currently inactive. Please contact support."
              : error === "VerificationRequired"
                ? "Please verify your email and mobile number before logging in."
                : error === "SessionConflict"
                  ? "Your session was ended because you logged out from another device."
                  : error === "CredentialsSignin"
                    ? "Invalid credentials. Please make sure you are using the correct email and password."
                    : null)
          }
        />

        {formError === SINGLE_SESSION_MESSAGE && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleSessionConflictAction}
              disabled={sessionConflictActionLoading || !email.trim() || !password}
              className="w-full rounded-full border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-200 dark:hover:bg-amber-500/20"
            >
              {sessionConflictActionLoading ? "Logging out other devices..." : "Log out from other device and continue"}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 sm:mb-2 dark:text-slate-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white sm:text-base dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 sm:mb-2 dark:text-slate-200">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white sm:text-base dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={handlePasswordToggle}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 px-5 py-3 font-semibold text-white shadow-[0_16px_35px_rgba(79,70,229,0.3)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-[0_16px_35px_rgba(99,102,241,0.36)]"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-5 space-y-2 text-center text-sm text-slate-600 dark:text-slate-300">
          <p>
            Don’t have an account? {" "}
            <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200">
              Create one
            </Link>
          </p>
          <p>
            <Link href="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_26%),linear-gradient(135deg,_#f8fbff_0%,_#f5f3ff_45%,_#eef7ff_100%)] px-6 py-12 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_26%),linear-gradient(135deg,_#020817_0%,_#0f172a_35%,_#111827_100%)]">
        <div className="w-full max-w-md rounded-[30px] border border-slate-200 bg-white/90 p-8 shadow-[0_28px_70px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-9 dark:border-slate-700 dark:bg-slate-900/85 dark:shadow-[0_28px_70px_rgba(2,6,23,0.52)]">
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 text-lg font-black text-white shadow-lg shadow-indigo-200 dark:shadow-[0_16px_28px_rgba(99,102,241,0.35)]">
              C
            </div>
          </div>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">Student login</p>
          <h1 className="mt-3 text-center text-3xl font-black tracking-tight text-slate-900 dark:text-white">Welcome back</h1>
          <div className="mt-6 animate-pulse space-y-4">
            <div className="h-11 rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-11 rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-12 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
