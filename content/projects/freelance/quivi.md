---
type: freelance
title: Quivi
description: Built an autoparts e‑commerce initially with Nuxt 2 and Django REST, then fully rebuilt with Nuxt to simplify deployment, reduce complexity, and improve maintainability.
technologies: [Nuxt 2, Nuxt 3, Vue.js, TypeScript, Django REST, Python]
---

# Quivi

<Grid cols="1" :md="3" v-if="links && (links.live || links.demo || links.repo)">
  <Btn v-if="links.live" :href="links.live" target="_blank" icon="i-heroicons-arrow-top-right-on-square" color="primary">Visit Site</Btn>
  <Btn v-if="links.demo" :href="links.demo" target="_blank" icon="i-heroicons-play" variant="soft">Watch Demo</Btn>
  <Btn v-if="links.repo" :href="links.repo" target="_blank" icon="i-heroicons-code-bracket" variant="soft">Source</Btn>
</Grid>

<Card title="Overview">
  Developed an autoparts e‑commerce initially on Nuxt 2 with Django REST, later fully rebuilt with Nuxt to simplify deployment and maintenance.
</Card>
