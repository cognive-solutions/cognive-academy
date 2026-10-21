"use client";

import Link from "next/link";

type SiteMode = "db-migration" | "maintenance" | "full-outage";

const siteMode: SiteMode = (() => {
  const raw = (
    process.env.NEXT_PUBLIC_SITE_MODE ??
    process.env.NEXT_PUBLIC_APP_MODE ??
    "db-migration"
  )
    .toLowerCase()
    .trim();

  if (raw.includes("maintenance")) return "maintenance";
  if (raw.includes("outage") || raw.includes("down")) return "full-outage";

  return "db-migration";
})();

const siteModeConfig = {
  "db-migration": {
    badge: "Database migration mode",
    title: "We are migrating our database.",
    message:
      "Some parts of the platform are temporarily unavailable while we move data to the new database. Please check back shortly.",
    accent: "amber",
  },
  maintenance: {
    badge: "Maintenance mode",
    title: "We are performing scheduled maintenance.",
    message:
      "The platform is temporarily unavailable while we complete upgrades and improvements. We will be back online shortly.",
    accent: "blue",
  },
  "full-outage": {
    badge: "Full site outage",
    title: "The platform is temporarily offline.",
    message:
      "We are currently experiencing a full service outage. Please try again in a few minutes or check back later.",
    accent: "red",
  },
} as const;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("App error boundary triggered:", error);

  const mode = siteModeConfig[siteMode];
  const buttonGradient =
    mode.accent === "red"
      ? "from-red-500 via-rose-500 to-orange-500"
      : mode.accent === "blue"
        ? "from-sky-500 via-cyan-500 to-indigo-500"
        : "from-amber-500 via-orange-500 to-yellow-500";

  const badgeClass =
    mode.accent === "red"
      ? "text-red-700 dark:text-red-300"
      : mode.accent === "blue"
        ? "text-sky-700 dark:text-sky-300"
        : "text-amber-700 dark:text-amber-300";

  const iconClass =
    mode.accent === "red"
      ? "from-red-400 via-rose-400 to-orange-400"
      : mode.accent === "blue"
        ? "from-sky-400 via-cyan-400 to-indigo-400"
        : "from-amber-400 via-orange-400 to-yellow-400";

  const cardBorderClass =
    mode.accent === "red"
      ? "border-red-200 dark:border-red-500/30"
      : mode.accent === "blue"
        ? "border-sky-200 dark:border-sky-500/30"
        : "border-amber-200 dark:border-amber-500/30";

  const secondaryHoverClass =
    mode.accent === "red"
      ? "hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:hover:border-red-500/40 dark:hover:bg-red-500/10 dark:hover:text-red-200"
      : mode.accent === "blue"
        ? "hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 dark:hover:border-sky-500/40 dark:hover:bg-sky-500/10 dark:hover:text-sky-200"
        : "hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 dark:hover:border-amber-500/40 dark:hover:bg-amber-500/10 dark:hover:text-amber-200";

  return (
    <main className="flex min-h-[calc(100vh-180px)] items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_30%),linear-gradient(135deg,_#f8fbff_0%,_#f5f3ff_50%,_#eef7ff_100%)] px-6 py-16 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_26%),linear-gradient(135deg,_#020817_0%,_#0f172a_35%,_#111827_100%)]">
      <div className="w-full max-w-2xl">
        <div className={`rounded-[32px] border bg-white/80 p-8 text-center shadow-[0_30px_70px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 md:p-10 dark:bg-slate-900/80 dark:shadow-[0_30px_70px_rgba(2,6,23,0.52)] ${cardBorderClass}`}>
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r ${iconClass} text-2xl font-black text-white shadow-[0_16px_30px_rgba(245,158,11,0.28)]`}>
            !
          </div>

          <p className={`mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] ${badgeClass}`}>
            {mode.badge}
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {mode.title}
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg dark:text-slate-300">
            {mode.message}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r ${buttonGradient} px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(245,158,11,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_34px_rgba(245,158,11,0.34)]`}
            >
              Try again
            </button>

            <Link
              href="/"
              className={`inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-[0_10px_20px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 ${secondaryHoverClass} dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100`}
            >
              Go to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
