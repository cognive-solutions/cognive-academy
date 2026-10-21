import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const normalizeRuntimeMode = (value?: string) => {
  const raw = (value ?? "development").toLowerCase().trim();

  if (raw === "prod" || raw === "production") return "production";
  if (raw === "dev" || raw === "development") return "development";

  return raw || "development";
};

const runtimeEnv = normalizeRuntimeMode(process.env.APP_ENV ?? process.env.VERCEL_ENV ?? process.env.NODE_ENV);
const selectedDatabaseUrl =
  runtimeEnv === "production"
    ? process.env.DATABASE_URL_PROD ?? process.env.DATABASE_URL
    : process.env.DATABASE_URL_DEV ?? process.env.DATABASE_URL;

if (!selectedDatabaseUrl || !/^postgres(?:ql)?:\/\//i.test(selectedDatabaseUrl)) {
  throw new Error(
    "DATABASE_URL is missing or invalid. Set DATABASE_URL_DEV, DATABASE_URL_PROD, or DATABASE_URL for your active environment."
  );
}

const adapter = new PrismaPg({ connectionString: selectedDatabaseUrl });
const prisma = new PrismaClient({ adapter });

type SeedLecture = {
  title: string;
  isPreview: boolean;
  liveSessionUrl?: string;
  hlsUrl?: string;
  videoUrl?: string;
  scheduled?: "recorded" | "none";
};

type SeedModule = {
  title: string;
  description?: string;
  lectures: SeedLecture[];
};

type SeedCourse = {
  slug: string;
  title: string;
  shortDescription?: string;
  description: string;
  category: string;
  level: string;
  durationHours: number;
  price: number;
  offerPrice?: number;
  isPromotional?: boolean;
  isBestValue?: boolean;
  isNew?: boolean;
  promoCode?: string;
  currency?: string;
  featured: boolean;
  isPublished: boolean;
  isLive: boolean;
  language: string;
  imageUrl?: string;
  instructorName: string;
  instructorTitle?: string;
  previewLectureUrl?: string;
  modules: SeedModule[];
  [key: string]: unknown;
};

