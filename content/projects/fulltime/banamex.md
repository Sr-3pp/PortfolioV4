---
type: fulltime
title: Banamex
description: Frontend developer contributing to Citibanamex’s digital platforms with a focus on accessibility, responsiveness, and performance; led a migration toward Web Components to modernize the architecture and improve maintainability across products.
role: Frontend Developer
period: Jul 2018 – Present
technologies: [Web Components, TypeScript, HTML5, Sass, Accessibility]
links:
  live: https://www.banamex.com
---

# Banamex

<Figure src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Banamex_logo.svg/2560px-Banamex_logo.svg.png" alt="Banamex logo" caption="Citibanamex logo"></Figure>

<Grid cols="1" :md="3" v-if="links && (links.live || links.demo || links.repo)">
  <Btn v-if="links.live" :href="links.live" target="_blank" icon="i-heroicons-arrow-top-right-on-square" color="primary">Visit Site</Btn>
  <Btn v-if="links.demo" :href="links.demo" target="_blank" icon="i-heroicons-play" variant="soft">Watch Demo</Btn>
  <Btn v-if="links.repo" :href="links.repo" target="_blank" icon="i-heroicons-code-bracket" variant="soft">Source</Btn>
</Grid>

<Grid :cols="1" :md="2" :lg="2">
  <Card title="Overview">
    At Citibanamex, I contribute to the bank’s digital platforms with a focus on accessibility, responsiveness, and performance. I led a migration effort toward Web Components to modernize the frontend architecture and improve maintainability.
  </Card>
  <Card title="Key Responsibilities">
    <ul>
      <li>Led a frontend migration to Web Components.</li>
      <li>Ensured accessibility and responsive design across products.</li>
      <li>Optimized site performance and improved frontend workflow.</li>
    </ul>
  </Card>
</Grid>

<Card title="Achievements">
  <ul>
    <li>Successfully led the migration of the bank's main website to a modern tech stack, improving load times by 30%.</li>
    <li>Implemented a design system that streamlined the development process and ensured consistency across all digital products.</li>
    <li>Played a key role in enhancing the mobile banking experience, resulting in a 25% increase in mobile user engagement.</li>
    <li>Fostered a collaborative team environment that encouraged innovation and professional growth.</li>
  </ul>
  
</Card>

<Quote author="Summary">
  My tenure has been marked by modernizing the stack, improving accessibility, and elevating performance across key user journeys.
</Quote>
