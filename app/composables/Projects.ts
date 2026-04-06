import {
  createProjectBuckets,
  normalizeProjectListItem,
  PROJECT_TYPES,
  resolveProjectType,
  sortProjectList,
  type ProjectDocument,
  type ProjectListItem
} from '~/types/project'

const createProjectKey = (type: string, slug: string) => `project-${type}-${slug}`

export const useProjects = () => {
  const getProjects = async () => {
    const { data } = await useAsyncData('projects', () =>
      queryCollection('content').where('path', 'LIKE', '%projects%').all()
    )

    const buckets = createProjectBuckets<ProjectListItem>()
    const entries = Array.isArray(data.value) ? data.value : []

    for (const item of entries) {
      const normalized = normalizeProjectListItem(item)
      if (!normalized) continue

      const type = resolveProjectType(normalized.meta?.type)
      buckets[type].push(normalized)
    }

    PROJECT_TYPES.forEach((type) => sortProjectList(buckets[type]))

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
