import { toWebRequest } from 'h3'
import { getAuth } from '~/auth'

export default defineEventHandler(async (event) => {
  const auth = await getAuth()
  return auth.handler(toWebRequest(event))
})
