import { toWebRequest } from 'h3'
import { auth } from "~/auth"; // import your auth config

export default defineEventHandler(async (event) => {
  const req = toWebRequest(event)
  try {
    return await auth.handler(req)
  } catch (e: any) {
    // On first cold run in serverless, Better Auth may not have created tables yet.
    // If we hit a "no such table" sqlite error, attempt to create tables once, then retry.
    const msg = e?.message || ''
    if (/no such table/i.test(msg)) {
      try {
        const ctx: any = await (auth as any).$context
        await ctx?.context?.internalAdapter?.createTables?.()
      } catch {}
      // retry once
      return await auth.handler(req)
    }
    throw e
  }
})
