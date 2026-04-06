import { z } from '@nuxt/content'

export const certificateSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  link: z.string(),
  thumbnail: z.string(),
  summary: z.string().optional()
})
