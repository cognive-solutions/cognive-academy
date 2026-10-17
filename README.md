# Cognive Academy

Cognive Academy is a full-stack learning platform for online courses, live classes, admin management, student dashboards, and enrollment flows with payment integration. The application is built with Next.js, Prisma, PostgreSQL, and NextAuth, and is structured for Vercel-based production deployment.

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth credentials authentication
- Razorpay checkout integration
- Vercel deployment with Neon/Postgres support

## Project layout

The codebase is organized by responsibility:

- application code in [src](src)
- database schema and Prisma configuration in [prisma](prisma)
- QA and acceptance documentation in [docs/qa](docs/qa)
- deployment and production operations in [docs/ops](docs/ops)
- release notes in [docs/release](docs/release)
- database backup and recovery preparation in [db-backup-before-termination](db-backup-before-termination)

## Project structure

```bash
.
├── db-backup-before-termination/
├── docs/
│   ├── README.md
│   ├── qa/
│   ├── ops/
│   └── release/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   ├── migrations/
│   └── config/
├── public/
├── scripts/
├── src/
│   ├── app/
│   ├── components/
│   ├── config/
│   ├── data/
│   ├── lib/
│   ├── types/
│   ├── auth.ts
│   ├── proxy.ts
│   └── ...
├── .env.example
├── .env.local
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── README.md
├── tsconfig.json
├── WORKFLOW.md
└── .vscode/
```

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL database
- Razorpay keys for checkout
- Vercel project access for deployment

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create or update the local environment file:

```bash
cp .env.example .env.local
```

3. Configure the required variables in `.env.local`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/cognive_academy?schema=public"
DIRECT_URL="postgresql://username:password@localhost:5432/cognive_academy?schema=public"
AUTH_SECRET="generate-a-strong-secret"
NEXTAUTH_SECRET="generate-a-strong-secret"
NEXTAUTH_URL="http://localhost:3000"
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"
```

> The app reads `AUTH_SECRET` first and falls back to `NEXTAUTH_SECRET`, so keeping both values aligned is the safest setup.

4. Generate the Prisma client and sync the schema:

```bash
npx prisma generate
npx prisma db push
```

Optional seed:

```bash
npx prisma db seed
```

5. Start the app locally:

```bash
npm run dev
```

Open http://localhost:3000 to view the application.

## Available scripts

```bash
npm run dev                  # start the Next.js development server
npm run build                # generate Prisma client and build the app
npm run start                # start the production build
npm run lint                 # run ESLint
npm run generate:favicons    # generate favicons
```

## Database and Prisma notes

The Prisma schema in [prisma/schema.prisma](prisma/schema.prisma) defines the core application entities, including:

- User
- Course
- Module
- Lecture
- Order
- Enrollment
- SavedCourse
- LectureProgress
- UserSession

This project is configured for managed PostgreSQL providers such as Neon, using a pooled `DATABASE_URL` and a direct `DIRECT_URL` for Prisma migration and schema work.

## Deployment and production

This project is prepared for Vercel deployment with a managed PostgreSQL provider such as Neon.

For production setup, refer to:

- [docs/ops](docs/ops)
- [docs/ops/VERCEL_NEON_PRODUCTION_SETUP.md](docs/ops/VERCEL_NEON_PRODUCTION_SETUP.md)
- [docs/ops/vercel-env-checklist.md](docs/ops/vercel-env-checklist.md)
- [docs/ops/vercel-neon-copy-paste-envs.md](docs/ops/vercel-neon-copy-paste-envs.md)

## Documentation

The project documentation is organized by purpose:

- [docs/README.md](docs/README.md)
- [docs/qa](docs/qa)
- [docs/ops](docs/ops)
- [docs/release](docs/release)

## Backup and recovery

Before a database is replaced or terminated, keep the backup bundle in:

- [db-backup-before-termination](db-backup-before-termination)

## Notes

- [.gitignore](.gitignore) excludes local environment files and generated build artifacts.
- [.next](.next) is generated automatically and can be cleaned when troubleshooting.
- If the Prisma schema changes, run `npx prisma generate` and apply the migration or schema sync before redeploying.
- QA, operations, release documentation, and backup material are intentionally separated from the application codebase.
