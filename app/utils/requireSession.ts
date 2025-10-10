import { getHeader, createError } from 'h3'

export async function requireSession(
  event: any,
  opts: { allowlist?: boolean; tokenOnly?: boolean } = {}
) {
  const { allowlist = true, tokenOnly = false } = opts
  const cookie = tokenOnly ? '' : (getHeader(event, 'cookie') || '')
  const authorization = getHeader(event, 'authorization') || ''

  if (tokenOnly && !authorization) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const session: any = await $fetch('/api/auth/get-session', {
    method: 'GET',
    headers: {
      ...(cookie ? { cookie } : {}),
      ...(authorization ? { authorization } : {}),
    },
  }).catch(() => null)

  const isAuthed = !!(session && (session.user || session.session))
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

