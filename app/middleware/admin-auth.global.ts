// Global middleware to protect all routes under "/admin".
// It checks authentication via `/api/auth/me` which returns `{ user }` or 401.

type SessionUser = {
  email?: string | null
}

type SessionResponse = {
  user?: SessionUser
} | null

const parseAllowlist = (value: string | undefined) =>
  String(value || '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return

  try {
    const cfg = useRuntimeConfig()
    const allowed = parseAllowlist(cfg.public?.adminEmails)

    // Better Auth `me` endpoint; forward cookies on SSR
    const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
    const session = await $fetch<SessionResponse>('/api/auth/me', {
      method: 'GET',
      headers: headers as Record<string, string> | undefined
    })

    const isAuthed = !!session?.user
    if (!isAuthed) {
      return navigateTo({ path: '/login', query: { next: to.fullPath } })
    }

    // If allowlist is provided, enforce it
    if (allowed.length) {
      const email = (session?.user?.email || '').toLowerCase()
      if (!email || !allowed.includes(email)) {
        return navigateTo({ path: '/', query: { forbidden: '1' } })
      }
    }
  } catch {
    // If session endpoint is missing or errors, treat as unauthenticated.
    return navigateTo({ path: '/login', query: { next: to.fullPath } })
  }
})
