"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slugifyCategory = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const buildCourseCategoryHref = (category: string, type: "live" | "recorded") =>
  `/courses/category/${slugifyCategory(category)}?type=${type}`;

const mobileNavItems = [
  {
    label: "Courses",
    href: "/courses",
    children: [
      { label: "Software Development", href: buildCourseCategoryHref("Software Development", "live") },
      { label: "AI Engineering", href: buildCourseCategoryHref("AI Engineering", "live") },
      { label: "Data Analytics", href: buildCourseCategoryHref("Data Analytics", "live") },
      { label: "Data Engineering", href: buildCourseCategoryHref("Data Engineering", "live") },
      { label: "Data Structures and Algorithms (DSA)", href: buildCourseCategoryHref("Data Structures and Algorithms (DSA)", "live") },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Resume Analyzer", href: "/resume-analyzer" },
      { label: "Tech Blog", href: "/tech-blog" },
      { label: "Interview Experiences", href: "/interview-experiences" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "1:1 Mentorship", href: "/mentorship" },
      { label: "Mock Interviews", href: "/mock-interviews" },
      { label: "Corporate Training", href: "/corporate-training" },
    ],
  },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

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
            <nav className="flex flex-col gap-2">
              {mobileNavItems.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const isOpenItem = openGroup === item.label;

                return (
                  <div
                    key={item.label}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80"
                  >
                    <div className="flex items-center justify-between gap-3">
                      {hasChildren ? (
                        <button
                          type="button"
                          onClick={() => setOpenGroup((prev) => (prev === item.label ? null : item.label))}
                          className="flex flex-1 items-center justify-between px-3 py-3 text-left text-base font-medium text-slate-800 transition hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-indigo-200"
                        >
                          <span>{item.label}</span>
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={`h-4 w-4 transition-transform duration-200 ${isOpenItem ? "rotate-180" : ""}`}
                          >
                            <path d="M5.25 7.5 10 12.25 14.75 7.5H5.25Z" />
                          </svg>
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="block flex-1 px-3 py-3 text-base font-medium text-slate-800 transition hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-indigo-200"
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>

                    {hasChildren && isOpenItem ? (
                      <div className="border-t border-slate-200 bg-slate-50/80 px-2 py-2 dark:border-slate-800 dark:bg-slate-950/60">
                        <div className="flex flex-col gap-1">
                          {item.children?.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-200"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>

            <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
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
