"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Courses", href: "/courses" },
  { label: "Resources", href: "/resources" },
  { label: "Services", href: "/services" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  // prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100/90 text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 transition hover:bg-slate-200/90 dark:bg-slate-800/80 dark:text-slate-100 dark:ring-slate-700"
      >
        <svg className={`h-5 w-5 transition-transform ${open ? "rotate-90" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          {open ? (
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <g strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </g>
          )}
        </svg>
      </button>

      {open ? (
        <div
          className="fixed top-[4rem] z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-950/95"
          style={{ left: "-8px", right: "-8px", width: "calc(100vw + 16px)", maxWidth: "calc(100vw + 16px)", margin: 0 }}
        >
          <div className="w-full px-4 py-4 sm:px-6" style={{ width: "100%", maxWidth: "100vw", margin: 0 }}>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="group block rounded-xl px-3 py-3 text-base text-slate-800 transition hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-indigo-200"
                >
                  <span className="leading-none">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-3 border-t border-slate-200 pt-4 dark:border-slate-800">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_10px_20px_rgba(99,102,241,0.22)] transition hover:opacity-95"
              >
                LMS Login
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
