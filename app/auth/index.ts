import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { bearer } from "better-auth/plugins";
import { join, dirname } from "node:path";
import { mkdirSync } from "node:fs";

// Resolve an absolute, writable path for the SQLite database.
// Avoid using "~" (Nuxt alias) as this must be a filesystem path.
// Prefer explicit path via env. In serverless (Vercel), use /tmp (writable).
function isVercelLike() {
  return !!(process.env.VERCEL || process.env.NITRO_PRESET === 'vercel' || process.env.NOW_REGION)
}

let dbFile = process.env.BETTER_AUTH_SQLITE_PATH || ''
if (!dbFile) dbFile = isVercelLike() ? '/tmp/auth.sqlite' : join(process.cwd(), '.data', 'auth.sqlite')

// Ensure the directory exists before opening the database; if not writable, fall back to /tmp
try {
  mkdirSync(dirname(dbFile), { recursive: true })
} catch {
  dbFile = '/tmp/auth.sqlite'
  try { mkdirSync(dirname(dbFile), { recursive: true }) } catch {}
}

export const auth = betterAuth({
  // REQUIRED: Provide a strong, stable secret in production
  secret: process.env.BETTER_AUTH_SECRET || (process.env.NODE_ENV === 'production' ? undefined as any : 'dev-secret-change-me'),
  database: new Database(dbFile),
  // Ensure dev + production origins are trusted to avoid "Invalid origin" during auth
  basePath: "/api/auth",
  trustedOrigins: (() => {
    const origins: string[] = []
    const site = process.env.NUXT_PUBLIC_SITE_URL
    if (site) {
      try { origins.push(new URL(site).origin) } catch {}
    }
    // Common local dev origins
    origins.push('http://localhost:3000', 'http://127.0.0.1:3000')
    return origins
  })(),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  plugins: [
    // Expose/accept Authorization: Bearer <session-token>
    bearer()
  ],
  databaseHooks: {
    user: {
      create: {
        before(user) {
          if (!user?.name) {
            const fallback = (user?.email || '').split('@')[0] || 'User'
            return { data: { ...user, name: fallback } }
          }
        }
      }
    }
  }
});
