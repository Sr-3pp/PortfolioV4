import type { ProjectType } from "~/types/Project";

export const useProjects = () => {
  const getProjects = async () => {
    const { data } = await useAsyncData('projects', () =>
      queryCollection('content').where('path', 'LIKE', '%projects%').all()
    )

    const projects: Record<ProjectType, any[]> = reactive({
      fulltime: [],
      contractor: [],
      freelance: []
    })

    // Group by type and keep a stable order by title
    data.value?.forEach((item: any) => {
      const { type }: { type: ProjectType } = item.meta || { type: 'freelance' }
      projects[type].push(item)
    })
    ;(['fulltime', 'contractor', 'freelance'] as ProjectType[]).forEach((t) => {
      projects[t].sort((a, b) => a.title.localeCompare(b.title))
    })

    return projects
  }

  const getProjectBySlug = async (type: string, slug: string) => {
    // Provide a unique key per project to avoid stale cache reuse
    const { data } = await useAsyncData(
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
