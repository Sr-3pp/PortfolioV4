---
type: fulltime
title: Queremos Comer
description: Handled webmaster duties across content updates, site security, and performance, using analytics insights to guide UX improvements and keep the experience fast and reliable.
role: Webmaster
period: 2016 – 2017
technologies: [HTML5, CSS3, JavaScript, Google Analytics]

---

# Queremos Comer

<Grid cols="1" :md="3" v-if="links && (links.live || links.demo || links.repo)">
  <Btn v-if="links.live" :href="links.live" target="_blank" icon="i-heroicons-arrow-top-right-on-square" color="primary">Visit Site</Btn>
  <Btn v-if="links.demo" :href="links.demo" target="_blank" icon="i-heroicons-play" variant="soft">Watch Demo</Btn>
  <Btn v-if="links.repo" :href="links.repo" target="_blank" icon="i-heroicons-code-bracket" variant="soft">Source</Btn>
</Grid>

<Grid cols="1" :md="2" :lg="2">
  <Card title="Overview">
    Maintained and updated websites with relevant, appealing content while ensuring technical operations, security, and performance.
  </Card>
  <Card title="Highlights">
    <ul>
      <li>Maintained and updated websites with relevant content.</li>
      <li>Handled technical operations and ensured security/performance.</li>
      <li>Used analytics to improve UX and engagement.</li>
    </ul>
  </Card>
</Grid>
