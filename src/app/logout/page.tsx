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
    : "Your account has been logged out";

  const description = reason === "remote"
    ? "You were signed out from another device. Please log in again to continue."
    : "Thanks for using Cognive Academy. Please log in again to continue your learning journey.";

  return (
    <>
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_26%),linear-gradient(135deg,_#f8fbff_0%,_#f5f3ff_45%,_#eef7ff_100%)] px-4 py-10 text-slate-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_26%),linear-gradient(135deg,_#020817_0%,_#0f172a_35%,_#111827_100%)] dark:text-slate-100 md:px-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-12 top-16 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/15" />
          <div className="absolute bottom-10 right-8 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-400/10" />
          <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 dark:border-indigo-400/10" />
        </div>

        <div className="premium-card relative z-10 mx-auto w-full max-w-6xl overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/80 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-[0_30px_90px_rgba(2,6,23,0.5)]">
          <div className="grid items-stretch lg:grid-cols-[1.06fr_0.94fr]">
            <div className="space-y-7 bg-[linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(244,247,255,0.94),_rgba(239,246,255,0.9))] p-8 md:p-10 lg:p-12 dark:bg-[linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(17,24,39,0.96),_rgba(15,23,42,0.94))]">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#2a2c2f] shadow-sm shadow-indigo-100/80 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-100 dark:shadow-none">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.12)] dark:bg-red-500 dark:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]" />
                Logged out
              </div>

              <div className="space-y-4">
                <h1 className="max-w-[430px] text-[2.5rem] font-black leading-[0.88] tracking-[-0.08em] text-[#111827] dark:text-white md:text-[3.5rem] lg:text-[4rem]">
                  {heading}
                </h1>
                <p className="max-w-[390px] text-[15px] leading-[1.7] tracking-[-0.01em] text-[#4a5361] dark:text-slate-300 md:text-[17px]">
                  {description}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(79,70,229,0.22)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110 dark:from-indigo-600 dark:via-violet-600 dark:to-sky-500 dark:hover:brightness-110"
                >
                  Log in again
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 px-7 py-3 text-sm font-semibold text-indigo-700 shadow-[0_8px_20px_rgba(99,102,241,0.08)] transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                >
                  Go to home
                </Link>
              </div>
            </div>

            <div className="premium-panel relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_26%),linear-gradient(135deg,_#0d1c2d_0%,_#0b1220_100%)] p-5 md:p-7 dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.28),_transparent_24%),linear-gradient(135deg,_#020817_0%,_#0f172a_30%,_#111827_100%)]">
              <div className="absolute inset-0 opacity-80" style={{
                backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.14) 1px, transparent 1px, transparent 100%)",
                backgroundSize: "14px 14px",
              }} />
              <div className="premium-glow relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-[24px] border border-[#2d3c4f] bg-[#0c1a2a] p-6 md:p-8 shadow-[0_18px_44px_rgba(15,23,42,0.32)] transition-all duration-500 hover:shadow-[0_20px_48px_rgba(15,23,42,0.38)] dark:border-slate-700 dark:bg-slate-900/80">
                <div className="absolute inset-0 opacity-75" style={{
                  transform: "skewY(-18deg)",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(99,102,241,0.03) 35%, rgba(255,255,255,0.02) 100%)",
                }} />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="relative flex h-18 w-18 items-center justify-center rounded-[22px] border border-indigo-400/30 bg-[radial-gradient(circle_at_30%_30%,_rgba(165,180,252,0.5),_rgba(99,102,241,0.12)_28%,_rgba(15,23,42,0.05)_100%)] shadow-[0_0_30px_rgba(99,102,241,0.28)]">
                    <div className="absolute inset-0 animate-pulse rounded-[22px] border border-indigo-300/30" />
                    <svg viewBox="0 0 24 24" className="relative h-9 w-9 text-indigo-100" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 11V8a5 5 0 0 1 10 0v3" />
                      <rect x="5" y="11" width="14" height="9" rx="2.5" />
                    </svg>
                  </div>
                  <div className="rounded-full border border-red-400/30 bg-red-500/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-red-200">
                    Secure
                  </div>
                </div>

                <div className="relative z-20 -mt-2 mb-2 flex justify-center">
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full shadow-[0_0_28px_rgba(99,102,241,0.18)]">
                    <div className="absolute inset-[-30px] rounded-full border border-indigo-200/25 bg-indigo-400/5 animate-[waveRing_3s_ease-out_infinite]" />
                    <div className="absolute inset-[-16px] rounded-full border border-indigo-400/35 bg-indigo-400/5 animate-[waveRing_3s_ease-out_0.8s_infinite]" />
                    <div className="absolute inset-[-6px] rounded-full border border-indigo-300/15 animate-[waveRing_3s_ease-out_1.5s_infinite]" />
                    <div className="absolute inset-7 rounded-full bg-indigo-400/8 blur-2xl" />
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-indigo-400/20 bg-[radial-gradient(circle,_rgba(99,102,241,0.38),_rgba(15,23,42,0.12)_52%,_rgba(15,23,42,0.04)_100%)] shadow-[0_0_40px_rgba(99,102,241,0.16),0_16px_28px_rgba(15,23,42,0.22)]">
                      <div className="absolute inset-3 rounded-full border border-indigo-300/20" />
                      <svg viewBox="0 0 100 100" className="relative h-16 w-16 text-indigo-100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M50 12c18 0 32 12 32 28 0 22-16 41-32 48-16-7-32-26-32-48 0-16 14-28 32-28Z" opacity="0.9" />
                        <path d="M50 30v20" />
                        <path d="M50 58h.01" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 space-y-3 rounded-2xl border border-[#31435d] bg-[#0b1a2a]/80 p-5 shadow-[0_18px_40px_rgba(2,6,23,0.35)] dark:border-indigo-500/30 dark:bg-slate-900/75 dark:shadow-[0_18px_40px_rgba(79,70,229,0.18)]">
                  <div className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-indigo-100/80 dark:text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
                    Account security
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-indigo-400/60 via-violet-300/50 to-transparent" />
                  <div className="text-[2rem] font-black leading-none tracking-[-0.06em] text-white dark:text-white">Signed out</div>
                  <div className="max-w-[360px] text-[14px] leading-[1.7] tracking-[-0.01em] text-slate-300 dark:text-slate-300">
                    To continue securely, you can sign in again or return to the homepage.
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
