<template lang="pug">
section
  UContainer.flex.flex-col.gap-10.py-10
    UCard
      template(#header)
        .flex.items-center.gap-4
          UAvatar(:alt="name" :src="avatar" size="lg")
          .flex.flex-col
            h1.text-xl.font-semibold {{ name }}
            p(class="text-white/60") {{ headline }}
      ContentRenderer.mt-3.leading-relaxed(v-if="about" :value="about" class="text-white/80")
      template(#footer)
        .flex.flex-wrap.gap-2
          UButton(icon="i-heroicons-envelope" :href="`mailto:${contact.email}`" variant="soft") Email
          UButton(icon="i-heroicons-user-circle" :href="contact.linkedin" target="_blank" rel="noopener" variant="soft") LinkedIn

    ClientOnly
      Grid(:cols="1" :md="3")
        Stat(label="Experience" :value="experienceYears" icon="i-heroicons-clock-20-solid")
          span {{ experienceNote }}
        Stat(label="Projects shipped" :value="projectCount" icon="i-heroicons-rectangle-stack")
          span Across full-time, contractor and freelance
        Stat(label="Certificates" :value="certificateCount" icon="i-heroicons-academic-cap")
          span Senior + Mid Vue/Nuxt focus

    Grid(:cols="1" :md="2" :lg="4")
      Card(
        v-for="section in skills"
        :key="section.key || section.title"
        :title="section.title"
        :subtitle="section.subtitle"
      )
        TechChips(:items="section.items" size="xs" variant="soft")

    UAlert(
      v-if="alert"
      :title="alert.title"
      :description="alert.description"
      icon="i-heroicons-information-circle"
      :ui="{ base: 'leading-relaxed' }"
    )
    UCard
      template(#header) Elsewhere
      p(class="text-white/70 text-sm mb-3") Follow my experiments and code challenges across the web.
      ul.flex.flex-wrap.gap-2
        li(v-for="social in socials" :key="social.label")
          UButton(:href="social.href" target="_blank" rel="noopener" :icon="social.icon" variant="soft" size="sm") {{ social.label }}

    UCard(v-if="cta")
      template(#header) {{ cta.title }}
      p.mt-1(class="text-white/70" v-html="cta.description")
      template(#footer)
        UButton(icon="i-heroicons-rectangle-stack" @click="openProjects()") {{ cta.buttonLabel }}
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { AboutContent, AboutCta, AboutContact, AboutSocialLink } from '~/types/about'

const { siteDescription, absoluteUrl, defaultImage } = useSiteMeta()

const { data: aboutData } = await useAsyncData<AboutContent | null>('about', () =>
  queryCollection('content').path('/about').first()
)

type NormalizedSkillSection = {
  key: string
  title: string
  subtitle: string
  items: string[]
}

const about = computed<AboutContent | null>(() => aboutData.value)

const name = computed(() => about.value?.name ?? 'Jose Martin Ruiz Rico')
const headline = computed(() => about.value?.headline ?? 'Senior Frontend Engineer & Vue/Nuxt Specialist')
const avatar = computed(() => about.value?.avatar ?? '/img/3pp.webp')

const defaultContact: Required<AboutContact> = {
  website: 'https://sr3pp.dev',
  linkedin: 'https://linkedin.com/in/sr3pp',
  email: 'martin.ru@outlook.com'
}

const contact = computed<Required<AboutContact>>(() => ({
  ...defaultContact,
  ...(about.value?.contact ?? {})
}))

const skills = computed<NormalizedSkillSection[]>(() => {
  const sections = about.value?.skills
  if (!Array.isArray(sections)) return []
  return sections.map((section) => ({
    key: section.key ?? section.title ?? '',
    title: section.title ?? '',
    subtitle: section.subtitle ?? '',
    items: Array.isArray(section.items) ? section.items : []
  }))
})

const experienceYears = computed(() => {
  const start = Number(about.value?.experienceStartYear ?? 2015)
  return `${Math.max(0, new Date().getFullYear() - start)}+`
})

const defaultExperienceNote = 'Started in 2015 (Mexico)'

const experienceNote = computed(
  () => about.value?.meta?.experienceNote ?? about.value?.experienceNote ?? defaultExperienceNote
)

const { data: projectsData } = useNuxtData('projects')
const { data: certs } = useNuxtData('certificates')

const projectCount = computed(() => projectsData.value?.length ?? 0)

const certificateCount = computed(() => {
  const certificates = certs.value?.meta?.certificates
  return Array.isArray(certificates) ? certificates.length : 0
})

const socials = computed<AboutSocialLink[]>(() => {
  const metaSocials = about.value?.meta?.socials
  if (Array.isArray(metaSocials)) return metaSocials

  const rootSocials = about.value?.socials
  if (Array.isArray(rootSocials)) return rootSocials

  return []
})

const alert = computed(() => about.value?.alert ?? null)

const defaultCta: Required<AboutCta> = {
  title: 'Hand-picked case studies',
  description: 'Explore a curated set of projects I’ve worked on across different engagement types.',
  buttonLabel: 'Browse projects'
}

const cta = computed<Required<AboutCta>>(() => {
  const data = about.value?.cta
  if (!data) return defaultCta

  return {
    title: data.title ?? defaultCta.title,
    description: data.description ?? defaultCta.description,
    buttonLabel: data.buttonLabel ?? defaultCta.buttonLabel
  }
})

const { openOverlay } = useUiOverlay('projects')
const openProjects = () => openOverlay()

const pageUrl = absoluteUrl('/about')
const title = 'About Martin Ruiz | Senior Vue & Nuxt Engineer'
const description =
  'Discover Martin Ruiz’s background as a senior Vue and Nuxt engineer, including skills, certifications, and featured work history.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: pageUrl,
  ogImage: defaultImage.value,
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: defaultImage.value
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
      name: 'About',
      item: pageUrl
    }
  ]
}))

const aboutSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: title,
  description,
  url: pageUrl,
  breadcrumb: breadcrumbSchema.value,
  about: {
    '@type': 'Person',
    name: name.value,
    alternateName: 'Sr3pp',
    jobTitle: 'Senior Frontend Engineer',
    description: siteDescription,
    image: defaultImage.value,
    sameAs: socials.value.map((social) => social.href)
  }
}))

useHead(() => ({
  script: [
    {
      key: 'ld-about',
      type: 'application/ld+json',
      children: JSON.stringify(aboutSchema.value)
    },
    {
      key: 'ld-breadcrumb-about',
      type: 'application/ld+json',
      children: JSON.stringify(breadcrumbSchema.value)
    }
  ]
}))

const templateBindings = {
  contact,
  skills,
  experienceYears,
  experienceNote,
  projectCount,
  certificateCount,
  openProjects,
  socials,
  about,
  name,
  headline,
  avatar,
  alert,
  cta
};

void templateBindings;
</script>

<style scoped>
</style>
