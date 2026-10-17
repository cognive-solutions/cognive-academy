const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

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

async function exportAllTables() {
  const databaseUrl = loadDatabaseUrl();

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing. Set it in .env.local or .env before running this backup script.');
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl });
  const prisma = new PrismaClient({ adapter });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, `live-data-backup-${timestamp}`);

  fs.mkdirSync(backupDir, { recursive: true });

  const tables = await prisma.$queryRawUnsafe(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;`
  );

  const tableNames = tables.map((row) => row.table_name).filter(Boolean);
  const manifest = [];

  for (const tableName of tableNames) {
    const rows = await prisma.$queryRawUnsafe(`SELECT * FROM "${tableName}";`);
    const filePath = path.join(backupDir, `${tableName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(rows, null, 2), 'utf8');

    manifest.push({
      table: tableName,
      rows: Array.isArray(rows) ? rows.length : 0,
      file: `${tableName}.json`,
    });

    console.log(`Exported ${tableName}: ${Array.isArray(rows) ? rows.length : 0} rows`);
  }

  const manifestPath = path.join(backupDir, 'manifest.json');
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        totalTables: manifest.length,
        totalRows: manifest.reduce((sum, item) => sum + item.rows, 0),
        tables: manifest,
      },
      null,
      2,
    ),
    'utf8',
  );

  console.log(`Backup directory created: ${backupDir}`);
  console.log(`Manifest saved: ${manifestPath}`);
  console.log(`Total tables backed up: ${manifest.length}`);

  await prisma.$disconnect();
}

exportAllTables().catch((error) => {
  console.error('Database backup failed:', error);
  process.exit(1);
});
