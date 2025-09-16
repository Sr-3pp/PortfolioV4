---
type: freelance
title: All American Finishing
description: Delivered a modern marketing site using Laravel with a Vue/Nuxt frontend, focusing on modular components, a maintainable codebase, and straightforward content updates for the business team.
technologies: [Laravel, PHP, Vue.js, Nuxt 2, TypeScript, Sass]
---

# All American Finishing

<Grid cols="1" :md="3" v-if="links && (links.live || links.demo || links.repo)">
  <Btn v-if="links.live" :href="links.live" target="_blank" icon="i-heroicons-arrow-top-right-on-square" color="primary">Visit Site</Btn>
  <Btn v-if="links.demo" :href="links.demo" target="_blank" icon="i-heroicons-play" variant="soft">Watch Demo</Btn>
  <Btn v-if="links.repo" :href="links.repo" target="_blank" icon="i-heroicons-code-bracket" variant="soft">Source</Btn>
</Grid>

<Card title="Overview">
  Delivered a modern site using Laravel and Vue/Nuxt to present services and streamline content updates for a metal finishing business.
</Card>
