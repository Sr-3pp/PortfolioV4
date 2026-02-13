import { defineEventHandler, getMethod, getRequestURL } from 'h3'
import {
  requireAuthSession,
  resolveApiAuthMode
} from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // Allow CORS preflight without auth
  if (getMethod(event) === 'OPTIONS') return

  const { pathname } = getRequestURL(event)

  // Only guard endpoints that previously required `requireSession`.
  if (!pathname.startsWith('/api/expense')) return

  const cfg = useRuntimeConfig()
  const debug = !!cfg.public?.debugApiAuth
  const authMode = resolveApiAuthMode(event, cfg.public || {})

  if (debug) {
    const mask = (token: string) => (token ? `${token.slice(0, 12)}...(${token.length})` : '')
    const cookieNames = authMode.hasCookie
      ? authMode.rawCookieHeader.split(';').map((part) => part.trim().split('=')[0])
      : []

    console.log('[api-auth] incoming', {
      path: pathname,
      method: getMethod(event),
      ...authMode.context,
      hasAuthorization: authMode.hasAuthorization,
      authorizationMasked: authMode.hasAuthorization
        ? mask(authMode.authorization.replace(/^Bearer\s+/i, ''))
        : null,
      hasCookie: authMode.hasCookie,
      cookieNames,
    })
  }

  try {
    await requireAuthSession(event, {
      allowlist: true,
      tokenOnly: authMode.tokenOnly
    })
  } catch (error: any) {
    if (debug) {
      console.log('[api-auth] blocked', {
        path: pathname,
        statusCode: error?.statusCode ?? 401,
        reason: error?.statusMessage || 'Unauthorized'
      })
    }
    throw error
  }
})
