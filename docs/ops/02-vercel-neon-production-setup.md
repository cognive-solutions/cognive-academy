# Vercel + Neon Production Setup for This Project

This guide is specific to the current app structure and Prisma setup in this repository.

## 1) What this app expects

The Prisma schema is configured as a PostgreSQL database and the project already uses:

- Prisma client via `@prisma/client`
- Prisma schema in `prisma/schema.prisma`
- Prisma config via `prisma.config.ts`
- runtime env vars such as `DATABASE_URL`
- possible migration usage via `npx prisma migrate deploy` / `prisma generate`

This app is a Next.js serverless app, so Neon is a strong production match because it is PostgreSQL and works well with serverless deployments.

---

## 2) Recommended production flow

Use:
- Vercel for hosting the app
- Neon for the live Postgres database

This keeps the app serverless and gives you a real production database.

---

## 3) Create the Neon database

### Step 1: Sign in to Neon
Go to:
- https://neon.tech

Create a new project and database.

### Step 2: Get your connection strings
After creating the database, Neon will provide a connection string like:

```bash
postgresql://<user>:<password>@<host>/<dbname>?sslmode=require
```

You will usually want two values:

```bash
DATABASE_URL=postgresql://...<pooled connection>...?
DIRECT_URL=postgresql://...<direct connection>...?
```

Neon commonly gives a pooled URL for the app and a direct URL for Prisma migrations.

---

## 4) Add environment variables in Vercel

Open the Vercel project dashboard and go to:
- Project Settings
- Environment Variables

Add the exact production values below:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<dbname>?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://<user>:<password>@<host>:5432/<dbname>?sslmode=require"
AUTH_SECRET="<generate-a-strong-random-secret>"
NEXTAUTH_SECRET="<same-value-as-AUTH_SECRET>"
NEXTAUTH_URL="https://your-production-domain.com"
```

Example:

```env
DATABASE_URL="postgresql://neondb_owner:AbCd1234@ep-summer-sky-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://neondb_owner:AbCd1234@ep-summer-sky-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="W9D2g9pX3w4x8dF4mJ2g5UZnM1bJ7x0U5sKjN2pV5tA="
NEXTAUTH_SECRET="W9D2g9pX3w4x8dF4mJ2g5UZnM1bJ7x0U5sKjN2pV5tA="
NEXTAUTH_URL="https://cognive-academy.com"
```

For a local `.env.local` example, use:

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
AUTH_SECRET="generate-a-strong-secret"
NEXTAUTH_SECRET="generate-a-strong-secret"
NEXTAUTH_URL="http://localhost:3000"
```

You can generate a secure secret with:

```bash
openssl rand -base64 32
```

This app supports both `AUTH_SECRET` and `NEXTAUTH_SECRET`, so keeping both values identical is the safest production setup.

---

## 5) Update your app to use the live database

Your repo is already using Prisma with `DATABASE_URL`-style environment values, so the change is mostly in deployment settings and local `.env` values, not in the schema itself.

The Prisma datasource in the current app is:

```prisma
datasource db {
  provider = "postgresql"
}
```

This is compatible with Neon.

No schema conversion is needed for PostgreSQL.

---

## 6) Run Prisma against the live DB

After your env vars are in Vercel, run these from the project root:

```bash
npx prisma generate
npx prisma migrate deploy
```

If the DB is empty and you want to seed initial data, use:

```bash
npx prisma db seed
```

If `seed` is not configured, check `prisma/seed.ts` and add the proper script in `package.json` if needed.

---

## 7) Backup before deleting the current dev DB

Before the old database is terminated, run a full dump from the current connection string:

```bash
pg_dump --clean --if-exists --create --format=plain --no-owner --no-privileges "<CURRENT_DATABASE_URL>" > cognive-academy-dev-backup.sql
```

For a compressed backup:

```bash
pg_dump --clean --if-exists --create --format=custom --file cognive-academy-dev-backup.dump "<CURRENT_DATABASE_URL>"
```

Also save:

```bash
cp prisma/schema.prisma backups/
cp prisma/seed.ts backups/
```

---

## 8) Production deployment check list

After switching to Neon, verify these flows in production:

- user signup
- login / logout
- password reset flow
- course listing
- saved courses
- course enrollments
- checkout / order creation
- lecture progress tracking
- admin course management

---

## 9) Recommended final setup

For this project's architecture, the best live setup is:

- Vercel app deployment
- Neon Postgres production database
- Prisma with `DATABASE_URL` for app usage
- `DIRECT_URL` for migration usage if needed
- environment variables set in Vercel
- nightly or regular provider-level backups enabled

---

## 10) Exact commands to run in this project

From project root:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```

After deployment, validate the production URL and confirm login + course flows work.

---

## 11) Recommended final protection

Before the old DB is destroyed, keep all of these saved:

- full Postgres dump
- schema backup
- seed script
- current `.env` values
- Vercel env export
- current deployed app URL and production secret values

---

## 12) Production summary

This project is a standard Next.js + Prisma + PostgreSQL app, and Neon is the best low-friction production replacement for the current dev database.

The most important steps are:

1. create Neon database
2. add `DATABASE_URL` and `DIRECT_URL` in Vercel
3. run Prisma generate + migrate deploy
4. back up the current dev DB before termination
5. test live flows before opening it to real users

---

## 13) Copy-paste Vercel env block (production + preview + development)

Use this exact block for the three Vercel environments:

```env
# Production
DATABASE_URL="postgresql://neondb_owner:ProdPassword123@ep-prod-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://neondb_owner:ProdPassword123@ep-prod-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="5Q7i9xT8Q3nL1fJv0hP9sE2bR4mK6uY8wD1cA3nF7pM="
NEXTAUTH_SECRET="5Q7i9xT8Q3nL1fJv0hP9sE2bR4mK6uY8wD1cA3nF7pM="
NEXTAUTH_URL="https://cognive-academy.com"

# Preview
DATABASE_URL="postgresql://neondb_owner:PreviewPassword123@ep-preview-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://neondb_owner:PreviewPassword123@ep-preview-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="3nL8mQ2vK6rC1hT4pY7sJ9uF5wX2dM8qA1cV6bN4pR0="
NEXTAUTH_SECRET="3nL8mQ2vK6rC1hT4pY7sJ9uF5wX2dM8qA1cV6bN4pR0="
NEXTAUTH_URL="https://cognive-academy-git-branch.vercel.app"

# Development
DATABASE_URL="postgresql://neondb_owner:DevPassword123@ep-dev-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://neondb_owner:DevPassword123@ep-dev-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="9kP3xT6vR2mN8qL5wH1cD7sF4yG2bJ6uA3mQ8pV1tC="
NEXTAUTH_SECRET="9kP3xT6vR2mN8qL5wH1cD7sF4yG2bJ6uA3mQ8pV1tC="
NEXTAUTH_URL="http://localhost:3000"
```

This app supports both `AUTH_SECRET` and `NEXTAUTH_SECRET`; in production, keep both values identical in the same environment.

---

If you want, the next step can be a single command script to generate the full Vercel env export from your current Neon database values.
