"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  useEffect(() => {
    fetch("/api/logout", {
      method: "POST",
      credentials: "same-origin",
    }).catch(() => undefined);

    if (reason !== "remote") {
      const timer = window.setTimeout(() => {
        window.location.href = "/";
      }, 8000);

      return () => window.clearTimeout(timer);
    }
  }, [reason]);

  const heading = reason === "remote"
    ? "Your session was ended"
    : reason === "inactive"
      ? "Your session expired due to inactivity"
      : "Your account has been logged out";

  const description = reason === "remote"
    ? "You were signed out from another device. Please log in again to continue."
    : reason === "inactive"
      ? "You have been automatically signed out because you were inactive for more than 24 hours. Please log in again to continue."
      : "Thanks for using Cognive Academy. Please log in again to continue your learning journey.";

  return (
    <>
      <main className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_26%),linear-gradient(135deg,_#f8fbff_0%,_#f5f3ff_45%,_#eef7ff_100%)] px-4 py-6 text-slate-900 transition-colors duration-300 sm:py-10 dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_26%),linear-gradient(135deg,_#020817_0%,_#0f172a_35%,_#111827_100%)] dark:text-slate-100 md:px-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-12 top-16 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/15" />
          <div className="absolute bottom-10 right-8 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-400/10" />
          <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 dark:border-indigo-400/10" />
        </div>

        <div className="premium-card relative z-10 mx-auto w-full max-w-6xl overflow-hidden rounded-[22px] border border-slate-200/80 bg-white/80 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:rounded-[30px] dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-[0_30px_90px_rgba(2,6,23,0.5)]">
          <div className="grid items-stretch lg:grid-cols-[1.06fr_0.94fr]">
            <div className={`space-y-5 p-5 sm:space-y-7 sm:p-8 md:p-10 lg:p-12 ${reason === "inactive"
              ? "bg-[linear-gradient(135deg,_rgba(255,247,237,0.98),_rgba(254,243,199,0.92),_rgba(255,237,213,0.96))] dark:bg-[linear-gradient(135deg,_rgba(69,26,3,0.96),_rgba(120,53,15,0.92),_rgba(41,37,36,0.96))]"
              : "bg-[linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(244,247,255,0.94),_rgba(239,246,255,0.9))] dark:bg-[linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(17,24,39,0.96),_rgba(15,23,42,0.94))]"}`}>
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] shadow-sm ${reason === "inactive"
                ? "border-orange-300/80 bg-orange-100 text-orange-900 shadow-orange-200/80 dark:border-orange-500/50 dark:bg-orange-500/10 dark:text-orange-100"
                : "border-indigo-200 bg-indigo-50/80 text-[#2a2c2f] shadow-indigo-100/80 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-100 dark:shadow-none"}`}>
                <span className={`h-2.5 w-2.5 animate-pulse rounded-full ${reason === "inactive"
                  ? "bg-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,0.16)] dark:shadow-[0_0_0_4px_rgba(251,146,60,0.18)]"
                  : "bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.12)]"}`} />
                {reason === "inactive" ? "Session expired" : "Logged out"}
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h1 className={`max-w-[430px] font-black leading-[0.96] tracking-[-0.08em] ${reason === "inactive"
                  ? "text-[2.7rem] text-orange-700 sm:text-[3.3rem] md:text-[4rem] lg:text-[4.7rem] dark:text-orange-300"
                  : "text-[2.1rem] text-[#111827] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] dark:text-white"}`}>
                  {heading}
                </h1>
                <p className={`max-w-[390px] text-[14px] leading-[1.6] tracking-[-0.01em] sm:text-[15px] md:text-[17px] ${reason === "inactive"
                  ? "font-semibold text-orange-950/90 dark:text-orange-100/90"
                  : "text-[#4a5361] dark:text-slate-300"}`}>
                  {description}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className={`inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(79,70,229,0.22)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110 ${reason === "inactive"
                    ? "bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 shadow-[0_12px_30px_rgba(249,115,22,0.28)]"
                    : "bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 shadow-[0_12px_30px_rgba(79,70,229,0.22)]"}`}
                >
                  Log in again
                </Link>
                <Link
                  href="/"
                  className={`inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold shadow-[0_8px_20px_rgba(99,102,241,0.08)] transition duration-300 hover:-translate-y-0.5 ${reason === "inactive"
                    ? "border border-orange-300 bg-orange-100 text-orange-800 hover:bg-orange-200 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-100 dark:hover:bg-orange-500/20"
                    : "border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"}`}
                >
                  Go to home
                </Link>
              </div>
            </div>

            <div className={`premium-panel relative overflow-hidden p-4 sm:p-5 md:p-7 ${reason === "inactive"
              ? "bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.24),_transparent_26%),linear-gradient(135deg,_#2a1708_0%,_#1f130d_100%)]"
              : "bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_26%),linear-gradient(135deg,_#0d1c2d_0%,_#0b1220_100%)]"} dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.28),_transparent_24%),linear-gradient(135deg,_#020817_0%,_#0f172a_30%,_#111827_100%)]`}>
              <div className="absolute inset-0 opacity-80" style={{
                backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.14) 1px, transparent 1px, transparent 100%)",
                backgroundSize: "14px 14px",
              }} />
              <div className={`premium-glow relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-[20px] border p-4 shadow-[0_18px_44px_rgba(15,23,42,0.32)] transition-all duration-500 hover:shadow-[0_20px_48px_rgba(15,23,42,0.38)] sm:min-h-[260px] sm:p-6 md:p-8 ${reason === "inactive"
                ? "border-orange-400/50 bg-[radial-gradient(circle_at_30%_20%,_rgba(251,146,60,0.28),_rgba(120,53,15,0.32)_35%,_rgba(24,24,27,0.88)_100%)]"
                : "border-[#2d3c4f] bg-[#0c1a2a]"} dark:border-slate-700 dark:bg-slate-900/80`}>
                <div className="absolute inset-0 opacity-75" style={{
                  transform: "skewY(-18deg)",
                  background: reason === "inactive"
                    ? "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(249,115,22,0.06) 35%, rgba(255,255,255,0.04) 100%)"
                    : "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(99,102,241,0.03) 35%, rgba(255,255,255,0.02) 100%)",
                }} />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className={`relative flex h-18 w-18 items-center justify-center rounded-[22px] border shadow-[0_0_30px_rgba(99,102,241,0.28)] ${reason === "inactive"
                    ? "border-orange-300/70 bg-[radial-gradient(circle_at_30%_30%,_rgba(253,186,116,0.55),_rgba(249,115,22,0.18)_28%,_rgba(41,37,36,0.05)_100%)] shadow-[0_0_40px_rgba(249,115,22,0.28)]"
                    : "border-indigo-400/30 bg-[radial-gradient(circle_at_30%_30%,_rgba(165,180,252,0.5),_rgba(99,102,241,0.12)_28%,_rgba(15,23,42,0.05)_100%)]"}`}>
                    <div className={`absolute inset-0 animate-pulse rounded-[22px] ${reason === "inactive" ? "border border-orange-300/40" : "border border-indigo-300/30"}`} />
                    <svg viewBox="0 0 24 24" className={`relative h-9 w-9 ${reason === "inactive" ? "text-orange-100" : "text-indigo-100"}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 11V8a5 5 0 0 1 10 0v3" />
                      <rect x="5" y="11" width="14" height="9" rx="2.5" />
                    </svg>
                  </div>
                  <div className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] ${reason === "inactive"
                    ? "border-orange-300/40 bg-orange-500/12 text-orange-100"
                    : "border-red-400/30 bg-red-500/10 text-red-200"}`}>
                    {reason === "inactive" ? "Warning" : "Secure"}
                  </div>
                </div>

                <div className="relative z-20 -mt-2 mb-2 flex justify-center">
                  <div className={`relative flex h-28 w-28 items-center justify-center rounded-full ${reason === "inactive" ? "shadow-[0_0_32px_rgba(249,115,22,0.22)]" : "shadow-[0_0_28px_rgba(99,102,241,0.18)]"}`}>
                    <div className={`absolute inset-[-30px] rounded-full border bg-orange-400/5 animate-[waveRing_3s_ease-out_infinite] ${reason === "inactive" ? "border-orange-200/30" : "border-indigo-200/25"}`} />
                    <div className={`absolute inset-[-16px] rounded-full border bg-orange-400/5 animate-[waveRing_3s_ease-out_0.8s_infinite] ${reason === "inactive" ? "border-orange-300/35" : "border-indigo-400/35"}`} />
                    <div className={`absolute inset-[-6px] rounded-full border animate-[waveRing_3s_ease-out_1.5s_infinite] ${reason === "inactive" ? "border-orange-300/25" : "border-indigo-300/15"}`} />
                    <div className={`absolute inset-7 rounded-full blur-2xl ${reason === "inactive" ? "bg-orange-400/12" : "bg-indigo-400/8"}`} />
                    <div className={`relative flex h-28 w-28 items-center justify-center rounded-full border ${reason === "inactive"
                      ? "border-orange-400/40 bg-[radial-gradient(circle,_rgba(251,146,60,0.42),_rgba(69,26,3,0.2)_52%,_rgba(15,23,42,0.08)_100%)] shadow-[0_0_44px_rgba(249,115,22,0.2),0_16px_28px_rgba(15,23,42,0.22)]"
                      : "border-indigo-400/20 bg-[radial-gradient(circle,_rgba(99,102,241,0.38),_rgba(15,23,42,0.12)_52%,_rgba(15,23,42,0.04)_100%)] shadow-[0_0_40px_rgba(99,102,241,0.16),0_16px_28px_rgba(15,23,42,0.22)]"}`}>
                      <div className="absolute inset-3 rounded-full border border-orange-200/10" />
                      <svg viewBox="0 0 100 100" className={`relative h-16 w-16 ${reason === "inactive" ? "text-orange-50" : "text-indigo-100"}`} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M50 12c18 0 32 12 32 28 0 22-16 41-32 48-16-7-32-26-32-48 0-16 14-28 32-28Z" opacity="0.9" />
                        <path d="M50 30v20" />
                        <path d="M50 58h.01" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className={`relative z-10 space-y-3 rounded-2xl border p-5 shadow-[0_18px_40px_rgba(2,6,23,0.35)] ${reason === "inactive"
                  ? "border-orange-400/40 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.18),_rgba(41,37,36,0.82)_60%,_rgba(12,10,9,0.88)_100%)]"
                  : "border-[#31435d] bg-[#0b1a2a]/80 dark:border-indigo-500/30 dark:bg-slate-900/75 dark:shadow-[0_18px_40px_rgba(79,70,229,0.18)]"}`}>
                  <div className={`flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] ${reason === "inactive" ? "text-orange-100/90" : "text-indigo-100/80 dark:text-slate-300"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${reason === "inactive" ? "bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.9)]" : "bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]"}`} />
                    {reason === "inactive" ? "Session timeout" : "Account security"}
                  </div>
                  <div className={`h-px w-full ${reason === "inactive" ? "bg-gradient-to-r from-orange-400/70 via-amber-300/50 to-transparent" : "bg-gradient-to-r from-indigo-400/60 via-violet-300/50 to-transparent"}`} />
                  <div className={`text-[2rem] font-black leading-none tracking-[-0.06em] ${reason === "inactive" ? "text-orange-50" : "text-white dark:text-white"}`}>{reason === "inactive" ? "Timed out" : "Signed out"}</div>
                  <div className={`max-w-[360px] text-[14px] leading-[1.7] tracking-[-0.01em] ${reason === "inactive" ? "text-orange-100/90" : "text-slate-300 dark:text-slate-300"}`}>
                    {reason === "inactive"
                      ? "Your session expired after 24 hours of inactivity. Please sign in again to continue safely."
                      : "To continue securely, you can sign in again or return to the homepage."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 0 rgba(99, 102, 241, 0), 0 0 0 rgba(59, 130, 246, 0);
          }
          50% {
            box-shadow: 0 0 30px rgba(79, 70, 229, 0.22), 0 0 42px rgba(56, 189, 248, 0.14);
          }
        }

        @keyframes waveRing {
          0% {
            opacity: 0.95;
            transform: scale(0.92);
          }
          60% {
            opacity: 0.35;
            transform: scale(1.08);
          }
          100% {
            opacity: 0;
            transform: scale(1.18);
          }
        }

        .premium-card {
          animation: fadeUp 0.7s ease-out both;
        }

        .premium-panel {
          animation: fadeUp 0.9s ease-out 0.15s both;
        }

        .premium-glow {
          animation: glowPulse 3.2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
