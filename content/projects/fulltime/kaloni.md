---
type: fulltime
title: Kaloni
description: Served as a Webmaster Jr., maintaining and updating corporate websites, assisting with technical fixes and site enhancements, and ensuring content accuracy and uptime.
role: Webmaster Jr.
period: 2015 – 2016
technologies: [Adobe Muse, HTML5, CSS3]
---

# Kaloni

<Grid cols="1" :md="3" v-if="links && (links.live || links.demo || links.repo)">
  <Btn v-if="links.live" :href="links.live" target="_blank" icon="i-heroicons-arrow-top-right-on-square" color="primary">Visit Site</Btn>
  <Btn v-if="links.demo" :href="links.demo" target="_blank" icon="i-heroicons-play" variant="soft">Watch Demo</Btn>
  <Btn v-if="links.repo" :href="links.repo" target="_blank" icon="i-heroicons-code-bracket" variant="soft">Source</Btn>
</Grid>

<Grid cols="1" :md="2" :lg="2">
  <Card title="Overview">
    Supported corporate sites with updates, content accuracy, and routine fixes as a Webmaster Jr.
  </Card>
  <Card title="Highlights">
    <ul>
      <li>Maintained and updated corporate websites.</li>
      <li>Assisted with technical fixes and site enhancements.</li>
      <li>Ensured consistent uptime and content accuracy.</li>
    </ul>
  </Card>
</Grid>
