# Vercel Environment Variables Checklist

Use this checklist in the Vercel dashboard for the project.

## 1) Open the project

- Go to your Vercel project.
- Open Project Settings.
- Open Environment Variables.

## 2) Add the Production variables

Set these under the Production environment:

```env
DATABASE_URL="postgresql://neondb_owner:ProdPassword123@ep-prod-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://neondb_owner:ProdPassword123@ep-prod-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="5Q7i9xT8Q3nL1fJv0hP9sE2bR4mK6uY8wD1cA3nF7pM="
NEXTAUTH_SECRET="5Q7i9xT8Q3nL1fJv0hP9sE2bR4mK6uY8wD1cA3nF7pM="
NEXTAUTH_URL="https://cognive-academy.com"
```

## 3) Add the Preview variables

Set these under the Preview environment:

```env
DATABASE_URL="postgresql://neondb_owner:PreviewPassword123@ep-preview-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://neondb_owner:PreviewPassword123@ep-preview-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="3nL8mQ2vK6rC1hT4pY7sJ9uF5wX2dM8qA1cV6bN4pR0="
NEXTAUTH_SECRET="3nL8mQ2vK6rC1hT4pY7sJ9uF5wX2dM8qA1cV6bN4pR0="
NEXTAUTH_URL="https://cognive-academy-git-branch.vercel.app"
```

## 4) Add the Development variables

Set these under the Development environment:

```env
DATABASE_URL="postgresql://neondb_owner:DevPassword123@ep-dev-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://neondb_owner:DevPassword123@ep-dev-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="9kP3xT6vR2mN8qL5wH1cD7sF4yG2bJ6uA3mQ8pV1tC="
NEXTAUTH_SECRET="9kP3xT6vR2mN8qL5wH1cD7sF4yG2bJ6uA3mQ8pV1tC="
NEXTAUTH_URL="http://localhost:3000"
```

## 5) Save and redeploy

- Save each environment variable set.
- Trigger a redeploy.
- Verify login, signup, and course flows.

## 6) Important checks

- `DATABASE_URL` should be the pooled Neon URL.
- `DIRECT_URL` should be the direct Neon URL.
- `AUTH_SECRET` and `NEXTAUTH_SECRET` should match in the same environment.
- `NEXTAUTH_URL` must be the live domain for production and preview.

## 7) Security note

Do not reuse production secrets in preview or development. Each environment should use its own values.
