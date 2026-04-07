<template>
  <main>
	<Analytics />
    <NuxtRouteAnnouncer />
    <Intro />
    <div class="flex flex-col gap-8 sm:gap-12">
    <NuxtPage />
    </div>
    <LazyModalCerts v-if="showCertsModal" />
    <LazyModalProjects v-if="showProjectsModal" />
    <LazyModalContact v-if="showContactModal" />
    <LazyModalResume v-if="showResumeModal" />
    <ClientOnly>
      <Stars v-if="showStars" />
    </ClientOnly>
  </main>
</template>

<script setup lang="ts">
	import type { Ref } from 'vue'
 	import { Analytics } from '@vercel/analytics/nuxt';

  const certsOverlay = useUiOverlay('certificates')
  const projectsOverlay = useUiOverlay('projects')
  const contactOverlay = useUiOverlay('contact')
  const resumeOverlay = useUiOverlay('resume')

  const createLazyModalFlag = (openState: Ref<boolean>) => {
    const hasOpened = ref(openState.value)

    watch(
      openState,
      (isOpen) => {
        if (isOpen) hasOpened.value = true
      },
      { immediate: true }
    )

    return hasOpened
  }

  const showCertsModal = createLazyModalFlag(certsOverlay.open)
  const showProjectsModal = createLazyModalFlag(projectsOverlay.open)
  const showContactModal = createLazyModalFlag(contactOverlay.open)
  const showResumeModal = createLazyModalFlag(resumeOverlay.open)

  const showStars = ref(false)

  onMounted(() => {
    const schedule = globalThis.requestIdleCallback
      ? (callback: () => void) => globalThis.requestIdleCallback(callback, { timeout: 1200 })
      : (callback: () => void) => window.setTimeout(callback, 400)

    schedule(() => {
      showStars.value = true
    })
  })
</script>
