import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
import type { ProjectType } from "~/types/Project";

export const useProjects = () => {
  const getProjects = async () => {
    const { data } = await useAsyncData<ParsedContent[] | null>('projects', () =>
      queryCollection('content').where('path', 'LIKE', '%projects%').all()
    )

    const projects: Record<ProjectType, ParsedContent[]> = reactive({
      fulltime: [],
      contractor: [],
      freelance: []
    })

    // Group by type and keep a stable order by title
    data.value?.forEach((item) => {
      const type = (item.meta?.type as ProjectType) || 'freelance'
      projects[type].push(item)
    })
    ;(['fulltime', 'contractor', 'freelance'] as ProjectType[]).forEach((t) => {
      projects[t].sort((a, b) => {
        const left = String(a.title ?? '')
        const right = String(b.title ?? '')
        return left.localeCompare(right)
      })
    })

    return projects
  }

  const getProjectBySlug = async (type: string, slug: string) => {
    // Provide a unique key per project to avoid stale cache reuse
    const { data } = await useAsyncData<ParsedContent | null>(
      `project-${type}-${slug}`,
      () =>
        queryCollection('content')
          .where('path', 'LIKE', `%projects/${type}/${slug}%`)
          .first()
    )
    return data.value
  }

  return {
    getProjects,
    getProjectBySlug
  }
}
