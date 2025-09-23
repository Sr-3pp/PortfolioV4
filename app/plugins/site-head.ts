import { computed } from 'vue'
import { defineNuxtPlugin, useHead, useRoute, useRuntimeConfig } from '#imports'

const truthy = <T>(value: T | false | null | undefined): value is T => Boolean(value)

const stripTrailingSlash = (url: string) => url.replace(/\/$/, '')

const createAbsoluteUrl = (path: string, base: string) => {
  if (!path) {
    return base
  }

  try {
    return new URL(path, base).toString()
  } catch (error) {
    console.warn('Failed to build absolute URL for', path, error)
    return path
  }
}

export default defineNuxtPlugin(() => {
  const runtime = useRuntimeConfig().public
  const route = useRoute()

  const siteUrl = computed(() => stripTrailingSlash(runtime.siteUrl || ''))

  const canonicalUrl = computed(() => {
    const base = siteUrl.value
    if (!base) {
      return route.path
    }

    const path = route.path === '/' ? '' : route.fullPath
    return createAbsoluteUrl(path, `${base}/`)
  })

  const ogImage = computed(() => createAbsoluteUrl(runtime.siteImage || '', `${siteUrl.value}/`))

  useHead({
    title: runtime.siteName,
    meta: [
      { key: 'description', name: 'description', content: runtime.siteDescription },
      { key: 'og:site_name', property: 'og:site_name', content: runtime.siteName },
      { key: 'og:type', property: 'og:type', content: 'website' },
      { key: 'og:url', property: 'og:url', content: canonicalUrl },
      { key: 'og:image', property: 'og:image', content: ogImage },
      { key: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      runtime.twitterHandle && { key: 'twitter:site', name: 'twitter:site', content: runtime.twitterHandle },
      { key: 'twitter:image', name: 'twitter:image', content: ogImage }
    ].filter(truthy),
    link: [{ rel: 'canonical', href: canonicalUrl }]
  })
})
