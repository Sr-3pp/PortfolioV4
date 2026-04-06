import type { ContentCollectionItem } from '@nuxt/content'
import { z } from 'zod'

export const PROJECT_TYPES = ['fulltime', 'contractor', 'freelance'] as const

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

export type ProjectType = (typeof PROJECT_TYPES)[number]
export type ProjectBuckets<T> = Record<ProjectType, T[]>
export type ProjectSearchIndex = Record<string, string>
export type ProjectTypeLabelMap = Record<ProjectType, string>

export const PROJECT_TYPE_LABELS: ProjectTypeLabelMap = {
  fulltime: 'Fulltime',
  contractor: 'Contractor',
  freelance: 'Freelance'
}

export type ProjectLink = z.infer<typeof projectLinkSchema>
export type ProjectContent = z.infer<typeof projectSchema> & {
  updatedAt?: string
}

export interface ProjectListItem {
  path: string
  title: string
  description: string
  type: ProjectType
  highlight?: boolean
  technologies?: string[]
}

export type ProjectDocument = Omit<
  ContentCollectionItem,
  keyof z.infer<typeof projectSchema> | 'updatedAt'
> & ProjectContent

export const createProjectBuckets = <T>(): ProjectBuckets<T> => ({
  fulltime: [],
  contractor: [],
  freelance: []
})

export const getProjectTypeLabel = (type: ProjectType | null | undefined) =>
  PROJECT_TYPE_LABELS[type ?? 'freelance']

export const sortProjectList = (entries: ProjectListItem[]) =>
  entries.sort((left, right) => {
    const leftHighlighted = left.highlight === true
    const rightHighlighted = right.highlight === true

    if (leftHighlighted !== rightHighlighted) {
      return leftHighlighted ? -1 : 1
    }

    return String(left.title ?? '').localeCompare(String(right.title ?? ''))
  })

export const buildProjectSearchText = (project: ProjectListItem) =>
  `${project.title ?? ''} ${project.description ?? ''} ${(project.technologies ?? []).join(' ')}`.toLowerCase()

export const buildProjectSearchIndex = (projects: ProjectBuckets<ProjectListItem>): ProjectSearchIndex => {
  const index: ProjectSearchIndex = {}

  for (const type of PROJECT_TYPES) {
    for (const project of projects[type]) {
      index[project.path] = buildProjectSearchText(project)
    }
  }

  return index
}

export const getFirstProjectTypeWithItems = (projects: ProjectBuckets<ProjectListItem>) =>
  PROJECT_TYPES.find((type) => projects[type].length > 0)
