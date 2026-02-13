import type { ProjectDocument, ProjectType } from '~/types/project'

const projectTypes: ProjectType[] = ['fulltime', 'contractor', 'freelance']

const createBuckets = (): Record<ProjectType, ProjectDocument[]> => ({
  fulltime: [],
  contractor: [],
  freelance: []
})

const resolveProjectType = (rawType: unknown): ProjectType => {
  const normalized = String(rawType || '').toLowerCase() as ProjectType
  return projectTypes.includes(normalized) ? normalized : 'freelance'
}

const sortProjects = (entries: ProjectDocument[]) =>
  entries.sort((left, right) => String(left.title ?? '').localeCompare(String(right.title ?? '')))

const createProjectKey = (type: string, slug: string) => `project-${type}-${slug}`

export const useProjects = () => {
  const getProjects = async () => {
    const { data } = await useAsyncData('projects', () =>
      queryCollection('content').where('path', 'LIKE', '%projects%').all()
    )

    const buckets = createBuckets()
    const entries = Array.isArray(data.value) ? (data.value as ProjectDocument[]) : []

    for (const item of entries) {
      const type = resolveProjectType(item.meta?.type)
      buckets[type].push(item)
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
