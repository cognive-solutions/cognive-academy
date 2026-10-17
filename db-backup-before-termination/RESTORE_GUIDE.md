# Database migration checklist

This folder contains the saved application data exported from the current database before the old database is terminated or replaced.

## 1. Prepare the new database

Set the connection values for the replacement database in the project environment file:

```bash
# .env.local or .env
DATABASE_URL="postgresql://user:password@host:5432/db_name?sslmode=require"
DIRECT_URL="postgresql://user:password@host:5432/db_name?sslmode=require"
```

Then sync the Prisma schema to the new database:

```bash
npx prisma generate
npx prisma db push
```

## 2. Restore the saved data

From the project root, run the restore script:

```bash
node db-backup-before-termination/restore-live-data.js
```

This automatically finds the most recent exported backup folder in this directory and restores the saved table data.

If you want to clear the target database first before importing the data:

```bash
node db-backup-before-termination/restore-live-data.js --reset
```

To restore a specific backup folder manually:

```bash
node db-backup-before-termination/restore-live-data.js "db-backup-before-termination/live-data-backup-2026-10-17T13-55-53-373Z"
```

## 3. Validate the restored database

Run a quick row-count check after the import:

```sql
SELECT table_name,
       (xpath('/row/c/text()', query_to_xml(format('SELECT count(*) AS c FROM %I.%I', table_schema, table_name), false, true, '')))[1]::text::int AS row_count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

Then validate the main app flows:
- login and signup
- course catalog and filtering
- saved courses
- enrollments and access
- orders and payment state
- admin dashboards and content management

## 4. Go-live check

Only delete or stop the old database after all of the following are true:
- the schema is synced to the new database
- the saved data is restored successfully
- the app loads and the key user journeys work
- admin and student flows are validated in the new environment

## 5. Important note

This migration path is designed to preserve the current application state while the old database is being retired. It should be used before any destructive database cleanup or shutdown.
