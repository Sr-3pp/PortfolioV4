# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Auth (Admin)

Set these env vars to enable local admin login:

```
# .env
NUXT_ADMIN_EMAIL=you@example.com
NUXT_ADMIN_PASSWORD=yourStrongPassword
# optional
NUXT_SESSION_SECRET=change-me
```

Then restart the dev server and visit `/admin` → `/login`.

### Better Auth (SQLite storage)

By default, the auth DB is created at `./.data/auth.sqlite`. To customize, set:

```
BETTER_AUTH_SQLITE_PATH=/absolute/or/relative/path/to/auth.sqlite
```

Ensure the containing directory exists or is creatable by the server process.

### Admin Email Allowlist

Restrict `/admin` access to specific emails by setting a comma-separated list:

```
# .env
NUXT_ADMIN_EMAILS=you@example.com, teammate@company.com
```

Notes:
- If `NUXT_ADMIN_EMAILS` is empty or unset, any authenticated user can access `/admin`.
- The check is enforced client-side in `app/middleware/admin-auth.global.ts` after fetching the session.

### Access Tokens for External API Calls

You can call protected API routes from outside the app using an access token:

1. Sign in via Better Auth credentials endpoint and capture the `set-auth-token` header:

   - `POST /api/auth/sign-in/email` with JSON `{ email, password }`
   - Read the `set-auth-token` response header; this is your bearer token

2. Use the token in `Authorization` when calling protected routes:

```
Authorization: Bearer <set-auth-token>
```

Server middleware accepts either session cookies or `Authorization: Bearer` tokens for all `/api/**` except `/api/contact` and `/api/auth/**`.

To require a bearer token (and ignore cookies) for API calls, set:

```
NUXT_API_REQUIRE_BEARER=1
```

This is useful when you want tools like Postman or external services to always provide a token and not rely on browser cookies.
