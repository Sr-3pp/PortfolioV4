import { z } from 'zod'

export const certificateSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  link: z.string(),
  thumbnail: z.string(),
  summary: z.string().optional()
})

export type Certificate = z.infer<typeof certificateSchema>
