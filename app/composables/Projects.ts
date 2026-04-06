import {
  createProjectBuckets,
  PROJECT_TYPES,
  sortProjectList,
  type ProjectDocument,
  type ProjectListItem
} from '~/types/project'

export const useProjects = () => {
  const getProjects = async () => {
    const buckets = createProjectBuckets<ProjectListItem>()
    const entries = await queryCollection('projects').all()

    for (const item of entries) {
      buckets[item.type].push({
        path: item.path,
        title: item.title,
        description: item.description,
        type: item.type,
        highlight: item.highlight,
        technologies: item.technologies
      })
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

    const project = await queryCollection('projects')
      .where('path', 'LIKE', `%${normalizedType}/${normalizedSlug}%`)
      .first()

    return (project as ProjectDocument | null | undefined) ?? null
  }

  return {
    getProjects,
    getProjectBySlug
  }
}
