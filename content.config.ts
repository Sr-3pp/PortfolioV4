import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md'
    }),
    certificates: defineCollection({
      type: 'data',
      source: 'certificates.json',
      schema:z.object({}).catchall(z.any())
    }),
    cv: defineCollection({
      type: 'data',
      source: 'cv.json',
      schema:z.object({}).catchall(z.any())
    }),
    blog: defineCollection({
      type: 'data',
      source: 'blog/*.md',
        schema:z.object({}).catchall(z.any())
    })
  }
})
