import { computed } from 'vue'
import { useRuntimeConfig } from '#imports'

const fallbackBaseUrl = 'https://sr3pp.dev'

const normalizeBaseUrl = (url?: string) => {
  const candidate = (url ?? '').trim()
  if (!candidate) return fallbackBaseUrl
  return candidate.replace(/\/$/, '')
}

export const useSiteMeta = () => {
  const runtime = useRuntimeConfig().public

  const siteUrl = computed(() => normalizeBaseUrl(runtime.siteUrl))

  const absoluteUrl = (path = '') => {
    if (!path) return siteUrl.value

    try {
      return new URL(path, `${siteUrl.value}/`).toString()
    } catch {
      return path
    }
  }

  const defaultImage = computed(() => absoluteUrl(runtime.siteImage || ''))

  return {
    siteName: runtime.siteName,
    siteDescription: runtime.siteDescription,
    twitterHandle: runtime.twitterHandle,
    siteUrl,
    absoluteUrl,
    defaultImage
  }
}
