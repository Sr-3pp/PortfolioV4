// Global middleware to protect all routes under "/admin".
// It expects an auth session endpoint to be available at `/api/auth/session`.
// When integrating Better Auth, ensure that endpoint returns the authenticated user
// or a 401/falsey payload when not authenticated.

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return

  try {
    const cfg = useRuntimeConfig()
    const allowed = String(cfg.public?.adminEmails || '')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean)
    // Better Auth session endpoint
    const headers = process.server ? useRequestHeaders(['cookie']) : undefined
    const session: any = await $fetch('/api/auth/get-session', {
      method: 'GET',
      headers: headers as any
    })
    const isAuthed = !!(session && (session.user || session.session))
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
