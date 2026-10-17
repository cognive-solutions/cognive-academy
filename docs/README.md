# Project Documentation

This folder contains the project documentation organized by purpose.

## 1) QA and acceptance

Use these files for admin and student validation and acceptance testing.

- [qa/01-admin-testing-flow.md](qa/01-admin-testing-flow.md)
- [qa/02-admin-testing-log.md](qa/02-admin-testing-log.md)
- [qa/03-admin-ui-testing-acceptance.md](qa/03-admin-ui-testing-acceptance.md)
- [qa/04-student-testing-flow.md](qa/04-student-testing-flow.md)
- [qa/05-student-testing-log.md](qa/05-student-testing-log.md)
- [qa/06-student-ui-testing-acceptance.md](qa/06-student-ui-testing-acceptance.md)

## 2) Operations and deployment

Use these files for production setup, deployment practices, Neon/Vercel planning, and environment variables.

- [ops/01-production-db-serverless-setup.md](ops/01-production-db-serverless-setup.md)
- [ops/02-vercel-neon-production-setup.md](ops/02-vercel-neon-production-setup.md)
- [ops/03-vercel-env-checklist.md](ops/03-vercel-env-checklist.md)
- [ops/04-vercel-neon-copy-paste-envs.md](ops/04-vercel-neon-copy-paste-envs.md)
- [ops/05-vercel-neon-live-env.md](ops/05-vercel-neon-live-env.md)

## 3) Release

This folder is reserved for release notes, signoff summaries, and final launch documentation.

- [release](release)

## 4) Backup and recovery

Store database and environment backup material in the backup folder.

- [../db-backup-before-termination](../db-backup-before-termination)

## 5) Quick usage

- QA and signoff: open the relevant file in [qa](qa)
- Production migration: use the guides in [ops](ops)
- Release tracking: add notes in [release](release)
- DB safety: use the backup folder before deleting the active database