const courseCatalog: SeedCourse[] = [
  {
    slug: "power-bi-business-intelligence-live",
    title: "Power BI Mastery Live",
    shortDescription: "Build executive-ready dashboards, reporting workflows, and DAX insights in a premium live cohort.",
    description:
      "This live English course teaches you how to design dashboards, build analytical models, and turn raw business data into clear operational decisions using Power BI.",
    category: "Business Intelligence",
    level: "Beginner",
    durationHours: 20,
    price: 9999,
    featured: true,
    isPublished: true,
    isLive: true,
    language: "en",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80&fm=jpg",
    instructorName: "Vishwajeet Singh",
    instructorTitle: "Data & AI Specialist",
    previewLectureUrl: "https://www.youtube.com/watch?v=O0H6D2kA3gI",
    modules: [
      {
        title: "Power BI foundations",
        description: "Understand the Power BI interface, data import, and data preparation workflows.",
        lectures: [
          { title: "Introduction to Power BI and workspace setup", isPreview: true },
          { title: "Connecting data sources and cleaning data", isPreview: false },
          { title: "Data model design for analysis", isPreview: false },
        ],
      },
      {
        title: "DAX and reporting logic",
        description: "Create calculations, measures, and logic for meaningful business insights.",
        lectures: [
          { title: "Calculated columns and measures", isPreview: false },
          { title: "Time intelligence in Power BI", isPreview: false },
          { title: "Building KPI and trend reports", isPreview: false },
        ],
      },
      {
        title: "Dashboard storytelling",
        description: "Turn data into clear executive dashboards and actionable business decisions.",
        lectures: [
          { title: "Designing executive dashboards", isPreview: false },
          { title: "Publishing and sharing reports", isPreview: false },
          { title: "Final dashboard review and optimization", isPreview: false },
        ],
      },
    ],
  },
  {
    slug: "power-bi-advanced-dashboarding-live",
    title: "Executive Power BI Intelligence Live",
    shortDescription: "Advance your BI storytelling with premium dashboard design, KPI logic, and decision-ready analysis.",
    description:
      "This live English course helps professionals build decision-ready dashboards, optimize reporting logic, and present insights with executive clarity.",
    category: "Business Intelligence",
    level: "Intermediate",
    durationHours: 24,
    price: 14999,
    featured: true,
    isPublished: true,
    isLive: true,
    language: "en",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80&fm=jpg&crop=entropy&cs=tinysrgb",
    instructorName: "Vishwajeet Singh",
    instructorTitle: "Data & AI Specialist",
    previewLectureUrl: "https://www.youtube.com/watch?v=7QnA6u9eZuY",
    modules: [
      {
        title: "Advanced data modeling",
        description: "Work with relationships, star schemas, and optimized reporting data models.",
        lectures: [
          { title: "Data warehouse concepts for BI", isPreview: true },
          { title: "Creating star schema models", isPreview: false },
          { title: "Handling data quality and refresh issues", isPreview: false },
        ],
      },
      {
        title: "Insightful DAX patterns",
        description: "Master business logic and calculation patterns for real-world analytics use cases.",
        lectures: [
          { title: "Dynamic segmentation and filters", isPreview: false },
          { title: "Scenario and comparison logic", isPreview: false },
          { title: "Advanced KPI calculations", isPreview: false },
        ],
      },
      {
        title: "Executive reporting lab",
        description: "Build polished BI reports designed for stakeholder review and actionability.",
        lectures: [
          { title: "Storyboarding a business report", isPreview: false },
          { title: "Designing stakeholder-friendly visuals", isPreview: false },
          { title: "Final live dashboard presentation", isPreview: false },
        ],
      },
    ],
  },
  {
    slug: "data-structures-algorithms-recorded",
    title: "Data Structures & Algorithms Mastery Recorded",
    shortDescription: "Master core CS fundamentals with structured DSA learning built for real-world problem solving.",
    description:
      "This English recorded course covers the most important data structures, algorithm patterns, and engineering problem-solving strategies used in technical interviews and product work.",
    category: "Computer Science",
    level: "Intermediate",
    durationHours: 18,
    price: 10999,
    featured: true,
    isPublished: true,
    isLive: false,
    language: "en",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80&fm=jpg&crop=entropy&cs=tinysrgb",
    instructorName: "Vikash Singh",
    instructorTitle: "Full Stack Developer",
    previewLectureUrl: "https://www.youtube.com/watch?v=8hly31xKli0",
    modules: [
      {
        title: "Core data structures",
        description: "Learn the building blocks of efficient software design and problem-solving.",
        lectures: [
          { title: "Arrays, strings, and hashing", isPreview: true },
          { title: "Stacks, queues, and linked lists", isPreview: false },
          { title: "Hash maps and practical trade-offs", isPreview: false },
        ],
      },
      {
        title: "Trees and graphs",
        description: "Understand traversal, recursion, and graph approaches that define real-world systems.",
        lectures: [
          { title: "Binary trees and recursion", isPreview: false },
          { title: "Graphs, BFS, and DFS", isPreview: false },
          { title: "Shortest path and connectivity patterns", isPreview: false },
        ],
      },
      {
        title: "Algorithmic thinking",
        description: "Build patterns for sorting, searching, and solving competitive coding problems.",
        lectures: [
          { title: "Sorting and searching fundamentals", isPreview: false },
          { title: "Greedy and divide-and-conquer strategies", isPreview: false },
          { title: "Complexity analysis and optimization", isPreview: false },
        ],
      },
    ],
  },
  {
    slug: "dsa-advanced-practice-recorded",
    title: "DSA Interview Lab Recorded",
    shortDescription: "Sharpen interview-ready reasoning with advanced DSA patterns, optimization, and real problem drills.",
    description:
      "This premium English recorded course helps learners solve advanced algorithm problems, optimize their thinking, and prepare for technical interviews with confidence.",
    category: "Computer Science",
    level: "Advanced",
    durationHours: 22,
    price: 16999,
    featured: true,
    isPublished: true,
    isLive: false,
    language: "en",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80&fm=jpg&crop=entropy&cs=tinysrgb",
    instructorName: "Vikash Singh",
    instructorTitle: "Full Stack Developer",
    previewLectureUrl: "https://www.youtube.com/watch?v=4fQyG0GJ5V0",
    modules: [
      {
        title: "Interview problem patterns",
        description: "Learn recurring problem-solving templates used in coding interviews and real engineering tasks.",
        lectures: [
          { title: "Two-pointer and sliding window", isPreview: true },
          { title: "Backtracking and recursion techniques", isPreview: false },
          { title: "Dynamic programming foundations", isPreview: false },
        ],
      },
      {
        title: "Optimization and trade-offs",
        description: "Understand how to optimize logic while balancing speed, memory, and clarity.",
        lectures: [
          { title: "Space-time trade-offs", isPreview: false },
          { title: "Choosing the right approach", isPreview: false },
          { title: "Debugging algorithm design mistakes", isPreview: false },
        ],
      },
      {
        title: "Capstone problem set",
        description: "Apply your learning to realistic challenge sets with step-by-step reasoning.",
        lectures: [
          { title: "Mock interview problem 1", isPreview: false },
          { title: "Mock interview problem 2", isPreview: false },
          { title: "Final review and recap", isPreview: false },
        ],
      },
    ],
  },
  {
    slug: "power-bi-hindi-live",
    title: "Power BI Mastery in Hindi",
    shortDescription: "Learn Power BI reporting, dashboards, and business analytics in a structured Hindi live format.",
    description:
      "This live Hindi course introduces Power BI for business reporting, dashboard design, and DAX-powered insights in a learner-friendly format suited for practical business use.",
    category: "Business Intelligence",
    level: "Beginner",
    durationHours: 16,
    price: 6999,
    featured: true,
    isPublished: true,
    isLive: true,
    language: "hi",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80&fm=jpg",
    instructorName: "Vishwajeet Singh",
    instructorTitle: "Data & AI Specialist",
    previewLectureUrl: "https://www.youtube.com/watch?v=JgVXssskl80",
    modules: [
      {
        title: "Power BI ka basics",
        description: "Power BI ki interface, data import, aur reporting setup ko samjhein.",
        lectures: [
          { title: "Power BI ko samjhana aur setup", isPreview: true },
          { title: "Data source connect karna", isPreview: false },
          { title: "Data cleaning aur model banaana", isPreview: false },
        ],
      },
      {
        title: "DAX aur business metrics",
        description: "Measures, filters, aur business KPIs ko practical examples ke saath seekhein.",
        lectures: [
          { title: "Measures aur calculated columns", isPreview: false },
          { title: "KPI aur trend analysis", isPreview: false },
          { title: "DAX logic ko samajhna", isPreview: false },
        ],
      },
      {
        title: "Dashboard aur reporting",
        description: "Business dashboards ko visually clear aur actionable banaana seekhein.",
        lectures: [
          { title: "Executive dashboard design", isPreview: false },
          { title: "Report sharing aur publishing", isPreview: false },
          { title: "Final dashboard review", isPreview: false },
        ],
      },
    ],
  },
  {
    slug: "dsa-hindi-recorded",
    title: "DSA Foundations in Hindi",
    shortDescription: "Build a strong foundation in data structures and algorithms with clear Hindi explanations and practical examples.",
    description:
      "This Hindi recorded course explains core data structures, algorithm patterns, and problem-solving techniques in a simple, beginner-friendly format for confident learning.",
    category: "Computer Science",
    level: "Intermediate",
    durationHours: 17,
    price: 8999,
    featured: true,
    isPublished: true,
    isLive: false,
    language: "hi",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80&fm=jpg&crop=entropy&cs=tinysrgb",
    instructorName: "Vikash Singh",
    instructorTitle: "Full Stack Developer",
    previewLectureUrl: "https://www.youtube.com/watch?v=FiQ4oW0EwWo",
    modules: [
      {
        title: "Basic data structures",
        description: "Arrays, strings, hash maps, aur stack/queue ko practical examples ke saath samjhein.",
        lectures: [
          { title: "Arrays aur strings", isPreview: true },
          { title: "Stacks aur queues", isPreview: false },
          { title: "Hash maps aur maps", isPreview: false },
        ],
      },
      {
        title: "Trees aur graphs",
        description: "Trees, traversal, aur graph-based problem solving ko step-by-step samjhein.",
        lectures: [
          { title: "Binary trees ka basics", isPreview: false },
          { title: "Graphs aur BFS/DFS", isPreview: false },
          { title: "Traversal patterns", isPreview: false },
        ],
      },
      {
        title: "Problem solving strategies",
        description: "Sorting, searching, aur complexity analysis ko interview readiness ke saath seekhein.",
        lectures: [
          { title: "Sorting aur searching", isPreview: false },
          { title: "Complexity analysis", isPreview: false },
          { title: "Final recap aur practice flow", isPreview: false },
        ],
      },
    ],
  },
];

