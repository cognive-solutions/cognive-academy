"use client";

import React from "react";

type Badge = { text: string; color: string };

const badges: Badge[] = [
  { text: "Django", color: "bg-emerald-950" },
  { text: "React", color: "bg-cyan-400" },
  { text: "Excel", color: "bg-emerald-700" },
  { text: "Tableau", color: "bg-orange-600" },
  { text: "Power BI", color: "bg-amber-400" },
  { text: "ML", color: "bg-purple-600" },
  { text: "AI", color: "bg-fuchsia-600" },
  { text: "SQL", color: "bg-red-600" },
  { text: "Python", color: "bg-blue-600" },
];

export default function HeroShowcase() {
  const [isSmall, setIsSmall] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const update = () => setIsSmall(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  const visibleBadges = badges;
  const badgePadding = isSmall ? "px-1 py-0.5" : "px-4 py-2";
  const badgeRadius = isSmall ? "rounded-md text-[12px]" : "rounded-xl text-[13px]";
  const orbitRadius = isSmall ? 115 : 200;
  const globeCenterY = isSmall ? "56%" : "56%";
  const orbitCenterY = isSmall ? "54%" : "56%";

  return (
    <div className="relative mx-auto flex w-full max-w-[640px] items-center justify-center py-2 sm:py-8">
      <div className={`relative w-full max-w-[640px] ${isSmall ? "h-[230px]" : "h-[360px]"}`}>
        <div className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl animate-[ambientPulse_6s_ease-in-out_infinite] ${isSmall ? "h-[140px] w-[140px]" : "h-[320px] w-[320px]"} dark:bg-indigo-500/15`} style={{ top: globeCenterY }} />

        <div className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center" style={{ top: globeCenterY }}>
          <div className={`relative flex items-center justify-center overflow-hidden rounded-full border border-white/20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.58),_transparent_22%),linear-gradient(135deg,_#4338CA_0%,_#7C3AED_38%,_#4F46E5_70%,_#2563EB_100%)] text-white shadow-[0_0_34px_rgba(124,58,237,0.42),0_18px_42px_rgba(67,56,202,0.3)] transition-all duration-300 animate-[floatSlow_8s_ease-in-out_infinite] dark:border-indigo-200/10 dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_26%),linear-gradient(135deg,_#1E1B4B_0%,_#6D28D9_38%,_#3B82F6_100%)] dark:shadow-[0_0_46px_rgba(124,58,237,0.3),0_20px_46px_rgba(15,23,42,0.56)] ${isSmall ? "h-[120px] w-[120px]" : "h-[220px] w-[220px]"}`}>
            <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-[1px]" />
            <div className={`relative px-2 text-center font-extrabold leading-none ${isSmall ? "text-[12px]" : "text-sm sm:text-2xl"}`}>Skills & Tracks</div>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top: orbitCenterY }}>
          <div className={`${isSmall ? "h-[190px] w-[190px]" : "h-[360px] w-[360px]"}`}>
            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${isSmall ? "animate-[spin_16s_linear_infinite]" : "animate-[spin_20s_linear_infinite]"} motion-reduce:animate-none`} style={{ width: 0, height: 0 }}>
              {visibleBadges.map((b, i) => {
                const deg = (i / visibleBadges.length) * 360 - 90;
                const transform = `rotate(${deg}deg) translateX(${orbitRadius}px) rotate(${-deg}deg)`;

                return (
                  <div key={b.text} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform }}>
                    <div className={`flex items-center gap-1 ${badgeRadius} border border-indigo-200/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.8),rgba(224,231,255,0.7),rgba(99,102,241,0.12))] backdrop-blur-md ${badgePadding} font-semibold text-slate-700 shadow-[0_8px_18px_rgba(79,70,229,0.12)] transform transition-all duration-200 hover:-translate-y-1 hover:scale-105 motion-reduce:animate-none dark:border-indigo-300/20 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.84),rgba(76,29,149,0.7),rgba(37,99,235,0.14))] dark:text-slate-100 dark:shadow-[0_10px_22px_rgba(15,23,42,0.34)] ${isSmall ? "animate-[spin_16s_linear_infinite_reverse]" : "animate-[spin_20s_linear_infinite_reverse]"}`}>
                      <span className={`inline-block ${isSmall ? "h-1.5 w-1.5" : "h-2.5 w-2.5"} rounded-full ${b.color}`} />
                      <span className="leading-tight whitespace-nowrap">{b.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
