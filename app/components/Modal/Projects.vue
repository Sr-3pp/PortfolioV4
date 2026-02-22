<template lang="pug">
UDrawer.modal-projects(v-model:open="open" description="Hand-picked case studies")
  template(#title)
    .flex.items-center.justify-between.gap-3
      span.text-lg.font-semibold My Projects
      UInput(v-model="query" icon="i-heroicons-magnifying-glass-20-solid" size="sm" placeholder="Search projects..." class="w-60")

  template(#body)
    UTabs(v-model="activeTab" :items="tabs")

    div.mt-4
      div(v-if="isLoadingProjects" class="py-10 text-center text-sm text-gray-500")
        span Loading projects...

      div(v-else-if="visibleProjects.length === 0" class="py-10 text-center text-sm text-gray-500")
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
              p.text-sm.text-gray-500(v-if="project.description" v-html="project.description")
              ul.flex.flex-wrap.gap-2.mt-4
                li(v-for="(tech, tIdx) in project.meta.technologies" :key="tIdx")
                  UBadge(variant="soft" color="secondary" size="xs") {{ tech }}

            template(#footer)
              .flex.items-center.justify-between
                UButton(:to="project.path" icon="i-heroicons-arrow-top-right-on-square" variant="soft" color="primary" @click="closeOverlay") View details
</template>

<script lang="ts" setup>
import type { ProjectBuckets, ProjectListItem, ProjectSearchIndex, ProjectType, ProjectTypeLabelMap } from '~/types/project'

const { open, closeOverlay } = useUiOverlay('projects')
const { getProjects } = useProjects()

const query = ref('')
const debouncedQuery = ref('')
const debounceHandle = ref<number | null>(null)
const isLoadingProjects = ref(false)
const hasLoadedProjects = ref(false)
const projectTypes: ProjectType[] = ['fulltime', 'contractor', 'freelance']
const projectTypeLabels: ProjectTypeLabelMap = {
  fulltime: 'Fulltime',
  contractor: 'Contractor',
  freelance: 'Freelance'
}

const createEmptyProjectBuckets = (): ProjectBuckets<ProjectListItem> => ({
  fulltime: [],
  contractor: [],
  freelance: []
})

const projects = ref<ProjectBuckets<ProjectListItem>>(createEmptyProjectBuckets())
const projectSearchIndex = ref<ProjectSearchIndex>({})

const setProjects = (value: ProjectBuckets<ProjectListItem>) => {
  projects.value = value

  const nextIndex: ProjectSearchIndex = {}
  for (const type of projectTypes) {
    for (const project of value[type]) {
      nextIndex[project.path] =
        `${project.title ?? ''} ${project.description ?? ''} ${(project.meta?.technologies || []).join(' ')}`.toLowerCase()
    }
  }
  projectSearchIndex.value = nextIndex

  const firstNonEmpty = projectTypes.find((type) => value[type].length > 0)
  if (firstNonEmpty) activeTab.value = firstNonEmpty
}

const loadProjects = async () => {
  if (hasLoadedProjects.value || isLoadingProjects.value) return

  isLoadingProjects.value = true
  try {
    setProjects(await getProjects())
    hasLoadedProjects.value = true
  } finally {
    isLoadingProjects.value = false
  }
}

const tabs = computed(() => [
  { label: `Full-time (${projects.value.fulltime.length})`, value: 'fulltime', icon: 'i-heroicons-briefcase' },
  { label: `Contractor (${projects.value.contractor.length})`, value: 'contractor', icon: 'i-heroicons-building-office-2' },
  { label: `Freelance (${projects.value.freelance.length})`, value: 'freelance', icon: 'i-heroicons-rocket-launch' }
])

const activeTab = ref<ProjectType>('fulltime')

const getProjectsByType = (type: ProjectType): ProjectListItem[] => {
  const buckets = projects.value

  switch (type) {
    case 'fulltime':
      return buckets.fulltime
    case 'contractor':
      return buckets.contractor
    case 'freelance':
    default:
      return buckets.freelance
  }
}

watch(
  query,
  (value) => {
    if (debounceHandle.value !== null && import.meta.client) {
      window.clearTimeout(debounceHandle.value)
    }

    if (!import.meta.client) {
      debouncedQuery.value = value
      return
    }

    debounceHandle.value = window.setTimeout(() => {
      debouncedQuery.value = value
    }, 150)
  },
  { immediate: true }
)

watch(
  open,
  (isOpen) => {
    if (!isOpen || hasLoadedProjects.value) return
    if (!import.meta.client) {
      void loadProjects()
      return
    }

    requestAnimationFrame(() => {
      void loadProjects()
    })
  },
  { immediate: true }
)

const filterProjects = (type: ProjectType): ProjectListItem[] => {
  const normalizedQuery = debouncedQuery.value.trim().toLowerCase()
  const list = getProjectsByType(type)
  if (!normalizedQuery) return list

  const filtered: ProjectListItem[] = []
  for (const project of list) {
    const haystack = projectSearchIndex.value[project.path] ?? ''
    if (haystack.includes(normalizedQuery)) {
      filtered.push(project)
    }
  }

  return filtered
}

const visibleProjects = computed(() => filterProjects(activeTab.value))

const avatarText = (title: string) => {
  if (!title) return 'P'
  const parts = title.split(/\s+/).filter(Boolean)
  const initials = parts.length >= 2 ? `${parts[0]![0]!}${parts[1]![0]!}` : parts[0]![0]
  return initials!.toUpperCase()
}

onUnmounted(() => {
  if (debounceHandle.value !== null && import.meta.client) {
    window.clearTimeout(debounceHandle.value)
  }
})

const templateBindings = {
  open,
  closeOverlay,
  tabs,
  activeTab,
  visibleProjects,
  avatarText,
  query,
  debouncedQuery,
  projects,
  projectTypeLabels,
  isLoadingProjects,
  hasLoadedProjects,
  loadProjects,
};

void templateBindings;
</script>

<style>

</style>
