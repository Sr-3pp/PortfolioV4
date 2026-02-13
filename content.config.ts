import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        include: 'pages/**/*.md',
        prefix: '/'
      }
    }),
    certificates: defineCollection({
      type: 'data',
      source: 'json/certificates/*.json',
      schema: z.object({
        name: z.string(),
        issuer: z.string(),
        link: z.string(),
        thumbnail: z.string(),
      })
    }),
    cv: defineCollection({
      type: 'data',
      source: 'json/cv.json',
      schema:z.object({
        name: z.string(),
        title: z.string(),
        location: z.string(),
        contact: z.object({
          website: z.string().optional(),
          linkedin: z.string().optional(),
          github: z.string().optional(),
          email: z.string().optional(),
        }),
        profile: z.string(),
        experience: z.array(z.object({
          company: z.string(),
          role: z.string(),
          startDate: z.string(),
          endDate: z.string().optional(),
          highlights: z.array(z.string())
        })),
        freelancePreojects: z.array(z.object({
          name: z.string(),
          description: z.string(),
          link: z.string().optional(),
        })).optional(),
        education: z.array(z.object({
          program: z.string(),
          institution: z.string(),
          startDate: z.string(),
          endDate: z.string().optional(),
        })).optional(),
        skills: z.object({
          frontend: z.array(z.string()),
          backend: z.array(z.string()),
          tools: z.array(z.string()),
          languages: z.array(z.string()),
        }).optional(),
        source: z.string().optional(),
      })
    }),
    blog: defineCollection({
      type: 'data',
      source: 'blog/*.md',
        schema:z.object({}).catchall(z.any())
    })
  }
})
