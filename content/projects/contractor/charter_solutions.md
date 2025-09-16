---
type: contractor
title: Charter Solutions
description: Developed responsive React interfaces for the Prism application, customized themes to product requirements, and embedded accessibility best practices (a11y) to ensure usable, inclusive experiences across screens.
role: Frontend Developer
period: Jun 2022 – Jan 2023
technologies: [React, TypeScript, HTML5, CSS3, Accessibility]
---

# Charter Solutions

<Grid cols="1" :md="3" v-if="links && (links.live || links.demo || links.repo)">
  <Btn v-if="links.live" :href="links.live" target="_blank" icon="i-heroicons-arrow-top-right-on-square" color="primary">Visit Site</Btn>
  <Btn v-if="links.demo" :href="links.demo" target="_blank" icon="i-heroicons-play" variant="soft">Watch Demo</Btn>
  <Btn v-if="links.repo" :href="links.repo" target="_blank" icon="i-heroicons-code-bracket" variant="soft">Source</Btn>
</Grid>

<Grid cols="1" :md="2" :lg="2">
  <Card title="Overview">
    Contract frontend development for the Prism application with a focus on responsive UIs, theme customization, and accessibility.
  </Card>
  <Card title="Highlights">
    <ul>
      <li>Developed responsive React interfaces for the Prism application.</li>
      <li>Customized themes and ensured accessibility.</li>
    </ul>
  </Card>
</Grid>
