# Database backup and migration package

This folder contains the application data and schema assets saved before the current database is terminated or replaced.

## Current backup status

A live table export has already been generated from the active Postgres database and saved in a timestamped backup directory inside this folder:

- [live-data-backup-2026-10-17T13-55-53-373Z](live-data-backup-2026-10-17T13-55-53-373Z)

That export includes one JSON file per public table and a `manifest.json` summary with row counts.

## Included files

- [schema.prisma](schema.prisma) — current Prisma schema
- [seed.ts](seed.ts) — seed script used for app initialization
- [.env.local.backup](.env.local.backup) — local environment backup snapshot
- [restore-live-data.js](restore-live-data.js) — import script for the replacement database
- [RESTORE_GUIDE.md](RESTORE_GUIDE.md) — step-by-step migration and validation checklist
- the generated backup directory with the saved JSON table exports

## Restore workflow

1. Configure the new database in `.env.local` or `.env`
2. Sync the Prisma schema:

```bash
npx prisma generate
npx prisma db push
```

3. Import the saved data:

```bash
node db-backup-before-termination/restore-live-data.js
```

4. If the target database should be cleared before restore:

```bash
node db-backup-before-termination/restore-live-data.js --reset
```

## Purpose

This package is the rollback and migration safety net for the project. It preserves the app schema, seed data, and the current database contents so the application can be reopened on a new database without losing the existing state.

> Use this folder as the source of truth before a database shutdown, replacement, or major infrastructure change.
