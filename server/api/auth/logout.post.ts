import type { IncomingMessage, ServerResponse } from 'http'

export default defineEventHandler(async (event) => {
  const { getAuth } = await import('~/auth')
  const auth = await getAuth()
  try {
    await auth.api.signOut(event.node.req as IncomingMessage, event.node.res as ServerResponse)
  } catch {
    // Even if signOut throws (e.g., no session), return success to keep UX simple
  }
  return { success: true }
})
