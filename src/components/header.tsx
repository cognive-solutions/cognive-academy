"use client";

"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { SiteNav } from "@/components/site-nav";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import MobileMenu from "./mobile-menu";

export default function Header() {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user?.id);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-2 sm:h-20 sm:gap-3">
          <Link href="/" className="flex items-center gap-2 self-center leading-none sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 text-xs font-black text-white shadow-[0_8px_16px_rgba(99,102,241,0.25)] ring-2 ring-indigo-100/80 dark:shadow-[0_0_0_rgba(0,0,0,0)] dark:ring-0 sm:h-10 sm:w-10 sm:text-sm">C</div>
            <div className="flex flex-col justify-center leading-none">
              <div className="text-base font-black tracking-tight text-slate-900 whitespace-nowrap dark:text-slate-50 sm:text-xl">Cognive Academy</div>
              <div className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 sm:mt-1 sm:text-[10px] sm:tracking-[0.22em]">Build Skills. Lead Futures.</div>
            </div>
          </Link>

          <div className="hidden flex-1 items-center justify-center md:flex md:translate-y-1 md:pl-4">
            <SiteNav />
          </div>

          <div className="ml-auto flex items-center gap-2 self-center sm:mr-4 sm:gap-3 md:translate-y-1 md:gap-5">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            {isLoggedIn ? (
              <div className="hidden sm:block">
                <UserMenu />
              </div>
            ) : (
              <div className="hidden md:block">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(99,102,241,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(99,102,241,0.32)] hover:brightness-110 focus-visible:ring-4 focus-visible:ring-indigo-200 leading-none"
                >
                  LMS Login
                </Link>
              </div>
            )}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              {isLoggedIn ? <UserMenu compact /> : null}
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
