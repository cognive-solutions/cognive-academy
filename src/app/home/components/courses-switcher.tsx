"use client"

import React, { useState } from "react";

type Props = {
  leftLabel?: string;
  rightLabel?: string;
  leftValue?: string;
  rightValue?: string;
  onChange?: (value: string) => void;
};

export default function CoursesSwitcher({
  leftLabel = "Live",
  rightLabel = "Recorded",
  leftValue = "live",
  rightValue = "recorded",
  onChange,
}: Props) {
  const [value, setValue] = useState<string>(leftValue);

  const setLeft = () => {
    setValue(leftValue);
    onChange?.(leftValue);
  };

  const setRight = () => {
    setValue(rightValue);
    onChange?.(rightValue);
  };

  return (
    <div className="inline-flex w-full max-w-full items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-slate-100/85 p-1 backdrop-blur-sm sm:w-auto sm:justify-end dark:border-slate-700 dark:bg-slate-900/70">
      <button
        onClick={setLeft}
        className={`flex-1 rounded-full border px-3 py-1.5 text-center text-xs font-semibold transition-all duration-200 ease-out sm:flex-none sm:px-4 sm:text-sm ${value === leftValue ? "border-indigo-200 bg-white/80 text-slate-900 shadow-[0_8px_22px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/80 backdrop-blur-md dark:border-indigo-500/40 dark:bg-slate-800/80 dark:text-white dark:shadow-[0_10px_26px_rgba(15,23,42,0.42)] dark:ring-slate-700/90" : "border-slate-200 bg-transparent text-slate-600 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white/70 hover:text-slate-900 hover:shadow-[0_6px_18px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-slate-800/70 dark:hover:text-white dark:hover:shadow-[0_8px_22px_rgba(15,23,42,0.3)]"}`}
        aria-pressed={value === leftValue}
        aria-label={`Show ${leftLabel} courses`}
      >
        {leftLabel}
      </button>

      <button
        onClick={setRight}
        className={`flex-1 rounded-full border px-3 py-1.5 text-center text-xs font-semibold transition-all duration-200 ease-out sm:flex-none sm:px-4 sm:text-sm ${value === rightValue ? "border-indigo-200 bg-white/80 text-slate-900 shadow-[0_8px_22px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/80 backdrop-blur-md dark:border-indigo-500/40 dark:bg-slate-800/80 dark:text-white dark:shadow-[0_10px_26px_rgba(15,23,42,0.42)] dark:ring-slate-700/90" : "border-slate-200 bg-transparent text-slate-600 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white/70 hover:text-slate-900 hover:shadow-[0_6px_18px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-slate-800/70 dark:hover:text-white dark:hover:shadow-[0_8px_22px_rgba(15,23,42,0.3)]"}`}
        aria-pressed={value === rightValue}
        aria-label={`Show ${rightLabel} courses`}
      >
        {rightLabel}
      </button>
    </div>
  );
}
