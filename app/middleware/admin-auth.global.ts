// Global middleware to protect all routes under "/admin".
// It checks authentication via `/api/auth/me` which returns `{ user }` or 401.

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return

  try {
    const cfg = useRuntimeConfig()
    const allowed = String(cfg.public?.adminEmails || '')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean)
    // Better Auth `me` endpoint; forward cookies on SSR
    const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
    const session: { user?: { email?: string } } | null = await $fetch('/api/auth/me', {
      method: 'GET',
      headers: headers as Record<string, string> | undefined
    })
    const isAuthed = !!(session && session.user)
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
