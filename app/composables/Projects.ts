import {
  createProjectBuckets,
  PROJECT_TYPES,
  sortProjectList,
  type ProjectDocument,
  type ProjectListItem
} from '~/types/project'

const createProjectKey = (type: string, slug: string) => `project-${type}-${slug}`

export const useProjects = () => {
  const getProjects = async () => {
    const { data } = await useAsyncData<ProjectListItem[]>('projects', () =>
      queryCollection('projects').all()
    )

    const buckets = createProjectBuckets<ProjectListItem>()
    const entries = data.value ?? []

    for (const item of entries) {
      buckets[item.type].push(item)
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
        queryCollection('projects')
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
