<template>
  <main>
	<Analytics />
    <NuxtRouteAnnouncer />
    <Intro />
    <div class="flex flex-col gap-8 sm:gap-12">
    <NuxtPage />
    </div>
    <ModalCerts />
    <ModalProjects />
    <ModalContact />
    <ModalResume />
    <Stars />
  </main>
</template>

<script setup lang="ts">
	import { Analytics } from '@vercel/analytics/nuxt';
</script>

