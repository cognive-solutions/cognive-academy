# 05. Vercel + Neon live environment setup

Use these variables in Vercel for the production deployment of this app.

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

Notes:
- This app supports both `AUTH_SECRET` and `NEXTAUTH_SECRET`; keeping both values the same is the safest production setup.
- Use the Neon pooled URL for `DATABASE_URL` in Vercel.
- Use the direct connection URL for `DIRECT_URL`.
- Generate a secure secret with:

```bash
openssl rand -base64 32
```
