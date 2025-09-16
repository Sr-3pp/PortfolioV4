<template lang="pug">
section
  UContainer.flex.flex-col.gap-10.py-10
    //- Header / Intro
    UCard
      template(#header)
        .flex.items-center.gap-4
          UAvatar(alt="SR3PP" src="/img/3pp.webp" size="lg")
          .flex.flex-col
            h1.text-xl.font-semibold Jose Martin Ruiz Rico
            p(class="text-white/60") Full Stack Developer focused on Vue & Nuxt
      p.mt-3.leading-relaxed(class="text-white/80") {{ profile }}
      template(#footer)
        .flex.flex-wrap.gap-2
          UButton(icon="i-heroicons-envelope" :href="`mailto:${contact.email}`" variant="soft") Email
          UButton(icon="i-heroicons-link" :href="contact.website" target="_blank" rel="noopener" variant="soft") Website
          UButton(icon="i-heroicons-user-circle" :href="contact.linkedin" target="_blank" rel="noopener" variant="soft") LinkedIn

    //- Quick stats
    Grid(:cols="1" :md="3")
      Stat(label="Experience" :value="experienceYears" icon="i-heroicons-clock-20-solid")
        span Started in 2015 (Mexico)
      Stat(label="Projects shipped" :value="projectCount" icon="i-heroicons-rectangle-stack")
        span Across full-time, contractor and freelance
      Stat(label="Certificates" :value="certificateCount" icon="i-heroicons-academic-cap")
        span Senior + Mid Vue/Nuxt focus

    //- Skills
    Grid(:cols="1" :md="2" :lg="4")
      Card(title="Frontend" subtitle="Core UI technologies")
        TechChips(:items="skills.frontend" size="xs" variant="soft")
      Card(title="Backend" subtitle="APIs and services")
        TechChips(:items="skills.backend" size="xs" variant="soft")
      Card(title="Tools" subtitle="Platforms & workflow")
        TechChips(:items="skills.tools" size="xs" variant="soft")
      Card(title="Languages" subtitle="Programming & markup")
        TechChips(:items="skills.languages" size="xs" variant="soft")

    //- Personal note / callout
    Callout(title="What drives me" type="info")
      | I love shipping clean, modular frontends with a strong emphasis on accessibility, performance, and DX. Most of my work lives in Vue/Nuxt ecosystems, but I’m comfortable across stacks when the product needs it.

    //- Recent work CTA
    UCard
      template(#header) Hand-picked case studies
      p.mt-1(class="text-white/70") Explore a curated set of projects I’ve worked on across different engagement types.
      template(#footer)
        UButton(icon="i-heroicons-rectangle-stack" @click="openProjects('projects')") Browse projects
</template>

<script lang="ts" setup>
const profile = `Frontend-focused full stack developer with 10+ years of experience. Certified Senior Vue Developer, with deep expertise in Vue, Nuxt, and modern web tooling. Known for building modular, scalable, and performant applications across diverse industries like banking, travel, and e-commerce.`

const contact = {
  website: 'https://sr3pp.dev',
  linkedin: 'https://linkedin.com/in/sr3pp',
  email: 'martin.ru@outlook.com'
}

const skills = {
  frontend: ['Vue 3', 'Nuxt 3', 'Pinia', 'Tailwind', 'Lit', 'Web Components', 'React'],
  backend: ['Node.js', 'Laravel', 'Django REST', 'MongoDB', 'MySQL'],
  tools: ['Git', 'Vercel', 'Netlify', 'Figma', 'Cloudinary', 'Prismic', 'Salesforce'],
  languages: ['JavaScript', 'TypeScript', 'PHP', 'HTML', 'SCSS', 'Python']
}

// Stats
const experienceStartYear = 2015
const experienceYears = computed(() => `${new Date().getFullYear() - experienceStartYear}+`)

const { data: projectsData } = useNuxtData('projects')
const { data: certs } = useNuxtData('certificates')

const projectCount = ref(projectsData.value.length)
const certificateCount = computed(() => (Array.isArray(certs.value.meta.certificates) ? certs.value.meta.certificates.length : 0))

// Open projects drawer from About page
const { openOverlay: openProjects } = useUiOverlay('projects')
</script>

<style scoped>
</style>
