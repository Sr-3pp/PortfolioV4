import { createError, getHeader, type H3Event } from 'h3'
import { URL } from 'node:url'

export type AuthSession = { user?: { email?: string | null } } | null

const BEARER_PREFIX = /^Bearer\s+/i

type PublicRuntimeConfig = {
  siteUrl?: string
  adminEmails?: string
  apiRequireBearer?: boolean
  debugApiAuth?: boolean
}

export type RequireAuthSessionOptions = {
  allowlist?: boolean
  tokenOnly?: boolean
}

export function getAuthorizationHeader(event: H3Event) {
  const raw =
    getHeader(event, 'authorization') ||
    getHeader(event, 'x-auth-token') ||
    ''

  if (!raw) return ''
  return BEARER_PREFIX.test(raw) ? raw : `Bearer ${raw}`
}

export function parseAdminAllowlist(value: string | undefined) {
  return String(value || '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

function isExternalRequest(event: H3Event, siteUrl: string) {
  const origin = getHeader(event, 'origin') || ''
  const referer = getHeader(event, 'referer') || ''
  const basis = origin || referer

  if (!basis || !siteUrl) return true

  try {
    const incoming = new URL(basis)
    const site = new URL(siteUrl)
    return incoming.host !== site.host
  } catch {
    return true
  }
}

export function resolveApiAuthMode(event: H3Event, cfg: PublicRuntimeConfig) {
  const siteUrl = String(cfg.siteUrl || '')
  const secFetchSite = (getHeader(event, 'sec-fetch-site') || '').toLowerCase()
  const userAgent = getHeader(event, 'user-agent') || ''
  const rawCookieHeader = getHeader(event, 'cookie') || ''
  const authorization = getAuthorizationHeader(event)

  const hasCookie = !!rawCookieHeader
  const hasAuthorization = !!authorization
  const isBrowserUA = /Mozilla|Chrome|Safari|Firefox|Edg/i.test(userAgent)
  const external = isExternalRequest(event, siteUrl)

  const allowCookieAuth =
    !external ||
    secFetchSite === 'same-origin' ||
    secFetchSite === 'same-site' ||
    (isBrowserUA && hasCookie)

  const forceBearer = !!cfg.apiRequireBearer
  const tokenOnly = forceBearer || !allowCookieAuth

  return {
    tokenOnly,
    hasCookie,
    hasAuthorization,
    authorization,
    rawCookieHeader,
    context: {
      origin: getHeader(event, 'origin') || null,
      referer: getHeader(event, 'referer') || null,
      secFetchSite: secFetchSite || null,
      userAgent: userAgent
        ? userAgent.slice(0, 80) + (userAgent.length > 80 ? '...' : '')
        : null,
      external,
      allowCookieAuth,
      tokenOnly,
      forceBearer
    }
  }
}

export async function getSessionFromRequest(
  event: H3Event,
  opts: { tokenOnly?: boolean } = {}
) {
  const { getAuth } = await import('~/auth')
  const auth = await getAuth()
  const tokenOnly = !!opts.tokenOnly
  const headers = new Headers()

  for (const [key, value] of Object.entries(event.node.req.headers)) {
    if (value == null) continue

    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item)
      continue
    }

    headers.set(key, value)
  }

  if (tokenOnly) {
    headers.delete('cookie')
  }

  return (await auth.api.getSession({ headers })) as AuthSession
}

export async function requireAuthSession(
  event: H3Event,
  opts: RequireAuthSessionOptions = {}
) {
  const { allowlist = true, tokenOnly = false } = opts
  const rawCookieHeader = getHeader(event, 'cookie') || ''
  const authorization = getAuthorizationHeader(event)

  if (tokenOnly && !authorization) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  if (!authorization && !rawCookieHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const session = await getSessionFromRequest(event, { tokenOnly }).catch(() => null)

  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  if (allowlist) {
    const cfg = useRuntimeConfig()
    const allowed = parseAdminAllowlist(cfg.public?.adminEmails)

    if (allowed.length) {
      const email = (session.user.email || '').toLowerCase()
      if (!email || !allowed.includes(email)) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
      }
    }
  }

  return session
}
