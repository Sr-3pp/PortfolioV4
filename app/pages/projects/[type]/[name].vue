<template lang="pug">
section
  template(v-if="project")
    UContainer
      UCard
        template(#header)
          div(class="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-4")
            div(class="space-y-1 flex-1")
              h1(class="text-2xl font-semibold") {{ project.title }}
              p(v-if="project.description" class="text-white/70" v-html="project.description")
            UBadge(variant="subtle") {{ project?.type || 'project' }}

        template(#default)
          ul.flex.flex-wrap.gap-2.mb-4
            li(v-for="link in project.links || []" :key="link.url" class="inline")
              UButton(
                :href="link.url"
                target="_blank"
                rel="noopener"
                color="primary"
                variant="soft"
                size="sm"
                class="mr-2 mb-2"
              ) {{ link.name }}
              
          div.grid.gap-4(class="grid-cols-1 md:grid-cols-3")
            div(class="md:col-span-2 space-y-4")
              ContentRenderer.gap-6.flex.flex-col(v-if="'body' in project" :value="project")
            div(class="md:col-span-1 space-y-4")
              div.rounded-lg.border.p-4(class="border-white/10 bg-white/5")
                div.text-sm.flex.items-center.gap-2(class="text-white/60")
                  UIcon(name="i-heroicons-user")
                  span Role
                .mt-1.font-medium {{ project?.role || '—' }}
              div.rounded-lg.border.p-4(class="border-white/10 bg-white/5")
                div.text-sm.flex.items-center.gap-2(class="text-white/60")
                  UIcon(name="i-heroicons-calendar")
                  span Period
                .mt-1.font-medium {{ project?.period || '—' }}
              div.rounded-lg.border.p-4(class="border-white/10 bg-white/5")
                div.text-sm.flex.items-center.gap-2(class="text-white/60")
                  UIcon(name="i-heroicons-cog-6-tooth")
                  span Technologies
                TechChips.mt-2(:items="project?.technologies || []" size="xs" variant="soft" color="secondary")
  p(v-if="!project") Loading...
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { getProjectTypeLabel, type ProjectDocument } from '~/types/project'
import type { JsonLdHeadScript } from '~/types/seo'

const { getProjectBySlug } = useProjects()
const route = useRoute()
const { siteDescription, absoluteUrl, defaultImage } = useSiteMeta()

const project = ref<ProjectDocument | null>(null)

const loadProject = async () => {
  const { type, name } = route.params

  if (typeof type !== 'string' || typeof name !== 'string') {
    project.value = null
    return
  }

  const result = await getProjectBySlug(type, name)
  project.value = result ?? null
}

await loadProject()

watch(
  () => [route.params.type, route.params.name],
  () => {
    void loadProject()
  }
)

const pageUrl = computed(() => absoluteUrl(route.fullPath))
const projectTypeLabel = computed(() => getProjectTypeLabel(project.value?.type))

const seoTitle = computed(() => {
  if (!project.value?.title) {
    return 'Project not found | Sr3pp'
  }

  const badge = project.value?.type ? ` ${String(project.value.type).toUpperCase()}` : ''
  return `${project.value.title}${badge} Case Study`
})

const seoDescription = computed(
  () => project.value?.description || siteDescription
)

const socialImage = computed(() => {
  const cover = project.value?.image || project.value?.cover
  return cover ? absoluteUrl(cover) : defaultImage.value
})

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: pageUrl,
  ogImage: socialImage,
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: socialImage,
  robots: computed(() => project.value ? 'index, follow' : 'noindex, follow')
})

const breadcrumbSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: absoluteUrl('/')
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: projectTypeLabel.value,
      item: absoluteUrl('/#projects')
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: project.value?.title || 'Project',
      item: pageUrl.value
    }
  ]
}))

const projectSchema = computed(() => {
  if (!project.value) {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.value.title,
    description: seoDescription.value,
    url: pageUrl.value,
    author: {
      '@type': 'Person',
      name: 'Jose Martin Ruiz Rico'
    },
    inLanguage: 'en',
    keywords: Array.isArray(project.value.technologies)
      ? project.value.technologies.join(', ')
      : undefined,
    dateModified: project.value.updatedAt,
    image: socialImage.value
  }
})

useHead(() => {
  const scripts: JsonLdHeadScript[] = []

  const projectJson = projectSchema.value
  if (projectJson) {
    scripts.push({
      key: 'ld-project',
      type: 'application/ld+json',
      children: JSON.stringify(projectJson)
    })
  }

  if (project.value) {
    scripts.push({
      key: 'ld-project-breadcrumb',
      type: 'application/ld+json',
      children: JSON.stringify(breadcrumbSchema.value)
    })
  }

  return {
    script: scripts
  }
})
</script>

<style>

</style>
