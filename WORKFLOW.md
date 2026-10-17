# Workflow

## Project model

This project is a full-stack Next.js application, not a frontend-only app with a separate backend service.

The app already includes:
- frontend screens and components in [src](src)
- server-side route handlers under [src/app](src/app)
- authentication logic in [src/auth.ts](src/auth.ts)
- Prisma database access via [prisma/schema.prisma](prisma/schema.prisma)
- database-backed admin and student flows through the app itself

In practical terms:
- the UI is in the Next.js app
- the backend logic lives in route handlers and server actions
- database persistence is handled by Prisma and PostgreSQL

---

## Current architecture

### Frontend
- user-facing pages and marketing screens
- student dashboard and course views
- admin management screens
- components and shared UI logic

### Backend / app logic
- authentication and session management
- admin course and lecture operations
- payments and order handling
- enrollment, saved courses, progress tracking
- API routes for app functionality

### Data layer
- PostgreSQL database
- Prisma schema and migrations
- environment-based database configuration

---

## Recommended working model

Keep developing in the same full-stack structure:
1. build or update UI in [src](src)
2. update server routes or logic as needed
3. validate Prisma model and DB behavior
4. test flows through QA docs in [docs/qa](docs/qa)
5. deploy using the Vercel + Neon workflow in [docs/ops](docs/ops)

---

## Documentation structure

The repo is organized as follows:

- [README.md](README.md): project overview and setup
- [WORKFLOW.md](WORKFLOW.md): current operational workflow and app model
- [docs/qa](docs/qa): QA, testing, and acceptance docs
- [docs/ops](docs/ops): deployment, Vercel, Neon, and environment setup
- [docs/release](docs/release): release notes and launch documentation
- [db-backup-before-termination](db-backup-before-termination): temporary backup bundle before database replacement or termination

---

## Deployment model

This project is designed to be deployed as a single Next.js app with a managed PostgreSQL database.

Recommended setup:
- Vercel for hosting the app
- Neon or another managed Postgres provider for the database
- `DATABASE_URL` and `DIRECT_URL` set in environment variables
- `AUTH_SECRET` and `NEXTAUTH_SECRET` configured for production

Production environment setup is documented in:
- [docs/ops/02-vercel-neon-production-setup.md](docs/ops/02-vercel-neon-production-setup.md)
- [docs/ops/03-vercel-env-checklist.md](docs/ops/03-vercel-env-checklist.md)

---

## When backend work is needed

Backend work is required when:
- new course or lecture fields are added
- auth/session behavior changes
- admin operations need DB updates
- order or payment logic changes
- progress and enrollment logic changes
- API contracts or data models change

This is still part of the same application, not a separate service layer.

---

## Final recommendation

Treat this as a single full-stack Next.js application with these responsibilities:
- UI and app screens in the Next.js app
- business logic in route handlers and server-side code
- persistent data in Prisma + PostgreSQL
- deployment via Vercel + Neon
- QA and ops documentation in the docs structure

> This project does not require a separate backend app in the traditional sense. The current architecture is already the correct model for the project.