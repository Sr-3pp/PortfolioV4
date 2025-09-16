<script setup lang="ts">
const { openOverlay: openCerts } = useUiOverlay('certificates');
const { openOverlay: openProjects } = useUiOverlay('projects');
const { openOverlay: openContact } = useUiOverlay('contact');
const { openOverlay: openResume } = useUiOverlay('resume');

// Use a computed ref so `path` updates reactively on route changes
const route = useRoute();
const path = computed(() => route.path);

</script>

<template lang="pug">
section.flex.items-center.justify-center.bg-gradient-to-b.from-gray-900.to-black.text-white.overflow-hidden.transition-all.duration-500.ease-out.z-20(:class="{'h-screen': path === '/', 'h-20 sticky w-full top-0 left-0': path !== '/'}")
  UContainer.flex
    div.w-full(class="sm:w-1/2")
      NuxtLink.relative.transition-all.duration-500.ease-out(to="/" :class="{'-bottom-10': path !== '/'}")
        NeonTriangle
          NuxtImg(
            src="/img/3pp.webp"
            alt="SR3PP"
            width="300"
            height="300"
            class="w-2/3 absolute z-2 bottom-0 left-1/2 transform -translate-x-1/2 border-primary transition-all duration-500 ease-out"
            priority
          )
    div.w-full.flex.flex-col.items-center.justify-center.gap-8(class="sm:w-1/2")
      h1.transition-opacity.duration-500(:class="{'hidden': path !== '/'}") Martin Ruiz

      h2.transition-opacity.duration-500(:class="{'hidden': path !== '/'}") bug hunter
      
      ul.flex.gap-5.mx-auto.transition-all.duration-500(:class="{'flex-col items-stretch': path === '/', 'flex-row': path !== '/'}")
        li
          UButton.w-full(
            icon="i-heroicons-academic-cap"
            @click="openCerts('certificates')"
          ) 
            span.transition-opacity.duration-300(:class="{'hidden': path !== '/'}") My Certificates
        li
          UButton.w-full(
            icon="i-heroicons-rectangle-stack"
            @click="openProjects('projects')"
          ) 
            span.transition-opacity.duration-300(:class="{'hidden': path !== '/'}") My Projects
        li
          UButton.w-full(
            icon="i-heroicons-user-circle"
            to="/about"
          ) 
            span.transition-opacity.duration-300(:class="{'hidden': path !== '/'}") Who I am
        li
          UButton.w-full(
            icon="i-heroicons-envelope"
            @click="openContact('contact')"
          ) 
            span.transition-opacity.duration-300(:class="{'hidden': path !== '/'}") Contact Me
        li
          UButton.w-full(
            icon="i-heroicons-document-text"
            @click="openResume('resume')"
          )
            span.transition-opacity.duration-300(:class="{'hidden': path !== '/'}") Resume

        
</template>

<style scoped>
</style>
