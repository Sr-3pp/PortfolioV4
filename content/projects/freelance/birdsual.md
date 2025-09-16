---
type: freelance
title: Birdsual
description: Designed and built a fast, modern portfolio with Nuxt 3 and MongoDB, creating a simple content model so the designer could update work quickly without developer support.
technologies: [Nuxt 3, Vue 3, TypeScript, Tailwind CSS, MongoDB]
---

# Birdsual

<Grid cols="1" :md="3" v-if="links && (links.live || links.demo || links.repo)">
  <Btn v-if="links.live" :href="links.live" target="_blank" icon="i-heroicons-arrow-top-right-on-square" color="primary">Visit Site</Btn>
  <Btn v-if="links.demo" :href="links.demo" target="_blank" icon="i-heroicons-play" variant="soft">Watch Demo</Btn>
  <Btn v-if="links.repo" :href="links.repo" target="_blank" icon="i-heroicons-code-bracket" variant="soft">Source</Btn>
</Grid>

<Card title="Overview">
  Designed and built a modern portfolio using Nuxt 3 backed by MongoDB to enable simple content management for a designer.
</Card>
