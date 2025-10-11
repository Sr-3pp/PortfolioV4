import { getHeader, createError, type H3Event } from 'h3'

export async function requireSession(
  event: H3Event,
  opts: { allowlist?: boolean; tokenOnly?: boolean } = {}
) {
  const { allowlist = true, tokenOnly = false } = opts
  const rawCookieHeader = getHeader(event, 'cookie')
  const cookie = tokenOnly ? '' : (rawCookieHeader || '')
  const rawAuth = getHeader(event, 'authorization') || getHeader(event, 'x-auth-token') || ''
  const authorization = rawAuth && !/^Bearer\s+/i.test(rawAuth) ? `Bearer ${rawAuth}` : rawAuth

  // If tokenOnly is required but there is no Authorization header → 401
  if (tokenOnly && !authorization) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  if (!authorization && !rawCookieHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const session: { user?: { email?: string } } | null = await $fetch('/api/auth/me', {
    method: 'GET',
    headers: {
      ...(cookie ? { cookie } : {}),
      ...(authorization ? { authorization } : {}),
    },
  }).catch(() => null)

  const isAuthed = !!(session && session.user)
  if (!isAuthed) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  if (allowlist) {
    const cfg = useRuntimeConfig()
    const allowed = String(cfg.public?.adminEmails || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
    if (allowed.length) {
      const email = (session?.user?.email || '').toLowerCase()
      if (!email || !allowed.includes(email)) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
      }
    }
  }

  return session
}