function getLectureMediaState(lecture: SeedLecture, courseSlug: string, lectureIndex: number) {
  const hasExplicitSchedule = Boolean(lecture.liveSessionUrl || lecture.hlsUrl || lecture.videoUrl || lecture.scheduled);
  const defaultHlsUrl = `https://example.com/hls/${courseSlug}-${lectureIndex + 1}.m3u8`;
  const defaultVideoUrl = `https://example.com/videos/${courseSlug}-${lectureIndex + 1}.mp4`;

  const isLive = Boolean(lecture.liveSessionUrl);
  const isUnscheduled = lecture.scheduled === "none";
  const shouldFallbackToDefaultRecording = !isLive && !isUnscheduled && !hasExplicitSchedule;

  return {
    liveSessionUrl: lecture.liveSessionUrl ?? null,
    hlsUrl: lecture.hlsUrl ?? (shouldFallbackToDefaultRecording ? defaultHlsUrl : null),
    videoUrl: lecture.videoUrl ?? (shouldFallbackToDefaultRecording ? defaultVideoUrl : null),
  };
}

function buildCoursePayload(course: SeedCourse) {
  return {
    ...course,
    modules: {
      create: course.modules.map((module, moduleIndex) => ({
        title: module.title,
        description: module.description,
        position: moduleIndex + 1,
        lectures: {
          create: module.lectures.map((lecture, lectureIndex) => {
            const mediaState = getLectureMediaState(lecture, course.slug, lectureIndex);

            return {
              title: lecture.title,
              description: lecture.title,
              position: lectureIndex + 1,
              isPreview: lecture.isPreview,
              ...mediaState,
            };
          }),
        },
      })),
    },
  };
}

