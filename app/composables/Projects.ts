import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
import type { ProjectType } from '~/types/project'

const projectTypes: ProjectType[] = ['fulltime', 'contractor', 'freelance']

const createBuckets = (): Record<ProjectType, ParsedContent[]> => ({
  fulltime: [],
  contractor: [],
  freelance: []
})

const resolveProjectType = (rawType: unknown): ProjectType => {
  const normalized = String(rawType || '').toLowerCase() as ProjectType
  return projectTypes.includes(normalized) ? normalized : 'freelance'
}

const sortProjects = (entries: ParsedContent[]) =>
  entries.sort((left, right) => String(left.title ?? '').localeCompare(String(right.title ?? '')))

const createProjectKey = (type: string, slug: string) => `project-${type}-${slug}`

export const useProjects = () => {
  const getProjects = async () => {
    const { data } = await useAsyncData<ParsedContent[] | null>('projects', () =>
      queryCollection('content').where('path', 'LIKE', '%projects%').all()
    )

    const buckets = createBuckets()

    for (const item of data.value ?? []) {
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

    const { data } = await useAsyncData<ParsedContent | null>(
      createProjectKey(normalizedType, normalizedSlug),
      () =>
        queryCollection('content')
          .where('path', 'LIKE', `%projects/${normalizedType}/${normalizedSlug}%`)
          .first()
    )

    return data.value ?? null
  }

  return {
    getProjects,
    getProjectBySlug
  }
}
