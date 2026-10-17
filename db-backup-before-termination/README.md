# DB backup before termination

This folder was created to hold the current project database backup material before the active database is shut down.

Important: the local environment here does not have PostgreSQL client tools installed, so a live `pg_dump` export could not be created automatically in this session.

Please run the following command from the project root before terminating the current database:

```bash
pg_dump --clean --if-exists --create --format=plain --no-owner --no-privileges --file db-backup-before-termination/cognive-academy-live-backup.sql "<CURRENT_DATABASE_URL>"
```

Alternative compressed dump:

```bash
pg_dump --clean --if-exists --create --format=custom --file db-backup-before-termination/cognive-academy-live-backup.dump "<CURRENT_DATABASE_URL>"
```

Files kept in this folder should include:
- schema.prisma
- seed.ts
- .env.local.backup
- the generated SQL dump from the DB
- any app-specific config snapshots needed for restoration

This project currently uses Prisma, so these files are the critical restoration set before the database is deleted.
