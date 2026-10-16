import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/config/site";
import youtubeIcon from "@/../assets/images/icons/youtube.png";
import linkedinIcon from "@/../assets/images/icons/linkedin.png";
import instagramIcon from "@/../assets/images/icons/instagram.png";
import telegramIcon from "@/../assets/images/icons/telegram.png";
import discordIcon from "@/../assets/images/icons/discord.png";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-700/70 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_28%),linear-gradient(135deg,_#020817_0%,_#0f172a_45%,_#111827_100%)] text-slate-300 shadow-[inset_0_1px_0_rgba(148,163,184,0.05)]">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 md:py-7">
        <div className="grid grid-cols-2 gap-4 md:gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 text-sm font-black text-white shadow-[0_12px_26px_rgba(99,102,241,0.3)] ring-4 ring-indigo-500/20">C</div>
              <div className="leading-none">
                <div className="text-base font-bold tracking-tight text-white">{SITE.name}</div>
                <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-[10px] sm:tracking-[0.21em]">Build Skills. Lead Futures.</div>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400/90 sm:leading-7">
              Career-focused learning for analysts, builders, and business professionals who want practical skills that translate into real work.
            </p>

            <div className="mt-6 flex items-center gap-3.5">
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-900/70 opacity-90 transition-all duration-200 hover:bg-slate-900/85 hover:opacity-100">
                <Image src={youtubeIcon} alt="YouTube" width={36} height={36} className="h-full w-full rounded-full object-cover" />
              </a>

              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-900/70 opacity-90 transition-all duration-200 hover:bg-slate-900/85 hover:opacity-100">
                <Image src={linkedinIcon} alt="LinkedIn" width={36} height={36} className="h-full w-full rounded-full object-cover" />
              </a>

              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-900/70 opacity-90 transition-all duration-200 hover:bg-slate-900/85 hover:opacity-100">
                <Image src={instagramIcon} alt="Instagram" width={36} height={36} className="h-full w-full rounded-full object-cover scale-[1.25]" />
              </a>

              <a href="https://t.me/" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-900/70 opacity-90 transition-all duration-200 hover:bg-slate-900/85 hover:opacity-100">
                <Image src={telegramIcon} alt="Telegram" width={36} height={36} className="h-full w-full rounded-full object-cover" />
              </a>

              <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-900/70 opacity-90 transition-all duration-200 hover:bg-slate-900/85 hover:opacity-100">
                <Image src={discordIcon} alt="Discord" width={36} height={36} className="h-full w-full rounded-full object-cover scale-[1.28]" />
              </a>

              <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X" className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-900/70 opacity-90 transition-all duration-200 hover:bg-slate-900/85 hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" aria-hidden>
                  <rect width="24" height="24" rx="12" fill="#000000" />
                  <path d="M17.2 4h2.4l-5.3 6.1L20 20h-4.8l-3.8-5.6L7.2 20H4.8l5.7-6.5L4 4h4.9l3.4 5.1L17.2 4Zm-.9 14.2h1.3L8.1 5.7H6.7l9.6 12.5Z" fill="#fff" />
                </svg>
              </a>
            </div>
          </div>

          <nav aria-label="Courses links" className="col-span-1 lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400/85">Courses</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-300/85">
              <li><Link href="/courses/category/software-development?type=live" className="transition-all duration-200 text-slate-300/85 hover:text-indigo-200 hover:opacity-100 opacity-90">Software Development</Link></li>
              <li><Link href="/courses/category/ai-engineering?type=live" className="transition-all duration-200 text-slate-300/85 hover:text-indigo-200 hover:opacity-100 opacity-90">AI Engineering</Link></li>
              <li><Link href="/courses/category/data-analytics?type=live" className="transition-all duration-200 text-slate-300/85 hover:text-indigo-200 hover:opacity-100 opacity-90">Data Analytics</Link></li>
              <li><Link href="/courses/category/data-engineering?type=live" className="transition-all duration-200 text-slate-300/85 hover:text-indigo-200 hover:opacity-100 opacity-90">Data Engineering</Link></li>
              <li><Link href="/courses/category/data-structures-and-algorithms-dsa?type=live" className="transition-all duration-200 text-slate-300/85 hover:text-indigo-200 hover:opacity-100 opacity-90">Data Structures and Algorithms (DSA)</Link></li>
            </ul>
          </nav>

          <div className="col-span-1 -translate-x-2 lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400/85">Services</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-300/85">
              <li><Link href="/mentorship" className="transition-all duration-200 text-slate-300/85 hover:text-indigo-200 hover:opacity-100 opacity-90">1:1 Mentorship</Link></li>
              <li><Link href="/mock-interviews" className="transition-all duration-200 text-slate-300/85 hover:text-indigo-200 hover:opacity-100 opacity-90">Mock Interviews</Link></li>
              <li><Link href="/corporate-training" className="transition-all duration-200 text-slate-300/85 hover:text-indigo-200 hover:opacity-100 opacity-90">Corporate Training</Link></li>
            </ul>
          </div>

          <nav aria-label="Resources links" className="col-span-1 lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400/85">Resources</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-300/85">
              <li><Link href="/resume-analyzer" className="transition-all duration-200 text-slate-300/85 hover:text-indigo-200 hover:opacity-100 opacity-90">Resume Analyzer</Link></li>
              <li><Link href="/tech-blog" className="transition-all duration-200 text-slate-300/85 hover:text-indigo-200 hover:opacity-100 opacity-90">Tech Blog</Link></li>
              <li><Link href="/interview-experiences" className="transition-all duration-200 text-slate-300/85 hover:text-indigo-200 hover:opacity-100 opacity-90">Interview Experiences</Link></li>

            </ul>
          </nav>

          <nav aria-label="Contact us links" className="col-span-1 -translate-x-2 lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400/85">Contact Us</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-300/85">
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-emerald-300/90" aria-hidden>
                  <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.36 2.3.55 3.5.55a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C11.3 21 3 12.7 3 2a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.19 2.4.55 3.5a1 1 0 0 1-.24 1l-2.2 2.2Z"/>
                </svg>
                <a href="tel:+917839649747" className="text-slate-300/85 opacity-90 transition-all duration-200 hover:text-emerald-200 hover:opacity-100">+91-78396 49747</a>
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-sky-300/90" aria-hidden>
                  <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Zm2.1 0 6.9 5.5a1.2 1.2 0 0 0 1.4 0L18.9 7.5H5.1Z" fill="currentColor" />
                </svg>
                <a href="mailto:cogniveacademy@gmail.com" className="text-slate-300/85 opacity-90 transition-all duration-200 hover:text-sky-200 hover:opacity-100">cogniveacademy@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-red-300/90" aria-hidden>
                  <path d="M12 2.75a7.25 7.25 0 0 1 7.25 7.25c0 4.48-5.13 10.77-6.17 11.93a1 1 0 0 1-1.58 0C9.88 20.77 4.75 14.48 4.75 10A7.25 7.25 0 0 1 12 2.75Zm0 4.25a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>
                </svg>
                <a href="https://maps.google.com/?q=Bengaluru+Karnataka+India" target="_blank" rel="noopener noreferrer" className="text-slate-300/85 opacity-90 transition-all duration-200 hover:text-red-200 hover:opacity-100">Bengaluru, Karnataka, India</a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-4 border-t border-slate-700/40 pt-1.5 text-[11px] text-slate-400 sm:mt-4 sm:pt-2 sm:text-[13px] sm:flex sm:items-center sm:justify-between">
          <p className="mb-0 -translate-y-1 sm:translate-y-0">© {SITE.footerYear} {SITE.name}. All rights reserved.</p>

          <div className="mt-1 flex flex-nowrap items-center gap-x-1.5 overflow-x-auto whitespace-nowrap sm:mt-0 sm:gap-x-3">
            <Link href="/terms" className="-translate-y-0.5 sm:translate-y-0 text-slate-400 opacity-90 transition-all duration-200 hover:text-indigo-200 hover:opacity-100">Terms &amp; Conditions</Link>
            <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300/20" aria-hidden="true" />
            <Link href="/privacy" className="-translate-y-0.5 sm:translate-y-0 text-slate-400 opacity-90 transition-all duration-200 hover:text-indigo-200 hover:opacity-100">Privacy Policy</Link>
            <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300/20" aria-hidden="true" />
            <Link href="/refund" className="-translate-y-0.5 sm:translate-y-0 text-slate-400 opacity-90 transition-all duration-200 hover:text-indigo-200 hover:opacity-100">Refund Policy</Link>
            <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300/20" aria-hidden="true" />
            <Link href="/faq" className="-translate-y-0.5 sm:translate-y-0 text-slate-400 opacity-90 transition-all duration-200 hover:text-indigo-200 hover:opacity-100">FAQ&apos;s</Link>
            <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300/20" aria-hidden="true" />
            <Link href="/support" className="-translate-y-0.5 sm:translate-y-0 text-slate-400 opacity-90 transition-all duration-200 hover:text-indigo-200 hover:opacity-100">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
