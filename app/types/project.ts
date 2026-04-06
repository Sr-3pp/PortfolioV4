import type { ContentCollectionItem } from '@nuxt/content'

export type ProjectType = 'fulltime' | 'contractor' | 'freelance'
export type ProjectBuckets<T> = Record<ProjectType, T[]>
export type ProjectSearchIndex = Record<string, string>
export type ProjectTypeLabelMap = Record<ProjectType, string>

export const PROJECT_TYPES: ProjectType[] = ['fulltime', 'contractor', 'freelance']
export const PROJECT_TYPE_LABELS: ProjectTypeLabelMap = {
  fulltime: 'Fulltime',
  contractor: 'Contractor',
  freelance: 'Freelance'
}

export interface ProjectLink {
  url: string
  name: string
  icon?: string
}

export interface ProjectMeta {
  highlight?: boolean
  type?: ProjectType
  links?: ProjectLink[]
  role?: string
  period?: string
  technologies?: string[]
  image?: string
  cover?: string
}

export interface ProjectListItem {
  path: string
  title?: string
  description?: string
  meta?: Pick<ProjectMeta, 'highlight' | 'type' | 'technologies'>
}

export interface ProjectContent {
  title?: string
  description?: string
  meta?: ProjectMeta
  updatedAt?: string
}

export type ProjectDocument = Omit<ContentCollectionItem, 'title' | 'description' | 'meta' | 'updatedAt'> & ProjectContent

type ProjectListSource = {
  path?: unknown
  title?: unknown
  description?: unknown
  meta?: {
    highlight?: unknown
    type?: unknown
    technologies?: unknown
  } | null
}

export const createProjectBuckets = <T>(): ProjectBuckets<T> => ({
  fulltime: [],
  contractor: [],
  freelance: []
})

export const resolveProjectType = (rawType: unknown): ProjectType => {
  const normalized = String(rawType || '').toLowerCase() as ProjectType
  return PROJECT_TYPES.includes(normalized) ? normalized : 'freelance'
}

export const getProjectTypeLabel = (type: unknown) => PROJECT_TYPE_LABELS[resolveProjectType(type)]

export const sortProjectList = (entries: ProjectListItem[]) =>
  entries.sort((left, right) => {
    const leftHighlighted = left.meta?.highlight === true
    const rightHighlighted = right.meta?.highlight === true

    if (leftHighlighted !== rightHighlighted) {
      return leftHighlighted ? -1 : 1
    }

    return String(left.title ?? '').localeCompare(String(right.title ?? ''))
  })

export const normalizeProjectListItem = (item: ProjectListSource): ProjectListItem | null => {
  const path = typeof item.path === 'string' ? item.path : ''
  if (!path) return null

  const technologies = Array.isArray(item.meta?.technologies)
    ? item.meta.technologies.filter((tech): tech is string => typeof tech === 'string')
    : []

  return {
    path,
    title: typeof item.title === 'string' ? item.title : undefined,
    description: typeof item.description === 'string' ? item.description : undefined,
    meta: {
      highlight: item.meta?.highlight === true,
      type: resolveProjectType(item.meta?.type),
      technologies
    }
  }
}

export const buildProjectSearchText = (project: ProjectListItem) =>
  `${project.title ?? ''} ${project.description ?? ''} ${(project.meta?.technologies || []).join(' ')}`.toLowerCase()

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
