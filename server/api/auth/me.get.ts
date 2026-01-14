import type { IncomingMessage, ServerResponse } from 'http'

export default defineEventHandler(async (event) => {
  const { getAuth } = await import('~/auth')
  const auth = await getAuth()
  // Use Better Auth API directly with H3 req/res
  const session = await auth.api.getSession(event.node.req as IncomingMessage, event.node.res as ServerResponse)
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  }
  return { user: session.user }
})
