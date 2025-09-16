---
type: freelance
title: All American Cabinetry
description: Built a lightweight product catalog on Nuxt 2 backed by MongoDB, modeling content for simple updates and fast browsing so non‑technical editors could maintain items with ease.
technologies: [Nuxt 2, Vue 2, TypeScript, Sass, MongoDB]
---

# All American Cabinetry

<Grid cols="1" :md="3" v-if="links && (links.live || links.demo || links.repo)">
  <Btn v-if="links.live" :href="links.live" target="_blank" icon="i-heroicons-arrow-top-right-on-square" color="primary">Visit Site</Btn>
  <Btn v-if="links.demo" :href="links.demo" target="_blank" icon="i-heroicons-play" variant="soft">Watch Demo</Btn>
  <Btn v-if="links.repo" :href="links.repo" target="_blank" icon="i-heroicons-code-bracket" variant="soft">Source</Btn>
</Grid>

<Card title="Overview">
  Built a lightweight catalog site on Nuxt 2 backed by MongoDB to simplify product content management.
</Card>
