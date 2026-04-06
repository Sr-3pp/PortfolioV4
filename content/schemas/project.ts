import { z } from '@nuxt/content'
import { PROJECT_TYPES } from '../../app/types/project'

export const projectLinkSchema = z.object({
  name: z.string(),
  url: z.string(),
  icon: z.string().optional()
})

export const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.enum(PROJECT_TYPES),
  highlight: z.boolean().optional(),
  role: z.string().optional(),
  period: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  links: z.array(projectLinkSchema).optional(),
  image: z.string().optional(),
  cover: z.string().optional()
})
