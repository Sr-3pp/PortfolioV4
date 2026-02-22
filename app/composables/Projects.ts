import type { ProjectBuckets, ProjectDocument, ProjectListItem, ProjectType } from '~/types/project'

const projectTypes: ProjectType[] = ['fulltime', 'contractor', 'freelance']

const createBuckets = <T>(): ProjectBuckets<T> => ({
  fulltime: [],
  contractor: [],
  freelance: []
})

const resolveProjectType = (rawType: unknown): ProjectType => {
  const normalized = String(rawType || '').toLowerCase() as ProjectType
  return projectTypes.includes(normalized) ? normalized : 'freelance'
}

const sortProjects = (entries: ProjectListItem[]) =>
  entries.sort((left, right) => String(left.title ?? '').localeCompare(String(right.title ?? '')))

type ProjectListSource = {
  path?: unknown
  title?: unknown
  description?: unknown
  meta?: {
    type?: unknown
    technologies?: unknown
  } | null
}

const toProjectListItem = (item: ProjectListSource): ProjectListItem | null => {
  const path = typeof item.path === 'string' ? item.path : ''
  if (!path) return null

  const technologies = Array.isArray(item.meta?.technologies)
    ? item.meta!.technologies.filter((tech): tech is string => typeof tech === 'string')
    : []

  return {
    path,
    title: typeof item.title === 'string' ? item.title : undefined,
    description: typeof item.description === 'string' ? item.description : undefined,
    meta: {
      type: typeof item.meta?.type === 'string' ? item.meta.type : undefined,
      technologies
    }
  }
}

const createProjectKey = (type: string, slug: string) => `project-${type}-${slug}`

export const useProjects = () => {
  const getProjects = async () => {
    const { data } = await useAsyncData('projects', () =>
      queryCollection('content').where('path', 'LIKE', '%projects%').all()
    )

    const buckets = createBuckets<ProjectListItem>()
    const entries = Array.isArray(data.value) ? (data.value as ProjectListSource[]) : []

    for (const item of entries) {
      const normalized = toProjectListItem(item)
      if (!normalized) continue

      const type = resolveProjectType(normalized.meta?.type)
      buckets[type].push(normalized)
    }

    projectTypes.forEach((type) => sortProjects(buckets[type]))

    return buckets
  }

  const getProjectBySlug = async (type: string, slug: string) => {
    const normalizedType = type.trim()
    const normalizedSlug = slug.trim()

    if (!normalizedType || !normalizedSlug) {
      return null
    }

    const { data } = await useAsyncData(
      createProjectKey(normalizedType, normalizedSlug),
      () =>
        queryCollection('content')
          .where('path', 'LIKE', `%projects/${normalizedType}/${normalizedSlug}%`)
          .first()
    )

    return (data.value as ProjectDocument | null | undefined) ?? null
  }

  return {
    getProjects,
    getProjectBySlug
  }
}