async function main() {
  const runtimeEnv = (process.env.APP_ENV ?? process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development").toLowerCase();

  if (runtimeEnv === "production" || runtimeEnv === "prod") {
    console.log("Skipping prisma seed in production; database values must be managed explicitly.");
    return;
  }

  const studentPasswordHash = await bcrypt.hash("Cognive@2026", 10);
  const adminPasswordHash = await bcrypt.hash("Cognive@2297", 10);

  await prisma.user.upsert({
    where: { email: "student@cognive.academy" },
    update: {
      name: "Vishwajeet Singh",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
      phone: "+919140421721",
    },
    create: {
      email: "student@cognive.academy",
      name: "Vishwajeet Singh",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
      phone: "+919140421721",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@cognive.academy" },
    update: {
      name: "Admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      phone: "+917839649747",
    },
    create: {
      email: "admin@cognive.academy",
      name: "Admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      phone: "+917839649747",
    },
  });

  for (const course of courseCatalog) {
    const { modules, ...courseFields } = course;

    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        ...courseFields,
        modules: {
          deleteMany: {},
          create: modules.map((module, moduleIndex) => ({
            title: module.title,
            description: module.description,
            position: moduleIndex + 1,
            lectures: {
              create: module.lectures.map((lecture, lectureIndex) => ({
                title: lecture.title,
                description: lecture.title,
                position: lectureIndex + 1,
                isPreview: lecture.isPreview,
                liveSessionUrl: lecture.liveSessionUrl ?? null,
                hlsUrl:
                  lecture.hlsUrl ??
                  (lecture.liveSessionUrl || lecture.scheduled === "none" ? null : `https://example.com/hls/${course.slug}-${lectureIndex + 1}.m3u8`),
                videoUrl:
                  lecture.videoUrl ??
                  (lecture.liveSessionUrl || lecture.scheduled === "none" ? null : `https://example.com/videos/${course.slug}-${lectureIndex + 1}.mp4`),
              })),
            },
          })),
        },
      },
      create: buildCoursePayload(course),
    });
  }

  const featuredPublishedCourse = await prisma.course.findFirst({
    where: { isPublished: true, isLive: true },
    orderBy: { createdAt: "asc" },
  });

  if (featuredPublishedCourse) {
    const student = await prisma.user.findUnique({ where: { email: "student@cognive.academy" } });
    if (student) {
      await prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: student.id,
            courseId: featuredPublishedCourse.id,
          },
        },
        update: {},
        create: {
          userId: student.id,
          courseId: featuredPublishedCourse.id,
          accessGranted: true,
        },
      });
    }
  }

  console.log(`Seeded ${courseCatalog.length} courses successfully`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
