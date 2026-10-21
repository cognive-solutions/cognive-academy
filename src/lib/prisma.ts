import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

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

const databaseUrl = selectedDatabaseUrl;

if (!databaseUrl || !/^postgres(?:ql)?:\/\//i.test(databaseUrl)) {
  throw new Error(
    "DATABASE_URL is missing or invalid. Set DATABASE_URL_DEV, DATABASE_URL_PROD, or DATABASE_URL for your active environment."
  );
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaPg({ connectionString: databaseUrl });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  } as any);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
