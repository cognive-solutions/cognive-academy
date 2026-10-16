import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TESTIMONIALS } from "@/data/testimonials";
import { SITE } from "@/config/site";
import HeroShowcase from "@/app/home/components/hero-showcase";
import LiveSection from "@/app/home/components/live-section";
import RecordedSection from "@/app/home/components/recorded-section";
import TestimonialsCarousel from "@/app/home/components/testimonials-carousel";
import AnimatedTyping from "@/components/animated-typing";
import { AnimatedStatCard } from "@/components/animated-stat-card";
import { BackToTopButton } from "@/components/back-to-top";
import { HomeUserGreeting } from "@/components/home-user-greeting";

export const revalidate = 300;

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}) {
  // Header handles auth state; homepage does not need session here.
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const activeQuery = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q.trim().toLowerCase() : "";
  const activeCategory = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : "All";

  let databaseWarning: string | null = null;
  let courses: any[] = [];
  let savedCourseIds: string[] = [];
  let purchasedCourseIds = new Set<string>();
  let registeredStudentCount = 0;
  let activeLearnerCount = 0;
  let publishedCourseCount = 0;

  try {
    courses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        shortDescription: true,
        description: true,
        category: true,
        level: true,
        price: true,
        offerPrice: true,
        isPromotional: true,
        isBestValue: true,
        promoCode: true,
        currency: true,
        featured: true,
        isNew: true,
        imageUrl: true,
        instructorName: true,
        instructorTitle: true,
        previewLectureUrl: true,
        durationHours: true,
        isPublished: true,
        isLive: true,
        language: true,
        createdAt: true,
        modules: {
          select: {
            lectures: {
              select: {
                durationSeconds: true,
              },
            },
          },
        },
      },
    });

    const session = await auth();
    savedCourseIds = session?.user?.id
      ? (await prisma.savedCourse.findMany({
          where: { userId: session.user.id },
          select: { courseId: true },
        })).map((savedCourse) => savedCourse.courseId)
      : [];
    purchasedCourseIds = session?.user?.id
      ? new Set(
          (await prisma.enrollment.findMany({
            where: { userId: session.user.id },
            select: { courseId: true },
          })).map((enrollment) => enrollment.courseId),
        )
      : new Set<string>();

    registeredStudentCount = await prisma.user.count({
      where: {
        role: "STUDENT",
      },
    });

    activeLearnerCount = await prisma.user.count({
      where: {
        role: "STUDENT",
        isActive: true,
      },
    });

    publishedCourseCount = await prisma.course.count({
      where: { isPublished: true },
    });
  } catch (error) {
    console.error("Home page database query failed:", error);
    databaseWarning = "The course catalog is temporarily unavailable because the connected Prisma database is restricted. Please try again shortly.";
  }

  const displayedCourses = [...courses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const featured = displayedCourses[0];
  const heroSequence = displayedCourses.slice(0, 5);

  const formatCategory = (value?: string | null) => {
    const raw = value?.trim();
    if (!raw) return "General";

    const normalized = raw.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
    const key = normalized.toLowerCase();

    const overrides: Record<string, string> = {
      "powr bi": "Power BI",
      "power bi": "Power BI",
      "python": "Python",
      "sql": "SQL",
      "excel": "Excel",
      "react": "React",
      "django": "Django",
      "git": "Git",
      "mysql": "MySQL",
    };

    if (overrides[key]) return overrides[key];

    return normalized
      .split(" ")
      .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : ""))
      .join(" ");
  };

  const categoryFilters = Array.from(
    new Set(displayedCourses.map((course) => formatCategory(course.category)))
  );

  const filteredCourses = displayedCourses.filter((course) => {
    const courseCategory = formatCategory(course.category);
    const searchableText = [
      course.title,
      course.shortDescription ?? "",
      course.description ?? "",
      courseCategory,
      course.level,
    ]
      .join(" ")
      .toLowerCase();

    const matchesQuery = !activeQuery || searchableText.includes(activeQuery);
    const matchesCategory = activeCategory === "All" || courseCategory === activeCategory;

    return matchesQuery && matchesCategory;
  });

  const getCuratedSectionCourses = (isLiveOnly: boolean) => {
    const sectionCourses = filteredCourses.filter((course) => Boolean(course.isLive) === isLiveOnly);
    const maxSectionCourses = 8;
    return sectionCourses.length ? sectionCourses.slice(0, maxSectionCourses) : filteredCourses.slice(0, maxSectionCourses);
  };

  const curatedLiveCourses = getCuratedSectionCourses(true);
  const curatedRecordedCourses = getCuratedSectionCourses(false);

  return (
    <main id="main" className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <BackToTopButton />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(147,197,253,0.35),_transparent_36%),linear-gradient(135deg,_#dfeffc_0%,_#f2ebff_100%)] min-h-[calc(100vh-5rem)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.24),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_35%),linear-gradient(135deg,_#020817_0%,_#0f172a_40%,_#111827_100%)]">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-12 pt-8 sm:gap-10 sm:px-6 sm:pb-16 sm:pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:pb-20 lg:pt-16">
          <div className="max-w-2xl h-full flex flex-col justify-center gap-4 sm:gap-6">
            <span className="inline-flex w-fit whitespace-nowrap rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-indigo-700 sm:px-3 sm:text-[11px] dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200">
              {SITE.heroBadgeText}
            </span>

            <div className="self-start">
              <HomeUserGreeting />
            </div>

            {databaseWarning ? (
              <div className="mt-3 rounded-2xl border border-amber-300/80 bg-amber-50 px-4 py-3 text-left shadow-sm dark:border-amber-500/40 dark:bg-amber-500/10">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-200">Temporary issue</div>
                <p className="mt-1 text-sm font-medium text-amber-900 dark:text-amber-100">{databaseWarning}</p>
              </div>
            ) : null}

            <h1 className="mt-2 mb-2 text-[2.25rem] font-black leading-[0.94] tracking-[-0.06em] text-slate-900 sm:mt-4 sm:mb-4 sm:text-5xl sm:leading-[1.02] lg:text-6xl dark:text-white">
              <span className="block">Build Real Skills and</span>
              <span className="block">Launch Your Career</span>
              <span className="mt-2 block text-slate-800 dark:text-slate-200">With <AnimatedTyping text={SITE.animatedTyping} className={"bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500"} cursorClassName={"text-indigo-600"} /></span>
            </h1>

            <div className="mt-3 flex flex-col items-start gap-3 sm:mt-8 sm:flex-row sm:items-center">
              <div className="flex -space-x-2">
                {['A', 'K', 'S', 'J'].map((letter, index) => (
                  <div
                    key={letter}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white sm:h-11 sm:w-11 sm:text-xs ${
                      ['bg-cyan-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500'][index]
                    } dark:border-slate-900`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                <div className="text-base font-bold text-slate-900 sm:text-lg dark:text-white">Join our learner community</div>
                <div className="text-xs text-slate-600 sm:text-sm dark:text-slate-400">Students building practical skills and landing stronger roles</div>
              </div>
            </div>

            <div className="mt-4 flex w-full flex-row flex-wrap items-center gap-3 sm:mt-8 sm:w-auto">
              <Link href="/courses#course-results" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(99,102,241,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-[0_18px_34px_rgba(99,102,241,0.32)] sm:flex-none sm:px-6 sm:py-3.5 dark:shadow-[0_14px_30px_rgba(99,102,241,0.4)]">
                Explore courses
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 0 1 0-1.06L10.94 8H6.5a.75.75 0 0 1 0-1.5h7.25a.75.75 0 0 1 .75.75v7.25a.75.75 0 0 1-1.5 0V9.06l-5.72 5.72a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="/contact-us#contact-form" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-md sm:flex-none sm:px-6 sm:py-3.5 dark:border-indigo-500/30 dark:bg-slate-900 dark:text-indigo-200 dark:hover:bg-slate-800">
                Book a free call
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 0 1 0-1.06L10.94 8H6.5a.75.75 0 0 1 0-1.5h7.25a.75.75 0 0 1 .75.75v7.25a.75.75 0 0 1-1.5 0V9.06l-5.72 5.72a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

          <div>
            <HeroShowcase />
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-14">
          <div className="grid grid-cols-2 gap-3 rounded-[28px] border border-slate-200 bg-white/80 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:gap-4 sm:p-4 md:grid-cols-4 dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-[0_18px_40px_rgba(15,23,42,0.4)]">
            {[
              { value: registeredStudentCount, suffix: "+", label: "Learners across the countries" },
              { value: publishedCourseCount, suffix: "+", label: "Courses" },
              { value: activeLearnerCount, suffix: "+", label: "Active Learners" },
              { value: 4.9, suffix: "/5", label: "Average course rating" },
            ].map((item) => (
              <AnimatedStatCard
                key={item.label}
                value={item.value}
                suffix={item.suffix}
                label={item.label}
              />
            ))}
          </div>
        </div>
      </section>

      <div id="courses">
        <section id="live-courses" className="scroll-mt-28 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Live Classroom</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">Join Live Classroom Courses</h2>
          </div>
          <div>
            <LiveSection courses={curatedLiveCourses} purchasedCourseIds={purchasedCourseIds} savedCourseIds={savedCourseIds} />
          </div>
        </section>

        <section id="recorded-courses" className="scroll-mt-28 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Recorded</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">Recorded & Self-Paced Courses</h2>
          </div>

          <div>
            <RecordedSection courses={curatedRecordedCourses} purchasedCourseIds={purchasedCourseIds} savedCourseIds={savedCourseIds} />
          </div>
        </section>
      </div>

      <section className="bg-slate-50 py-12 text-slate-900 sm:py-16 dark:bg-slate-900 dark:text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">How it works</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">A simple path from learning to career momentum.</h2>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-[0_20px_42px_rgba(99,102,241,0.12)] sm:p-6 dark:border-slate-700 dark:bg-slate-800/80 dark:shadow-[0_18px_40px_rgba(15,23,42,0.25)] dark:hover:border-indigo-400 dark:hover:shadow-[0_20px_50px_rgba(99,102,241,0.18)]">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-black text-white sm:mb-5 sm:h-11 sm:w-11">01</div>
              <h3 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">Choose your track</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Start with a guided course path in data analytics, Python, SQL, or Power BI that fits your goals.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-[0_20px_42px_rgba(99,102,241,0.12)] sm:p-6 dark:border-slate-700 dark:bg-slate-800/80 dark:shadow-[0_18px_40px_rgba(15,23,42,0.25)] dark:hover:border-indigo-400 dark:hover:shadow-[0_20px_50px_rgba(99,102,241,0.18)]">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-500 text-sm font-black text-white sm:mb-5 sm:h-11 sm:w-11">02</div>
              <h3 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">Learn with support</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Follow structured lessons, get practical feedback, and stay on track with the right mentor guidance.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-[0_20px_42px_rgba(99,102,241,0.12)] sm:p-6 dark:border-slate-700 dark:bg-slate-800/80 dark:shadow-[0_18px_40px_rgba(15,23,42,0.25)] dark:hover:border-indigo-400 dark:hover:shadow-[0_20px_50px_rgba(99,102,241,0.18)]">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-black text-white sm:mb-5 sm:h-11 sm:w-11">03</div>
              <h3 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">Practice &amp; grow</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Build confidence with mock interviews, portfolio support, and career-focused resources that translate into outcomes.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-28 bg-slate-50 py-12 dark:bg-slate-950/80 dark:text-slate-100 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Services</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">Support designed around your growth.</h2>
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-[0_20px_42px_rgba(99,102,241,0.12)] hover:bg-gradient-to-br hover:from-white hover:to-indigo-50 sm:p-6 dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-[0_18px_40px_rgba(2,6,23,0.45)] dark:hover:border-indigo-500/40 dark:hover:bg-gradient-to-br dark:hover:from-slate-900 dark:hover:to-indigo-950/60">
              <h3 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">1:1 Mentorship</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Personal guidance for your career path, learning plan, and technical bottlenecks.</p>
              <div className="mt-5">
                <Link href="/mentorship" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-white">
                  Book a mentor call <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-[0_20px_42px_rgba(99,102,241,0.12)] hover:bg-gradient-to-br hover:from-white hover:to-indigo-50 sm:p-6 dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-[0_18px_40px_rgba(2,6,23,0.45)] dark:hover:border-indigo-500/40 dark:hover:bg-gradient-to-br dark:hover:from-slate-900 dark:hover:to-indigo-950/60">
              <h3 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">Mock Interviews</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Practice the exact interview flow for data, analytics, and product-focused roles.</p>
              <div className="mt-5">
                <Link href="/mock-interviews" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-white">
                  Start mock prep <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-[0_20px_42px_rgba(99,102,241,0.12)] hover:bg-gradient-to-br hover:from-white hover:to-indigo-50 sm:p-6 dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-[0_18px_40px_rgba(2,6,23,0.45)] dark:hover:border-indigo-500/40 dark:hover:bg-gradient-to-br dark:hover:from-slate-900 dark:hover:to-indigo-950/60">
              <h3 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">Corporate Training</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Upskill teams with practical learning paths built for business and technical growth.</p>
              <div className="mt-5">
                <Link href="/corporate-training" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-white">
                  Explore training <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="resources" className="scroll-mt-28 mx-auto max-w-6xl px-4 py-12 dark:text-slate-100 sm:px-6 sm:py-16">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Resources</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">Career-ready learning resources.</h2>
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-[0_20px_42px_rgba(99,102,241,0.12)] hover:bg-gradient-to-br hover:from-white hover:to-indigo-50 sm:p-6 dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-[0_18px_40px_rgba(2,6,23,0.45)] dark:hover:border-indigo-500/40 dark:hover:bg-gradient-to-br dark:hover:from-slate-900 dark:hover:to-indigo-950/60">
            <h3 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">Resume Analyzer</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Check your resume for clarity, relevance, and stronger role-specific positioning.</p>
            <div className="mt-5">
              <Link href="/resume-analyzer" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-white">
                Try it now <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-[0_20px_42px_rgba(99,102,241,0.12)] hover:bg-gradient-to-br hover:from-white hover:to-indigo-50 sm:p-6 dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-[0_18px_40px_rgba(2,6,23,0.45)] dark:hover:border-indigo-500/40 dark:hover:bg-gradient-to-br dark:hover:from-slate-900 dark:hover:to-indigo-950/60">
            <h3 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">Tech Blog</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Insights on data careers, tools, learning strategy, and practical industry trends.</p>
            <div className="mt-5">
              <Link href="/tech-blog" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-white">
                Read insights <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-[0_20px_42px_rgba(99,102,241,0.12)] hover:bg-gradient-to-br hover:from-white hover:to-indigo-50 sm:p-6 dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-[0_18px_40px_rgba(2,6,23,0.45)] dark:hover:border-indigo-500/40 dark:hover:bg-gradient-to-br dark:hover:from-slate-900 dark:hover:to-indigo-950/60">
            <h3 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">Interview Experiences</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Real stories, questions, and breakdowns from successful learner interview journeys.</p>
            <div className="mt-5">
              <Link href="/interview-experiences" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-white">
                See interview stories <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="success-stories" className="scroll-mt-28 mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Success stories</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">What learners say</h2>
        </div>
        <div className="mt-8">
          <TestimonialsCarousel items={TESTIMONIALS} />
        </div>
      </section>

      <section id="about-us" className="bg-slate-50 py-12 text-slate-900 sm:py-20 dark:bg-slate-900 dark:text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Why learners choose us</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">A learning experience built for momentum.</h2>
          </div>
          <div className="rounded-2xl bg-white/70 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.04)] ring-1 ring-slate-200 sm:p-4 md:p-6 dark:bg-slate-800/80 dark:shadow-[0_18px_40px_rgba(15,23,42,0.25)] dark:ring-slate-700">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              <article className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:bg-indigo-50/70 hover:shadow-[0_20px_42px_rgba(99,102,241,0.12)] sm:p-6 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-400 dark:hover:bg-slate-800/90 dark:hover:shadow-[0_18px_40px_rgba(99,102,241,0.18)]" aria-label="Expert instructors and curriculum">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white sm:mb-5 sm:h-12 sm:w-12" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 sm:h-5 sm:w-5">
                    <path d="M12 3v18M3 12h18" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">Industry-led curriculum</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">Courses designed and taught by practitioners — focused on projects you can show employers.</p>
                <div className="mt-auto">
                  <Link href="/courses#course-results" className="mt-5 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-white">Explore courses →</Link>
                </div>
              </article>

              <article className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:bg-indigo-50/70 hover:shadow-[0_20px_42px_rgba(99,102,241,0.12)] sm:p-6 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-400 dark:hover:bg-slate-800/90 dark:hover:shadow-[0_18px_40px_rgba(99,102,241,0.18)]" aria-label="Mentoring and portfolio support">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white sm:mb-5 sm:h-12 sm:w-12" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 sm:h-5 sm:w-5">
                    <path d="M8 10a4 4 0 1 1 8 0v1.5a1.5 1.5 0 0 1-1.5 1.5H9.5A1.5 1.5 0 0 1 8 11.5V10ZM6 18c1.2-1.8 3.3-2.5 6-2.5s4.8.7 6 2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">Mentors &amp; practical feedback</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">Weekly mentor office hours, portfolio reviews, and actionable feedback on your projects.</p>
                <div className="mt-auto">
                  <Link href="/mentorship" className="mt-5 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-white">Meet the mentors →</Link>
                </div>
              </article>

              <article className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:bg-indigo-50/70 hover:shadow-[0_20px_42px_rgba(99,102,241,0.12)] sm:p-6 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-400 dark:hover:bg-slate-800/90 dark:hover:shadow-[0_18px_40px_rgba(99,102,241,0.18)]" aria-label="Fast skill progress and outcomes">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white sm:mb-5 sm:h-12 sm:w-12" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 sm:h-5 sm:w-5">
                    <path d="M5 18V6M12 18V10M19 18V4" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">Fast, measurable progress</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">Structured lessons, hands-on work, and clear milestones to keep you progressing quickly.</p>
                <div className="mt-auto">
                  <Link href="/success-stories" className="mt-5 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-white">See outcomes →</Link>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-center sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:text-left lg:py-12">
          <div className="group w-full min-h-[220px] rounded-[30px] bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 p-5 shadow-[0_24px_60px_rgba(79,70,229,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(79,70,229,0.42)] sm:p-8 md:p-10 dark:shadow-[0_24px_70px_rgba(99,102,241,0.35)] dark:hover:shadow-[0_30px_70px_rgba(99,102,241,0.45)] lg:min-h-[250px]" role="region" aria-label="Get started call to action">
            <div className="flex h-full flex-col items-center justify-between gap-5 sm:flex-row">
              <div className="max-w-xl text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-100 sm:text-sm">Ready to start?</p>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-[2.5rem] lg:leading-tight">Turn learning into a career — start today.</h2>
                <p className="mt-2 text-sm text-indigo-100/90">Skip the forms — chat with our team or create an account to get started quickly.</p>
              </div>

              <div className="flex w-full shrink-0 items-center justify-center gap-3 sm:w-auto sm:justify-end">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 sm:px-6">Create account</Link>
                <Link href="/contact-us#contact-form" className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 sm:px-6">Request a callback</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
