// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['@/assets/css/main.css'],
  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxt/image', '@nuxt/scripts', '@nuxt/test-utils', '@nuxt/ui', 'nuxt-nodemailer'],
  ui: {
    // Ensure icons render during SSR to avoid hydration mismatch
    icons: ['heroicons', 'mdi']
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://sr3pp.dev',
      siteName: 'Martin Ruiz · Sr3pp Portfolio',
      siteDescription:
        'Senior Vue & Nuxt engineer delivering fast, accessible web experiences for startups and enterprise teams.',
      siteImage: '/img/3pp.webp',
      twitterHandle: '@sr3pp',
      contactMail: process.env.NUXT_CONTACT_MAIL,
    },
    mongodbUri: process.env.NUXT_MONGO_URI
  },
  app: {
    head: {
      titleTemplate: (chunk) => (chunk ? `${chunk} · Sr3pp` : 'Sr3pp — Vue & Nuxt Engineer'),
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#0f172a' }
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.ico' }]
    }
  },

  nodemailer: {
    from: process.env.NUXT_EMAIL_FROM,
    host: process.env.NUXT_EMAIL_HOST,
    port: process.env.NUXT_EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.NUXT_EMAIL_USER || '',
      pass: process.env.NUXT_EMAIL_PASS || '',
    },
  },
})
