<template lang="pug">
UDrawer.modal-projects(v-model:open="open" description="Hand-picked case studies")
  template(#title)
    .flex.items-center.justify-between.gap-3
      span.text-lg.font-semibold My Projects
      UInput(v-model="query" icon="i-heroicons-magnifying-glass-20-solid" size="sm" placeholder="Search projects..." class="w-60")

  template(#body)
    UTabs(v-model="activeTab" :items="tabs")

    div.mt-4
      div(v-if="visibleProjects.length === 0" class="py-10 text-center text-sm text-gray-500")
        span No projects match your search.

      ul(class="grid grid-cols-1 sm:grid-cols-3 gap-4")
        li(v-for="project in visibleProjects" :key="project.path" class="h-full")
          UCard(class="h-full group transition-transform duration-150 hover:-translate-y-0.5")
            template(#header)
              .flex.items-center.justify-between
                .flex.items-center.gap-3
                  UAvatar(:alt="project.title" :text="avatarText(project.title)" size="md")
                  h3.font-semibold.tracking-tight {{ project.title }}
                UBadge(size="xs" variant="subtle") {{ projectTypeLabels[activeTab] }}

            template(#default)
              p.text-sm.text-gray-500 {{ project.description }}
              ul.flex.flex-wrap.gap-2.mt-4
                li(v-for="(tech, tIdx) in project.meta.technologies" :key="tIdx")
                  UBadge(variant="soft" color="secondary" size="xs") {{ tech }}

            template(#footer)
              .flex.items-center.justify-between
                UButton(:to="project.path" icon="i-heroicons-arrow-top-right-on-square" variant="soft" color="primary" @click="closeOverlay") View details
</template>

<script lang="ts" setup>
import type { ProjectType } from '~/types/project'

const { open, closeOverlay } = useUiOverlay('projects')
const { getProjects } = useProjects()


const projects = await getProjects()

const query = ref('')
const projectTypes: ProjectType[] = ['fulltime', 'contractor', 'freelance']
const projectTypeLabels: Record<ProjectType, string> = {
  fulltime: 'Fulltime',
  contractor: 'Contractor',
  freelance: 'Freelance'
}

const tabs = computed(() => [
  { label: `Full-time (${projects.fulltime.length})`, value: 'fulltime', icon: 'i-heroicons-briefcase' },
  { label: `Contractor (${projects.contractor.length})`, value: 'contractor', icon: 'i-heroicons-building-office-2' },
  { label: `Freelance (${projects.freelance.length})`, value: 'freelance', icon: 'i-heroicons-rocket-launch' }
])

const activeTab = ref<ProjectType>(projectTypes.find(type => projects[type].length > 0) || 'fulltime')

const filterProjects = (type: ProjectType) => {
  const normalizedQuery = query.value.trim().toLowerCase()
  const list = projects[type]
  if (!normalizedQuery) return list
  return list.filter((project) => {
    const haystack = `${project.title} ${project.description} ${(project.meta?.technologies || []).join(' ')}`.toLowerCase()
    return haystack.includes(normalizedQuery)
  })
}

const visibleProjects = computed(() => filterProjects(activeTab.value))

const avatarText = (title: string) => {
  if (!title) return 'P'
  const parts = title.split(/\s+/).filter(Boolean)
  const initials = parts.length >= 2 ? `${parts[0]![0]!}${parts[1]![0]!}` : parts[0]![0]
  return initials!.toUpperCase()
}

const templateBindings = {
  open,
  closeOverlay,
  tabs,
  activeTab,
  visibleProjects,
  avatarText,
  query,
  projects,
  projectTypeLabels,
};

void templateBindings;
</script>

<style>

</style>
