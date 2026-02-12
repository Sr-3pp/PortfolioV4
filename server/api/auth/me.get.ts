import { getSessionFromRequest } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const session = await getSessionFromRequest(event)
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  }
  return { user: session.user }
})
