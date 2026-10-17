const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const tableToModel = {
  users: 'user',
  courses: 'course',
  modules: 'module',
  lectures: 'lecture',
  orders: 'order',
  enrollments: 'enrollment',
  saved_courses: 'savedCourse',
  lecture_progress: 'lectureProgress',
  otp_verifications: 'otpVerification',
  user_sessions: 'userSession',
};

const orderOfImport = [
  'users',
  'courses',
  'modules',
  'lectures',
  'orders',
  'enrollments',
  'saved_courses',
  'lecture_progress',
  'otp_verifications',
  'user_sessions',
];

function loadDatabaseUrl() {
  const rootDir = path.resolve(__dirname, '..');
  const envFiles = ['.env.local', '.env'];

  for (const fileName of envFiles) {
    const filePath = path.join(rootDir, fileName);
    if (!fs.existsSync(filePath)) continue;

    const text = fs.readFileSync(filePath, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      if (trimmed.startsWith('DATABASE_URL=')) {
        return trimmed.slice('DATABASE_URL='.length).trim().replace(/^['"]|['"]$/g, '');
      }
    }
  }

  return process.env.DATABASE_URL;
}

function findLatestBackupDirectory(baseDir) {
  const entries = fs.existsSync(baseDir) ? fs.readdirSync(baseDir, { withFileTypes: true }) : [];
  const candidateDirs = entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('live-data-backup-'))
    .map((entry) => entry.name)
    .sort()
    .reverse();

  if (!candidateDirs.length) {
    throw new Error(`No backup directory found inside ${baseDir}. Export data first.`);
  }

  return path.join(baseDir, candidateDirs[0]);
}

function normalizeValueForPrisma(value) {
  if (value === null || value === undefined) return value;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return value;

    const dateLike = /(?:At|Date|Time)$/.test(value) || ['createdAt', 'updatedAt', 'expiresAt', 'grantedAt', 'usedAt', 'lastSeenAt'].includes(value);
    if (dateLike) {
      const parsed = new Date(trimmed);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }

    return value;
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValueForPrisma);
  }

  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, nestedValue]) => [key, normalizeValueForPrisma(nestedValue)]));
  }

  return value;
}

function normalizeRows(rows) {
  return (Array.isArray(rows) ? rows : []).map((row) => normalizeValueForPrisma(row));
}

async function resetTables(prisma, tables) {
  const resetOrder = [...tables].reverse();

  for (const tableName of resetOrder) {
    const modelName = tableToModel[tableName];
    if (!modelName) continue;

    try {
      const method = prisma[modelName];
      if (!method || typeof method.deleteMany !== 'function') continue;
      await method.deleteMany();
      console.log(`Cleared ${tableName}`);
    } catch (error) {
      console.warn(`Could not clear ${tableName}:`, error.message || error);
    }
  }
}

async function importBackup(backupDir, shouldReset) {
  const databaseUrl = loadDatabaseUrl();
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing. Set it in .env.local or .env before restoring.');
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl });
  const prisma = new PrismaClient({ adapter });

  try {
    const manifestPath = path.join(backupDir, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    if (shouldReset) {
      console.log('Resetting existing database data before import...');
      await resetTables(prisma, orderOfImport);
    }

    for (const tableName of orderOfImport) {
      const filePath = path.join(backupDir, `${tableName}.json`);
      if (!fs.existsSync(filePath)) continue;

      const rows = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const normalized = normalizeRows(rows);

      if (!normalized.length) {
        console.log(`Skipped ${tableName}: no rows`);
        continue;
      }

      const modelName = tableToModel[tableName];
      if (!modelName) {
        console.log(`Skipped ${tableName}: no model mapping`);
        continue;
      }

      const model = prisma[modelName];
      if (!model || typeof model.createMany !== 'function') {
        console.warn(`Cannot restore ${tableName}: no createMany support for ${modelName}`);
        continue;
      }

      await model.createMany({
        data: normalized,
        skipDuplicates: true,
      });

      console.log(`Restored ${tableName}: ${normalized.length} rows`);
    }

    console.log(`Restore complete. Imported from ${backupDir}`);
    console.log(`Manifest total tables: ${manifest.totalTables}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const baseDir = path.resolve(__dirname);
  const args = process.argv.slice(2);
  const shouldReset = args.includes('--reset');

  const targetDir = args.find((arg) => !arg.startsWith('--')) || findLatestBackupDirectory(baseDir);
  const resolvedDir = path.isAbsolute(targetDir) ? targetDir : path.join(baseDir, targetDir);

  console.log(`Using backup directory: ${resolvedDir}`);
  await importBackup(resolvedDir, shouldReset);
}

main().catch((error) => {
  console.error('Restore failed:', error);
  process.exit(1);
});
