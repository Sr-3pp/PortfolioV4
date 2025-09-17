<template lang="pug">
section
  template(v-if="project")
    UContainer
      UCard
        template(#header)
          div(class="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-4")
            div(class="space-y-1 flex-1")
              h1(class="text-2xl font-semibold") {{ project.title }}
              p(v-if="project.description" class="text-white/70") {{ project.description }}
            UBadge(variant="subtle") {{ project?.meta?.type || 'project' }}

        template(#default)
          div.grid.gap-4(class="grid-cols-1 md:grid-cols-3")
            div(class="md:col-span-2 space-y-4")
              //- Render the markdown body
              ContentRenderer.gap-6.flex.flex-col(:value="project")
            div(class="md:col-span-1 space-y-4")
              div.rounded-lg.border.p-4(class="border-white/10 bg-white/5")
                div.text-sm.flex.items-center.gap-2(class="text-white/60")
                  UIcon(name="i-heroicons-user")
                  span Role
                .mt-1.font-medium {{ project?.meta?.role || '—' }}
              div.rounded-lg.border.p-4(class="border-white/10 bg-white/5")
                div.text-sm.flex.items-center.gap-2(class="text-white/60")
                  UIcon(name="i-heroicons-calendar")
                  span Period
                .mt-1.font-medium {{ project?.meta?.period || '—' }}
              div.rounded-lg.border.p-4(class="border-white/10 bg-white/5")
                div.text-sm.flex.items-center.gap-2(class="text-white/60")
                  UIcon(name="i-heroicons-cog-6-tooth")
                  span Technologies
                TechChips.mt-2(:items="project?.meta?.technologies || []" size="xs" variant="soft" color="secondary")
  p(v-if="!project") Loading...
</template>

<script lang="ts" setup>
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

const { getProjectBySlug } = useProjects()
const route = useRoute()

const project = ref<ParsedContent | null>(null)

const loadProject = async () => {
  const { type, name } = route.params
  project.value = await getProjectBySlug(type as string, name as string)
}

// Initial load
await loadProject()

// Update when navigating between dynamic params without remounting
watch(
  () => [route.params.type, route.params.name],
  async () => {
    await loadProject()
  }
)
</script>

<style>

</style>
