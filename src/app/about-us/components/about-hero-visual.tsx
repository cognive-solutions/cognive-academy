"use client";

import { useEffect, useRef, useState } from "react";

function AnimatedMetric({ value, suffix = "", decimals = 0, onUpdate }: { value: number; suffix?: string; decimals?: number; onUpdate?: (value: number) => void }) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    const duration = 1200;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const nextValue = value * progress;
      const roundedValue = Number(nextValue.toFixed(decimals));

      setCount(roundedValue);
      onUpdate?.(roundedValue);

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(tick);
      }
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, decimals, onUpdate]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function AboutHeroVisual({
  isDark = false,
  communityCount,
  mentorCount,
  projectCount,
}: {
  isDark?: boolean;
  communityCount: number;
  mentorCount: number;
  projectCount: number;
}) {
  const [momentumProgress, setMomentumProgress] = useState(0);

  return (
    <div className="relative mx-auto w-full max-w-[430px] sm:max-w-[430px]">
      <div className={`absolute -left-4 top-8 h-20 w-20 rounded-full blur-2xl sm:-left-8 sm:top-10 sm:h-28 sm:w-28 ${isDark ? "bg-violet-500/20" : "bg-indigo-200/50"}`} aria-hidden="true" />
      <div className={`absolute -right-2 bottom-4 h-24 w-24 rounded-full blur-2xl sm:-right-6 sm:bottom-6 sm:h-32 sm:w-32 ${isDark ? "bg-cyan-500/20" : "bg-violet-200/60"}`} aria-hidden="true" />

      <div className={`relative rounded-[24px] border p-3 pb-4 shadow-[0_30px_70px_rgba(15,23,42,0.12)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_40px_120px_rgba(79,70,229,0.3),0_20px_45px_rgba(15,23,42,0.18)] sm:rounded-[32px] sm:p-4 sm:pb-5 ${isDark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white/80"}`}>
        <div className={`rounded-[20px] p-4 shadow-[0_28px_60px_rgba(15,23,42,0.25)] transition-all duration-300 transform-gpu hover:-translate-y-1.5 hover:shadow-[0_42px_120px_rgba(79,70,229,0.35),0_24px_50px_rgba(14,165,233,0.2)] hover:ring-2 hover:ring-indigo-300/50 hover:border hover:border-indigo-200/40 sm:rounded-[30px] sm:p-5 ${isDark ? "border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white hover:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.28),_transparent_42%),linear-gradient(145deg,_#0f172a_0%,_#111827_25%,_#312e81_100%)]" : "border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.9),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(216,180,254,0.75),_transparent_28%),linear-gradient(145deg,_rgba(255,255,255,0.97),_rgba(248,250,252,0.94),_rgba(239,246,255,0.94))] text-slate-800 ring-1 ring-white/60 shadow-[0_20px_48px_rgba(79,70,229,0.12)]"}`}>
          <div className={`flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-indigo-100/80" : "text-indigo-700"}`}>
            <span>Community</span>
            <span className={`rounded-full border px-2 py-1 ${isDark ? "border-white/20 bg-white/5" : "border-indigo-200 bg-indigo-50 text-indigo-700"}`}>
              +
              {communityCount >= 1000 ? (
                <AnimatedMetric value={Number((communityCount / 1000).toFixed(1))} suffix="k" decimals={1} />
              ) : (
                <AnimatedMetric value={communityCount} suffix="" decimals={0} />
              )}
            </span>
          </div>

          <div className="mt-4 flex -space-x-2.5 sm:mt-5">
            {['A', 'K', 'S', 'J'].map((letter, index) => (
              <div
                key={letter}
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-900 text-[11px] font-bold text-white sm:h-10 sm:w-10 sm:text-xs ${['bg-cyan-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500'][index]}`}
              >
                {letter}
              </div>
            ))}
          </div>

          <div className={`mt-4 rounded-2xl p-3 ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(99,102,241,0.24),0_12px_25px_rgba(14,165,233,0.18)] hover:ring-2 hover:ring-indigo-200/60 sm:mt-5 ${isDark ? "bg-white/7 ring-white/10 hover:bg-white/12" : "border border-slate-200/80 bg-white/80 ring-slate-200/80 hover:border-indigo-200 hover:bg-white hover:ring-indigo-200/50"}`}>
            <div className={`flex items-center justify-between text-xs sm:text-sm ${isDark ? "text-slate-200" : "text-slate-600"}`}>
              <span>Career momentum</span>
              <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>+<AnimatedMetric value={68} suffix="%" onUpdate={setMomentumProgress} /></span>
            </div>
            <div className={`mt-3 h-2 overflow-hidden rounded-full ${isDark ? "bg-white/10" : "bg-slate-200"}`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 transition-all duration-300 ease-out"
                style={{ width: `${momentumProgress}%` }}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className={`rounded-2xl p-3 ring-1 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_42px_rgba(99,102,241,0.24),0_12px_26px_rgba(14,165,233,0.18)] hover:ring-2 hover:ring-indigo-200/60 ${isDark ? "bg-white/6 ring-white/10 hover:bg-white/12" : "border border-slate-200/80 bg-white/80 ring-slate-200/80 hover:border-indigo-200 hover:bg-white hover:ring-indigo-200/50"}`}>
              <div className={`text-[10px] uppercase tracking-[0.18em] sm:text-[11px] ${isDark ? "text-slate-300" : "text-slate-500"}`}>Mentors</div>
              <div className={`mt-2 text-xl font-black sm:text-2xl ${isDark ? "text-white" : "text-slate-900"}`}><AnimatedMetric value={mentorCount} suffix="+" /></div>
            </div>
            <div className={`rounded-2xl p-3 ring-1 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_42px_rgba(99,102,241,0.24),0_12px_26px_rgba(14,165,233,0.18)] hover:ring-2 hover:ring-indigo-200/60 ${isDark ? "bg-white/6 ring-white/10 hover:bg-white/12" : "border border-slate-200/80 bg-white/80 ring-slate-200/80 hover:border-indigo-200 hover:bg-white hover:ring-indigo-200/50"}`}>
              <div className={`text-[10px] uppercase tracking-[0.18em] sm:text-[11px] ${isDark ? "text-slate-300" : "text-slate-500"}`}>Projects</div>
              <div className={`mt-2 text-xl font-black sm:text-2xl ${isDark ? "text-white" : "text-slate-900"}`}><AnimatedMetric value={projectCount} suffix="+" /></div>
            </div>
          </div>
        </div>

        <div className={`relative z-10 mt-3 ml-2 mr-2 rounded-[20px] border p-3.5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(79,70,229,0.18),0_12px_30px_rgba(15,23,42,0.12)] hover:border-indigo-200/60 hover:ring-1 hover:ring-indigo-200/40 sm:mt-4 sm:ml-4 sm:mr-3 sm:rounded-[24px] sm:p-4 ${isDark ? "border-slate-700 bg-slate-900/80" : "border-slate-200 bg-white"}`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className={`text-[10px] uppercase tracking-[0.2em] sm:text-[11px] ${isDark ? "text-slate-400" : "text-slate-400"}`}>Top outcome</div>
              <div className={`mt-1 text-base font-black sm:text-lg ${isDark ? "text-white" : "text-slate-900"}`}>Career-ready confidence</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-base text-emerald-700 sm:h-10 sm:w-10 sm:text-lg">
              ✓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
