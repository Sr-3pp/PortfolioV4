<template lang="pug">
UDrawer.modal-projects(v-model:open="open" description="Hand-picked case studies")
  template(#title)
    .flex.items-center.justify-between.gap-3
      span.text-lg.font-semibold My Projects
      UInput(v-model="query" size="sm" placeholder="Search projects..." class="w-60")

  template(#body)
    UTabs(v-model="activeTab" :items="tabs")

    div.mt-4
      div(v-if="isLoadingProjects" class="py-10 text-center text-sm text-gray-500")
        span Loading projects...

      div(v-else-if="visibleProjects.length === 0" class="py-10 text-center text-sm text-gray-500")
        span No projects match your search.

      ul(class="grid grid-cols-1 sm:grid-cols-3 gap-4")
        li(v-for="project in visibleProjects" :key="project.path" class="h-full")
          UCard(
            class="h-full group transition-transform duration-150 hover:-translate-y-0.5"
            :ui="{ root: project.highlight ? 'ring-1 ring-primary-500/30 border border-primary-500/40' : '' }"
            :style="project.highlight ? { background: 'rgba(59, 130, 246, 0.08)' } : undefined"
          )
            template(#header)
              .flex.items-center.justify-between
                h3.font-semibold.tracking-tight {{ project.title }}
                UBadge(size="xs" variant="subtle") {{ projectTypeLabels[activeTab] }}

            template(#default)
              p.text-sm.text-gray-500(v-if="project.description" v-html="project.description")
              ul.flex.flex-wrap.gap-2.mt-4
                li(v-for="(tech, tIdx) in project.technologies || []" :key="tIdx")
                  UBadge(variant="soft" color="secondary" size="xs") {{ tech }}

            template(#footer)
              .flex.items-center.justify-between
                UButton(:to="project.path" variant="soft" color="primary" @click="closeOverlay") View details
</template>

<script lang="ts" setup>
import {
  createProjectBuckets,
  getFirstProjectTypeWithItems,
  matchesProjectQuery,
  PROJECT_TYPE_LABELS,
  type ProjectBuckets,
  type ProjectListItem,
  type ProjectType
} from '~/types/project'

const { open, closeOverlay } = useUiOverlay('projects')
const { getProjects } = useProjects()

const query = ref('')
const isLoadingProjects = ref(false)
const hasLoadedProjects = ref(false)
const projectTypeLabels = PROJECT_TYPE_LABELS
const projects = ref<ProjectBuckets<ProjectListItem>>(createProjectBuckets())
const activeTab = ref<ProjectType>('fulltime')

const loadProjects = async () => {
  if (hasLoadedProjects.value || isLoadingProjects.value) return
  isLoadingProjects.value = true
  try {
    projects.value = await getProjects()
    activeTab.value = getFirstProjectTypeWithItems(projects.value) ?? 'fulltime'
    hasLoadedProjects.value = true
  } finally {
    isLoadingProjects.value = false
  }
}

const tabs = computed(() => [
  { label: `Full-time (${projects.value.fulltime.length})`, value: 'fulltime' },
  { label: `Contractor (${projects.value.contractor.length})`, value: 'contractor' },
  { label: `Freelance (${projects.value.freelance.length})`, value: 'freelance' }
])

watch(
  open,
  (isOpen) => {
    if (!isOpen || hasLoadedProjects.value) return
    void loadProjects()
  },
  { immediate: true }
)

const visibleProjects = computed(() => {
  const list = projects.value[activeTab.value]
  const normalizedQuery = query.value.trim().toLowerCase()

  if (!normalizedQuery) return list

  return list.filter((project) => matchesProjectQuery(project, normalizedQuery))
})

void {
  closeOverlay,
  projectTypeLabels,
  tabs,
  visibleProjects
}
</script>

<style>

</style>
