import { promises as fs } from 'node:fs'
import { join, resolve } from 'node:path'
import { defineEventHandler, getRequestURL, setHeader } from 'h3'
import { withoutTrailingSlash, withLeadingSlash } from 'ufo'
import { useRuntimeConfig } from '#imports'

type SitemapEntry = {
  loc: string
  lastmod?: string
}

const PROJECT_TYPES = ['fulltime', 'contractor', 'freelance'] as const

const toIsoString = (date: Date | undefined) => (date ? date.toISOString() : undefined)

const buildAbsoluteUrl = (path: string, base: string) => {
  try {
    return new URL(withLeadingSlash(path), `${withoutTrailingSlash(base)}/`).toString()
  } catch {
    return path
  }
}

const gatherProjectRoutes = async () => {
  const contentRoot = resolve(process.cwd(), 'content/projects')
  const entries: SitemapEntry[] = []

  await Promise.all(
    PROJECT_TYPES.map(async (type) => {
      const dir = join(contentRoot, type)

      try {
        const files = await fs.readdir(dir)

        await Promise.all(
          files
            .filter((file) => file.endsWith('.md'))
            .map(async (file) => {
              const slug = file.replace(/\.md$/, '')
              const loc = `/projects/${type}/${slug}`
              const stats = await fs.stat(join(dir, file))
              entries.push({ loc, lastmod: toIsoString(stats.mtime) })
            })
        )
      } catch (error) {
        console.warn(`Unable to read project content for '${type}'`, error)
      }
    })
  )

  return entries
}

export default defineEventHandler(async (event) => {
  const runtime = useRuntimeConfig(event)
  const requestUrl = getRequestURL(event)
  const siteUrl = runtime.public.siteUrl || `${requestUrl.origin}`

  const urls: SitemapEntry[] = [
    { loc: '/' },
    { loc: '/about' }
  ]

  urls.push(...(await gatherProjectRoutes()))

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((entry) => {
      const loc = buildAbsoluteUrl(entry.loc, siteUrl)
      const lastmod = entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''
      return `<url><loc>${loc}</loc>${lastmod}</url>`
    }),
    '</urlset>'
  ].join('')

  setHeader(event, 'Content-Type', 'application/xml')
  return body
})
