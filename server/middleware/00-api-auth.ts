import { defineEventHandler, getRequestURL, getHeader, getMethod, createError } from 'h3'
import { URL } from 'node:url'

export default defineEventHandler(async (event) => {
  const { pathname } = getRequestURL(event)
  // Allow CORS preflight without auth
  if (getMethod(event) === 'OPTIONS') return

  // Only guard API routes
  if (!pathname.startsWith('/api/')) return

  // Allow auth endpoints themselves and the public contact endpoint
  if (pathname.startsWith('/api/auth') || pathname === '/api/contact') return

  // Forward headers to Better Auth session endpoint
  const rawCookieHeader = getHeader(event, 'cookie')
  const cookie = rawCookieHeader || ''
  const authHeader = getHeader(event, 'authorization') || getHeader(event, 'x-auth-token') || ''
  const authorization = authHeader && !/^Bearer\s+/i.test(authHeader)
    ? `Bearer ${authHeader}`
    : authHeader

  // Determine if the request is external (different Origin)
  const cfg = useRuntimeConfig()
  const origin = getHeader(event, 'origin') || ''
  const referer = getHeader(event, 'referer') || ''
  const secFetchSite = (getHeader(event, 'sec-fetch-site') || '').toLowerCase()
  const userAgent = getHeader(event, 'user-agent') || ''
  const siteUrl = String(cfg.public?.siteUrl || '')
  let isExternal = true
  try {
    const basis = origin || referer
    if (basis && siteUrl) {
      const o = new URL(basis)
      const s = new URL(siteUrl)
      isExternal = o.host !== s.host
    }
  } catch {
    // Ignore malformed URL headers
  }

  // Optional mode to always require Bearer token
  const forceBearer: boolean = !!cfg.public?.apiRequireBearer
  const debug = !!cfg.public?.debugApiAuth
  const hasAuth = !!authorization
  const hasCookie = !!rawCookieHeader
  // Decide if cookies can authenticate:
  // - Same-origin (Origin/Referer host matches)
  // - Or Sec-Fetch-Site indicates same-origin/site
  // - Or request appears to be a browser (UA) and includes cookies
  const isBrowserUA = /Mozilla|Chrome|Safari|Firefox|Edg/i.test(userAgent)
  const allowCookieAuth = (!isExternal) || (secFetchSite === 'same-origin' || secFetchSite === 'same-site') || (isBrowserUA && hasCookie)
  // Require token when external or when we cannot prove same-origin context
  const tokenOnly = forceBearer || !allowCookieAuth
  if (debug) {
    const mask = (t: string) => (t ? `${t.slice(0, 12)}…(${t.length})` : '')
    const cookieNames = hasCookie ? rawCookieHeader!.split(';').map(p => p.trim().split('=')[0]) : []
    console.log('[api-auth] incoming', {
      path: pathname,
      method: getMethod(event),
      origin: origin || null,
      referer: referer || null,
      isExternal,
      forceBearer: !!cfg.public?.apiRequireBearer,
      tokenOnly,
      secFetchSite: secFetchSite || null,
      userAgent: userAgent ? userAgent.slice(0, 80) + (userAgent.length > 80 ? '…' : '') : null,
      allowCookieAuth,
      hasAuthorization: hasAuth,
      authorizationMasked: hasAuth ? mask(authorization.replace(/^Bearer\s+/i, '')) : null,
      hasCookie,
      cookieNames,
    })
  }
  if (tokenOnly && !authorization) {
    if (debug) console.log('[api-auth] blocked: token-only and no Authorization header')
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  if (!authorization && !rawCookieHeader) {
    if (debug) console.log('[api-auth] blocked: no Authorization and no Cookie header present')
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const session: { user?: { email?: string } } = await $fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        ...(tokenOnly ? {} : { cookie }),
        ...(authorization ? { authorization } : {})
      }
    })

    const isAuthed = !!(session && session.user)
    if (!isAuthed) {
      if (debug) console.log('[api-auth] blocked: get-session returned null')
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    // Enforce admin email allowlist if configured
    const allowed = String(cfg.public?.adminEmails || '')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean)
    if (allowed.length) {
      const email = (session?.user?.email || '').toLowerCase()
      if (!email || !allowed.includes(email)) {
        if (debug) console.log('[api-auth] blocked: email not in allowlist', { email })
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
      }
    }
  } catch {
    if (debug) console.log('[api-auth] blocked: exception while validating session')
    // On any failure (including missing token/cookie), block access
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
})
