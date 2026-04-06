import type { ContentCollectionItem } from '@nuxt/content'

export const PROJECT_TYPES = ['fulltime', 'contractor', 'freelance'] as const

export type ProjectType = (typeof PROJECT_TYPES)[number]
export type ProjectBuckets<T> = Record<ProjectType, T[]>
export type ProjectSearchIndex = Record<string, string>
export type ProjectTypeLabelMap = Record<ProjectType, string>

export const PROJECT_TYPE_LABELS: ProjectTypeLabelMap = {
  fulltime: 'Fulltime',
  contractor: 'Contractor',
  freelance: 'Freelance'
}

export interface ProjectLink {
  name: string
  url: string
  icon?: string
}

export interface ProjectContent {
  title: string
  description: string
  type: ProjectType
  highlight?: boolean
  role?: string
  period?: string
  technologies?: string[]
  links?: ProjectLink[]
  image?: string
  cover?: string
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
  keyof Omit<ProjectContent, 'updatedAt'> | 'updatedAt'
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

    return left.title.localeCompare(right.title)
  })

export const buildProjectSearchText = (project: ProjectListItem) =>
  `${project.title} ${project.description} ${(project.technologies ?? []).join(' ')}`.toLowerCase()

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
