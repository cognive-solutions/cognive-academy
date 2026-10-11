"use client"

import React, { useState, useMemo } from "react";
import { normalizeCourseLanguage } from "@/lib/course-language";
import CoursesSwitcher from "./courses-switcher";
import RecordedCoursesCarousel from "./recorded-courses-carousel";

type Course = any;

export default function RecordedSection({
  courses,
  purchasedCourseIds = new Set<string>(),
  savedCourseIds = [],
}: {
  courses: Course[];
  purchasedCourseIds?: Set<string>;
  savedCourseIds?: string[];
}) {
  const [lang, setLang] = useState<string>("en");

  const english = useMemo(
    () => courses.filter((course) => normalizeCourseLanguage(course?.language ?? course?.lang ?? course?.locale) === "en"),
    [courses],
  );
  const hindi = useMemo(
    () => courses.filter((course) => normalizeCourseLanguage(course?.language ?? course?.lang ?? course?.locale) === "hi"),
    [courses],
  );

  const maxEnglish = 8;
  const maxHindi = 6;

  const current = lang === "en" ? english.slice(0, maxEnglish) : hindi.slice(0, maxHindi);

  return (
    <div className="rounded-[30px] border border-slate-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.72),_rgba(248,250,252,0.9))] p-4 shadow-[0_18px_40px_rgba(15,23,42,0.04)] backdrop-blur-sm dark:border-slate-700 dark:bg-[linear-gradient(180deg,_rgba(15,23,42,0.82),_rgba(17,24,39,0.9))] dark:shadow-[0_18px_40px_rgba(15,23,42,0.28)]">
      <div className="mb-6 flex items-center justify-end">
        <CoursesSwitcher
          leftLabel={"English"}
          rightLabel={"Hindi"}
          leftValue={"en"}
          rightValue={"hi"}
          onChange={(v) => setLang(v)}
        />
      </div>

      <RecordedCoursesCarousel courses={current} purchasedCourseIds={purchasedCourseIds} savedCourseIds={savedCourseIds} />
    </div>
  );
}
