# Vercel + Neon Copy-Paste Environment Variables

This file contains a ready-to-paste environment block for Vercel for the three main deployment environments: production, preview, and development.

## Production

```env
DATABASE_URL="postgresql://neondb_owner:ProdPassword123@ep-prod-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://neondb_owner:ProdPassword123@ep-prod-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="5Q7i9xT8Q3nL1fJv0hP9sE2bR4mK6uY8wD1cA3nF7pM="
NEXTAUTH_SECRET="5Q7i9xT8Q3nL1fJv0hP9sE2bR4mK6uY8wD1cA3nF7pM="
NEXTAUTH_URL="https://cognive-academy.com"
```

## Preview

```env
DATABASE_URL="postgresql://neondb_owner:PreviewPassword123@ep-preview-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://neondb_owner:PreviewPassword123@ep-preview-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="3nL8mQ2vK6rC1hT4pY7sJ9uF5wX2dM8qA1cV6bN4pR0="
NEXTAUTH_SECRET="3nL8mQ2vK6rC1hT4pY7sJ9uF5wX2dM8qA1cV6bN4pR0="
NEXTAUTH_URL="https://cognive-academy-git-branch.vercel.app"
```

## Development

```env
DATABASE_URL="postgresql://neondb_owner:DevPassword123@ep-dev-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://neondb_owner:DevPassword123@ep-dev-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="9kP3xT6vR2mN8qL5wH1cD7sF4yG2bJ6uA3mQ8pV1tC="
NEXTAUTH_SECRET="9kP3xT6vR2mN8qL5wH1cD7sF4yG2bJ6uA3mQ8pV1tC="
NEXTAUTH_URL="http://localhost:3000"
```

## Notes

- Use the pooled Neon connection for `DATABASE_URL`.
- Use the direct Neon connection for `DIRECT_URL`.
- Keep `AUTH_SECRET` and `NEXTAUTH_SECRET` identical within the same environment.
- Use a different database and secret per environment.
- This matches the current app's auth implementation, where `AUTH_SECRET` is read first and `NEXTAUTH_SECRET` is used as fallback.

## Quick secret generation

```bash
openssl rand -base64 32
```
