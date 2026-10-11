import { prisma } from "@/lib/prisma";

import AboutUsClient from "./about-us-client";

export const revalidate = 300;

export default async function AboutUsPage() {
  const [studentCount, publishedCourses] = await Promise.all([
    prisma.user.count({
      where: { role: "STUDENT" },
    }),
    prisma.course.findMany({
      where: { isPublished: true },
      select: {
        category: true,
        instructorName: true,
        modules: {
          select: {
            id: true,
          },
        },
      },
    }),
  ]);

  const mentorCount = new Set(
    publishedCourses
      .map((course) => course.instructorName?.trim())
      .filter((name): name is string => Boolean(name)),
  ).size;

  const careerPathwaysCount = new Set(
    publishedCourses
      .map((course) => course.category?.trim())
      .filter((category): category is string => Boolean(category)),
  ).size;

  const projectCount = publishedCourses.reduce(
    (total, course) => total + (course.modules?.length ?? 0),
    0,
  );

  return (
    <AboutUsClient
      learnerSupportedCount={studentCount}
      mentorCount={mentorCount}
      projectCount={projectCount}
      careerPathwaysCount={careerPathwaysCount}
    />
  );
}
