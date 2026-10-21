# 01. Production database and serverless setup

## 1) Current situation

Yes — if your current database is a Vercel Postgres / dev database, it is usually intended for development and staging, not for a live app with real users.

For production, you should move to a dedicated Postgres provider that supports:
- stable uptime and backups
- production traffic
- connection pooling for serverless/Next.js
- SSL and secure access
- monitoring / retention / alerts

Recommended options:
- Neon (excellent for serverless Prisma + Vercel)
- Supabase Postgres
- Railway / Render Postgres
- AWS RDS Postgres
- Azure Database for PostgreSQL

For most Next.js projects, Neon or Supabase is the simplest production move.

---

## 2) Recommended production approach

### Option A: Vercel + Neon (best for serverless Prisma setup)

This is the easiest serverless-friendly pattern for Next.js:

- Create a Neon project
- Create a production Postgres database
- Copy connection strings to Vercel environment variables
- Use Prisma with a pooled URL for app runtime
- Keep a direct URL for migrations if required

Typical environment variables:

```bash
DATABASE_URL="postgres://...@aws-.../neondb?sslmode=require"
DIRECT_URL="postgres://...@aws-.../neondb?sslmode=require"
```

For Prisma, use the pooled URL for app runtime and direct URL for migrations if your provider requires it.

### Option B: Supabase Postgres

Also very good for production with:
- managed Postgres
- auth support
- backups
- good DX for a real app

You would still use Prisma with a normal Postgres connection string.

---

## 3) What to do before the current DB is terminated

Do not assume the DB is safe to delete without a backup. Before termination, take a real database backup.

### A. Full schema + data backup

From a local terminal with PostgreSQL tools installed:

```bash
pg_dump --clean --if-exists --create --format=plain --no-owner --no-privileges "<CURRENT_DATABASE_URL>" > cognive-academy-prod-backup.sql
```

For a compressed backup:

```bash
pg_dump --clean --if-exists --create --format=custom --file cognive-academy-prod-backup.dump "<CURRENT_DATABASE_URL>"
```

This captures:
- schema
- indexes
- data
- constraints
- default values

### B. Save the Prisma schema too

Keep a copy of your Prisma definitions and seed files in Git / backup storage:

```bash
prisma/schema.prisma
prisma/seed.ts
```

This makes it easy to restore the app structure later.

### C. Export only important app data (optional but useful)

If you want a quick data-only export for critical tables, you can backup only the app tables:

```bash
pg_dump --data-only --table=users --table=courses --table=enrollments --table=saved_courses --table=orders --table=lecture_progress --table=user_sessions "<CURRENT_DATABASE_URL>" > cognive-academy-critical-data.sql
```

Note: table names must match your actual Prisma model mapping. In this project they are mapped like `users`, `courses`, `enrollments`, etc.

---

## 4) Recommended backup checklist

Before shutting down the current DB, save all of the following:

- full Postgres dump file
- schema-only SQL export
- data-only export
- `.env` values used for the app
- Prisma schema file
- seed script
- any uploaded asset paths / CDN references
- current user data, course data, enrollments, orders, progress

Best practice: store files in:
- GitHub repo secret or secure vault
- cloud storage (Google Drive / S3 / Azure Blob)
- a local archive with date/time stamped folder

Example:

```bash
mkdir backups
pg_dump --clean --if-exists --create --format=custom --file backups/cognive-academy-2026-10-17.dump "<CURRENT_DATABASE_URL>"
cp prisma/schema.prisma backups/
cp prisma/seed.ts backups/
```

---

## 5) Production setup steps for this app

### Step 1: Create new production DB
Choose a real database provider and create a Postgres DB.

### Step 2: Put secrets in Vercel / deployment env
Set these in production environment variables:

```bash
DATABASE_URL=
DIRECT_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

### Step 3: Run Prisma migration in production

```bash
npx prisma generate
npx prisma migrate deploy
```

If the database is empty and you want initial course data:

```bash
npx prisma db seed
```

### Step 4: Validate the app
Check that:
- login works
- signup works
- course listing loads
- saved courses work
- enrollments work
- orders / payments work
- real users can access the app

### Step 5: Enable daily backup / retention
Set provider backups or schedule a nightly dump.

---

## 6) Important production notes for this project

This app uses Prisma heavily and includes user, course, order, enrollment, and progress data. For production, do not rely on a temporary dev database.

The critical tables to protect are:
- `users`
- `user_sessions`
- `courses`
- `modules`
- `lectures`
- `lecture_progress`
- `orders`
- `enrollments`
- `saved_courses`
- `otp_verifications`

These are the tables that contain real learners, course access, and payment activity.

---

## 7) Safe action plan for today

If the current DB is being terminated today, do this immediately:

1. Take a full backup using `pg_dump`
2. Save the Prisma schema and seed script
3. Save all `.env` values in a secure place
4. Create the new production DB
5. Set production env vars in Vercel
6. Apply migrations
7. Test login, course flow, and checkout
8. Update the app to use the new live database URL

---

## 8) Bottom line

- Current Vercel Postgres DB = development/staging usage only
- Production should use a dedicated Postgres database
- Backup before termination is mandatory
- Use `pg_dump` to export schema + data before deletion
- Move app secrets and Prisma setup to a live provider before launching real users

If you want, the next step can be to create a concrete production setup checklist for your exact provider choice (Neon, Supabase, or Vercel Postgres production plan).
