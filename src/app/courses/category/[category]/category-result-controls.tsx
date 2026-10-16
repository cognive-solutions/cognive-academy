"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { CourseCard } from "@/components/course-card";
import { PaginationDots } from "@/components/pagination-dots";
import { normalizeCourseLanguage } from "@/lib/course-language";

type CourseSummary = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  description: string | null;
  category: string | null;
  level: string | null;
  price: number | string | null;
  offerPrice?: number | string | null;
  isPromotional?: boolean | null;
  currency: string | null;
  featured: boolean | null;
  isNew: boolean | null;
  imageUrl: string | null;
  instructorName: string | null;
  durationHours: number | null;
  isLive: boolean;
  language: string | null;
  createdAt: Date | string | null;
  modules?: Array<{
    lectures?: Array<{
      durationSeconds?: number | null;
    } | null> | null;
  } | null>;
};

export default function CategoryResultControls({
  liveCourses,
  recordedCourses,
  pageSize,
  currentPage,
  totalPages,
  purchasedCourseIds = new Set<string>(),
}: {
  liveCourses: CourseSummary[];
  recordedCourses: CourseSummary[];
  pageSize: number;
  currentPage: number;
  totalPages: number;
  purchasedCourseIds?: Set<string>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSlideIndex, setMobileSlideIndex] = useState<Record<"live" | "recorded", number>>({
    live: 0,
    recorded: 0,
  });
  const mobileTrackRefs = useRef<Record<"live" | "recorded", HTMLDivElement | null>>({
    live: null,
    recorded: null,
  });
  const mobileTouchStartRef = useRef<Record<"live" | "recorded", { x: number; y: number; scrollLeft: number } | null>>({
    live: null,
    recorded: null,
  });

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 640);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const requestedType = searchParams.get("type") === "recorded" ? "recorded" : "live";
  const [liveLang, setLiveLang] = useState<"en" | "hi">(() => (searchParams.get("liveLang") === "hi" ? "hi" : "en"));
  const [recordedLang, setRecordedLang] = useState<"en" | "hi">(() => (searchParams.get("recordedLang") === "hi" ? "hi" : "en"));

  useEffect(() => {
    setLiveLang(searchParams.get("liveLang") === "hi" ? "hi" : "en");
    setRecordedLang(searchParams.get("recordedLang") === "hi" ? "hi" : "en");
  }, [searchParams]);

  const updateQuery = (nextType: string, nextLang: string, nextPage = 1, targetSection: "live" | "recorded" = nextType as "live" | "recorded") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", nextType);
    params.delete("lang");

    if (targetSection === "live") {
      params.set("liveLang", nextLang);
    } else {
      params.set("recordedLang", nextLang);
    }

    params.set("page", String(nextPage));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const visibleCourses = (requestedType === "recorded" ? recordedCourses : liveCourses).filter((course) => {
    const language = normalizeCourseLanguage(course.language ?? null);
    const activeLang = requestedType === "recorded" ? recordedLang : liveLang;
    return activeLang === "hi" ? language === "hi" : language === "en";
  });

  const safeCurrentPage = Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1;
  const currentResultPage = Math.min(safeCurrentPage, totalPages);
  const paginatedCourses = visibleCourses.slice((currentResultPage - 1) * pageSize, currentResultPage * pageSize);

  const buildPageHref = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", requestedType);
    params.delete("lang");
    if (requestedType === "live") {
      params.set("liveLang", liveLang);
    } else {
      params.set("recordedLang", recordedLang);
    }
    params.set("page", String(nextPage));
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  const liveVisibleCourses = liveCourses.filter((course) => {
    const language = normalizeCourseLanguage(course.language ?? null);
    return liveLang === "hi" ? language === "hi" : language === "en";
  });

  const recordedVisibleCourses = recordedCourses.filter((course) => {
    const language = normalizeCourseLanguage(course.language ?? null);
    return recordedLang === "hi" ? language === "hi" : language === "en";
  });

  const scrollToMobileCard = (type: "live" | "recorded", targetIndex: number) => {
    const track = mobileTrackRefs.current[type];
    if (!track || !isMobile) return;

    const slides = Array.from(track.querySelectorAll<HTMLElement>("[data-course-slide='true']"));
    if (!slides.length) return;

    const clampedIndex = Math.max(0, Math.min(targetIndex, slides.length - 1));
    const targetCard = slides[clampedIndex];
    const startLeft = track.scrollLeft;
    const endLeft = Math.max(0, targetCard.offsetLeft - 12);
    const startTime = performance.now();
    const duration = 320;

    const tick = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      track.scrollLeft = startLeft + (endLeft - startLeft) * eased;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const handleMobileTrackTouchStart = (type: "live" | "recorded", event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    const track = mobileTrackRefs.current[type];
    if (!touch || !track) return;

    mobileTouchStartRef.current[type] = {
      x: touch.clientX,
      y: touch.clientY,
      scrollLeft: track.scrollLeft,
    };
  };

  const handleMobileTrackTouchMove = (type: "live" | "recorded", event: React.TouchEvent<HTMLDivElement>) => {
    const start = mobileTouchStartRef.current[type];
    const track = mobileTrackRefs.current[type];
    if (!start || !track) return;

    const touch = event.touches[0];
    if (!touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
      event.preventDefault();
      track.scrollLeft = start.scrollLeft - deltaX;
    }
  };

  const handleMobileTrackTouchEnd = (type: "live" | "recorded", event: React.TouchEvent<HTMLDivElement>) => {
    const start = mobileTouchStartRef.current[type];
    if (!start) return;

    const touch = event.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      setMobileSlideIndex((previous) => {
        const currentIndex = previous[type];
        const maxIndex = Math.max(0, (type === "live" ? liveVisibleCourses.length : recordedVisibleCourses.length) - 1);
        const nextIndex = deltaX < 0
          ? Math.min(currentIndex + 1, maxIndex)
          : Math.max(currentIndex - 1, 0);

        scrollToMobileCard(type, nextIndex);
        return { ...previous, [type]: nextIndex };
      });
    } else {
      setMobileSlideIndex((previous) => {
        const currentIndex = previous[type];
        scrollToMobileCard(type, currentIndex);
        return previous;
      });
    }

    mobileTouchStartRef.current[type] = null;
  };

  useEffect(() => {
    if (!isMobile) return;

    const timers = (['live', 'recorded'] as const).map((type) => {
      const totalSlides = type === "live" ? liveVisibleCourses.length : recordedVisibleCourses.length;
      if (totalSlides <= 1) return null;

      return window.setInterval(() => {
        setMobileSlideIndex((previous) => {
          const nextIndex = (previous[type] + 1) % totalSlides;
          scrollToMobileCard(type, nextIndex);
          return {
            ...previous,
            [type]: nextIndex,
          };
        });
      }, 4200);
    });

    return () => {
      timers.forEach((timer) => {
        if (timer) window.clearInterval(timer);
      });
    };
  }, [isMobile, liveVisibleCourses.length, recordedVisibleCourses.length, liveLang, recordedLang]);

  const renderCourseSection = ({
    type,
    title,
    subtitle,
    courses,
  }: {
    type: "live" | "recorded";
    title: string;
    subtitle: string;
    courses: CourseSummary[];
  }) => {
    const sectionIsLive = type === "live";
    const sectionIsActive = requestedType === type;
    const sectionPage = requestedType === type ? currentResultPage : 1;
    const totalSectionPages = isMobile ? Math.max(1, courses.length) : Math.max(1, Math.ceil(courses.length / pageSize));
    const safeSectionPage = Math.min(Math.max(1, sectionPage), totalSectionPages);
    const paginatedCourses = isMobile ? courses : courses.slice((safeSectionPage - 1) * pageSize, safeSectionPage * pageSize);
    const activeMobilePage = isMobile ? mobileSlideIndex[type] : safeSectionPage - 1;

    return (
      <section
        id={sectionIsLive ? "live-courses" : "recorded-courses"}
        className={`rounded-[30px] border p-4 shadow-[0_26px_64px_rgba(15,23,42,0.08)] backdrop-blur-md sm:p-6 transition-all duration-200 ${
          sectionIsLive
            ? "border-indigo-100/80 bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.7),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(216,180,254,0.58),_transparent_30%),linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(239,246,255,0.94),_rgba(238,242,255,0.9))] dark:border-indigo-500/20 dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_26%),linear-gradient(180deg,_rgba(11,17,28,0.98),_rgba(13,20,35,0.96))] dark:shadow-[0_26px_64px_rgba(2,6,23,0.34)]"
            : "border-violet-100/80 bg-[radial-gradient(circle_at_top_left,_rgba(216,180,254,0.72),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(147,197,253,0.7),_transparent_30%),linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(245,243,255,0.96),_rgba(239,246,255,0.95))] dark:border-violet-500/20 dark:bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.2),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.2),_transparent_26%),linear-gradient(180deg,_rgba(11,17,28,0.98),_rgba(13,20,35,0.96))] dark:shadow-[0_26px_64px_rgba(2,6,23,0.34)]"
        } ${sectionIsActive ? "ring-2 ring-indigo-300/80 ring-offset-2 ring-offset-white dark:ring-indigo-500/60 dark:ring-offset-slate-950" : ""}`}
      >
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                sectionIsLive
                  ? "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                  : "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  sectionIsLive
                    ? "animate-pulse bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.75)] dark:bg-emerald-400"
                    : "bg-slate-500 dark:bg-slate-300"
                }`}
              />
              {sectionIsLive ? "Live cohort" : "Recorded track"}
            </span>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-slate-900 dark:text-white sm:text-3xl">
              {title}
            </h2>
          </div>

          <div className="flex w-full items-center justify-end gap-2 md:w-auto">
            <div className="inline-flex w-full max-w-full items-center gap-2 rounded-full border border-slate-200/80 bg-slate-100/85 p-1 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/70 md:w-auto">
              {languageTabs.map((option) => {
                const active = (type === "live" ? liveLang : recordedLang) === option.value;
                return (
                  <button
                    key={`${type}-${option.value}`}
                    type="button"
                    onClick={() => {
                      if (type === "live") {
                        setLiveLang(option.value as "en" | "hi");
                      } else {
                        setRecordedLang(option.value as "en" | "hi");
                      }
                      updateQuery(type, option.value, 1, type);
                    }}
                    className={`flex-1 rounded-full border px-4 py-1.5 text-center text-sm font-semibold transition-all duration-200 ease-out md:flex-none ${
                      active
                        ? "border-indigo-300 bg-white/90 text-slate-900 shadow-[0_0_0_1px_rgba(165,180,252,0.7),0_10px_24px_rgba(79,70,229,0.18)] ring-1 ring-indigo-200/80 backdrop-blur-md dark:border-indigo-400/60 dark:bg-slate-800/90 dark:text-white dark:shadow-[0_0_0_1px_rgba(165,180,252,0.4),0_10px_26px_rgba(79,70,229,0.28)] dark:ring-indigo-500/35"
                        : "border-slate-200 bg-transparent text-slate-600 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white/70 hover:text-slate-900 hover:shadow-[0_6px_18px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-slate-800/70 dark:hover:text-white dark:hover:shadow-[0_8px_22px_rgba(15,23,42,0.3)]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mb-4 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p>

        {courses.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
            No {type} courses available in this track yet.
          </div>
        ) : (
          <>
            <div
              ref={(node) => {
                mobileTrackRefs.current[type] = node;
              }}
              className={
                isMobile
                  ? "-mx-1 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pl-1 pr-1 [scrollbar-width:none] [scroll-behavior:smooth] [&::-webkit-scrollbar]:hidden"
                  : "mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
              }
              style={isMobile ? { touchAction: "pan-y", WebkitOverflowScrolling: "touch" } : undefined}
              onTouchStart={isMobile ? (event) => handleMobileTrackTouchStart(type, event) : undefined}
              onTouchMove={isMobile ? (event) => handleMobileTrackTouchMove(type, event) : undefined}
              onTouchEnd={isMobile ? (event) => handleMobileTrackTouchEnd(type, event) : undefined}
            >
              {paginatedCourses.map((course, index) => {
                const isPurchased = purchasedCourseIds.has(course.id);
                const detailHref = isPurchased
                  ? course.isLive
                    ? `/courses/${course.slug}/live`
                    : `/courses/${course.slug}/self-paced`
                  : `/courses/${course.slug}`;

                return (
                  <div
                    key={course.id}
                    data-course-slide={isMobile ? "true" : "false"}
                    className={isMobile ? "min-w-full snap-center pr-1" : ""}
                    style={isMobile ? { width: "100%" } : undefined}
                  >
                    <CourseCard
                      course={course}
                      statusLabel={course.isLive ? "Live" : "Recorded"}
                      statusTone={course.isLive ? "live" : "recorded"}
                      showFeaturedBadge={Boolean(course.featured)}
                      action={
                        <Link
                          href={detailHref}
                          onClick={(event) => {
                            event.preventDefault();
                            router.push(detailHref);
                          }}
                          className={`inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(13,148,136,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(13,148,136,0.36)] hover:ring-2 hover:ring-emerald-200/60 ${isPurchased ? "bg-gradient-to-r from-teal-400 via-cyan-500 to-emerald-500" : "bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500"}`}
                        >
                          {isPurchased ? "Continue learning" : "View course"}
                        </Link>
                      }
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pb-1">
              <PaginationDots
                className="mt-2 flex items-center justify-center gap-2 pt-1"
                currentPage={activeMobilePage}
                totalPages={totalSectionPages}
                showSinglePage={true}
                onPageChange={(page) => {
                  if (isMobile) {
                    setMobileSlideIndex((previous) => ({ ...previous, [type]: page }));
                    scrollToMobileCard(type, page);
                    return;
                  }

                  const nextPage = page + 1;
                  router.replace(buildPageHref(nextPage), { scroll: false });
                }}
                onPrevious={() => {
                  if (isMobile) {
                    setMobileSlideIndex((previous) => {
                      const nextIndex = Math.max(0, previous[type] - 1);
                      scrollToMobileCard(type, nextIndex);
                      return { ...previous, [type]: nextIndex };
                    });
                    return;
                  }

                  if (safeSectionPage > 1) {
                    router.replace(buildPageHref(safeSectionPage - 1), { scroll: false });
                  }
                }}
                onNext={() => {
                  if (isMobile) {
                    setMobileSlideIndex((previous) => {
                      const nextIndex = Math.min(totalSectionPages - 1, previous[type] + 1);
                      scrollToMobileCard(type, nextIndex);
                      return { ...previous, [type]: nextIndex };
                    });
                    return;
                  }

                  if (safeSectionPage < totalSectionPages) {
                    router.replace(buildPageHref(safeSectionPage + 1), { scroll: false });
                  }
                }}
              />
            </div>
          </>
        )}
      </section>
    );
  };

  const languageTabs = [
    { label: "English", value: "en" },
    { label: "Hindi", value: "hi" },
  ];

  return (
    <div className="mt-6 mx-auto w-full max-w-6xl space-y-6">
      {renderCourseSection({
        type: "live",
        title: "Live cohort programs",
        subtitle: "Instructor-led sessions with live feedback, deadlines, and cohort momentum.",
        courses: liveVisibleCourses,
      })}

      {renderCourseSection({
        type: "recorded",
        title: "Recorded learning paths",
        subtitle: "Flexible, self-paced cohorts built for independent learning and revision.",
        courses: recordedVisibleCourses,
      })}
    </div>
  );
}
