---
type: freelance
title: ICCN
description: Built a CRM tailored to coaching workflows using Laravel and Vue, enabling coaches to manage clients, sessions, and notes efficiently in one place.
technologies: [Laravel, PHP, Vue.js, JavaScript, HTML5, Sass]
---

# ICCN

<Grid cols="1" :md="3" v-if="links && (links.live || links.demo || links.repo)">
  <Btn v-if="links.live" :href="links.live" target="_blank" icon="i-heroicons-arrow-top-right-on-square" color="primary">Visit Site</Btn>
  <Btn v-if="links.demo" :href="links.demo" target="_blank" icon="i-heroicons-play" variant="soft">Watch Demo</Btn>
  <Btn v-if="links.repo" :href="links.repo" target="_blank" icon="i-heroicons-code-bracket" variant="soft">Source</Btn>
</Grid>

<Card title="Overview">
  Built a CRM tailored for coaching workflows with Laravel and Vue to streamline client management and session tracking.
</Card>
