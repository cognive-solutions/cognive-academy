"use client";

import Link from "next/link";

import ScrollToTopOnMount from "@/components/scroll-to-top-on-mount";

export default function CorporateTrainingPage() {
  return (
    <main className="flex min-h-[calc(100vh-180px)] items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_30%),linear-gradient(135deg,_#f8fbff_0%,_#f5f3ff_50%,_#eef7ff_100%)] px-4 py-10 transition-colors duration-300 sm:px-6 sm:py-16 dark:bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_26%),linear-gradient(135deg,_#020817_0%,_#0f172a_40%,_#111827_100%)]">
      <ScrollToTopOnMount />
      <div className="w-full max-w-4xl">
        <div className="rounded-[24px] border border-slate-200 bg-white/80 p-5 text-center shadow-[0_30px_70px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_32px_74px_rgba(79,70,229,0.12)] sm:rounded-[32px] sm:p-8 md:p-10 dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-[0_30px_70px_rgba(2,6,23,0.42)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 text-2xl font-black text-white shadow-[0_16px_30px_rgba(79,70,229,0.24)] sm:h-16 sm:w-16">
            !
          </div>

          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-600 sm:mt-6 sm:text-[11px] dark:text-indigo-300">
            Coming soon
          </p>

          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl sm:text-4xl dark:text-white">
            Corporate training is on the way.
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7 md:text-lg dark:text-slate-300">
            We&apos;re preparing tailored learning courses for teams that want practical upskilling and stronger business outcomes.
          </p>

          <div className="mt-7 flex flex-row justify-center gap-2 sm:mt-8 sm:gap-3">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 px-3 py-3 text-xs font-semibold text-white shadow-[0_16px_30px_rgba(79,70,229,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_34px_rgba(79,70,229,0.32)] sm:w-auto sm:px-6 sm:py-3.5 sm:text-sm"
            >
              Go to home
            </Link>
            <Link
              href="/courses#course-results"
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-3 text-xs font-semibold text-slate-700 shadow-[0_10px_20px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:w-auto sm:px-6 sm:py-3.5 sm:text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-200"
            >
              Explore courses
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
