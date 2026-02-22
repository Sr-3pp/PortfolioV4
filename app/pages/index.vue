<template lang="pug">
div(aria-hidden="true")
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { JsonLdHeadScript } from '~/types/seo'

const { siteDescription, defaultImage, absoluteUrl } = useSiteMeta()

const title = 'Senior Vue & Nuxt Engineer | Martin Ruiz'
const ogImage = defaultImage.value

useSeoMeta({
  title,
  description: siteDescription,
  ogTitle: title,
  ogDescription: siteDescription,
  ogImage,
  ogUrl: absoluteUrl(),
  twitterTitle: title,
  twitterDescription: siteDescription,
  twitterCard: 'summary_large_image',
  twitterImage: ogImage
})

const personSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jose Martin Ruiz Rico',
  alternateName: 'Sr3pp',
  description: siteDescription,
  jobTitle: 'Senior Frontend Engineer',
  url: absoluteUrl(),
  image: ogImage,
  email: 'mailto:martin.ru@outlook.com',
  sameAs: [
    'https://sr3pp.dev',
    'https://linkedin.com/in/sr3pp',
    'https://github.com/Sr-3pp',
    'https://www.codewars.com/users/Sr-3pp',
    'https://codepen.io/sr-3pp'
  ],
  knowsAbout: [
    'Vue.js',
    'Nuxt.js',
    'Frontend Architecture',
    'TypeScript',
    'Accessibility',
    'Performance Optimization'
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Sr3pp Consulting'
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'MX'
  }
}))

const jsonLdScripts: JsonLdHeadScript[] = [
  {
    key: 'ld-person',
    type: 'application/ld+json',
    children: personSchema
  }
]

useHead({
  script: jsonLdScripts
})
</script>

<style>

</style>
