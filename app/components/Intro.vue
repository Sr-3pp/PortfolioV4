<script setup lang="ts">
defineOptions({ name: 'IntroSection' });

const certOverlay = useUiOverlay('certificates');
const projectsOverlay = useUiOverlay('projects');
const contactOverlay = useUiOverlay('contact');
const resumeOverlay = useUiOverlay('resume');

const route = useRoute();
const currentPath = computed(() => route.path);

const openCerts = () => certOverlay.openOverlay();
const openProjects = () => projectsOverlay.openOverlay();
const openContact = () => contactOverlay.openOverlay();
const openResume = () => resumeOverlay.openOverlay();

const templateBindings = {
  currentPath,
  openCerts,
  openProjects,
  openContact,
  openResume,
};

void templateBindings;

</script>

<template lang="pug">
section.flex.items-center.justify-center.bg-gradient-to-b.from-gray-900.to-black.text-white.overflow-hidden.transition-all.duration-500.ease-out.z-20(:class="{'h-screen': currentPath === '/', 'h-20 sticky w-full top-0 left-0': currentPath !== '/'}")
  UContainer.flex(class="sm:flex-row" :class="{'flex-col': currentPath === '/'}")
    div.w-full(class="sm:w-1/2")
      NuxtLink.relative.transition-all.duration-500.ease-out.flex(to="/" :class="{'sm:-bottom-10': currentPath !== '/'}")
        NeonTriangle(:class="{'scale-[2]': currentPath !== '/'}" class="sm:scale-[1]")
          NuxtImg(
            src="/img/3pp.webp"
            alt="SR3PP"
            width="300"
            height="300"
            class="w-2/3 absolute z-2 bottom-0 left-1/2 transform -translate-x-1/2 border-primary transition-all duration-500 ease-out"
            priority
          )
    div.w-full.flex.flex-col.items-center.justify-center.gap-6(class="sm:w-1/2")
      h1.transition-opacity.duration-500.text-xl.font-bold(class="sm:text-2xl md:text-4xl" :class="{'hidden': currentPath !== '/'}") Martin Ruiz

      SlotMachine.transition-opacity.duration-500(class="w-full sm:w-2/3" :class="{'!hidden': currentPath !== '/'}" :labels="['Vue Expert', 'Bug Hunter', 'Nuxt Guru🧞‍♂️']")
      
      ul.flex.gap-5.mx-auto.transition-all.duration-500.flex-wrap.justify-center(:class="{'flex-col items-stretch': currentPath === '/', 'flex-row': currentPath !== '/'}")
        li
          UButton.w-full(
            icon="i-heroicons-academic-cap"
            variant="soft"
            @click="openCerts()"
          ) 
            span.transition-opacity.duration-300(:class="{'hidden': currentPath !== '/'}") My Certificates
        li
          UButton.w-full(
            icon="i-heroicons-rectangle-stack"
            variant="soft"
            @click="openProjects()"
          ) 
            span.transition-opacity.duration-300(:class="{'hidden': currentPath !== '/'}") My Projects
        li
          UButton.w-full(
            icon="i-heroicons-user-circle"
            variant="soft"
            to="/about"
          ) 
            span.transition-opacity.duration-300(:class="{'hidden': currentPath !== '/'}") Who I am
        li
          UButton.w-full(
            icon="i-heroicons-envelope"
            variant="soft"
            @click="openContact()"
          ) 
            span.transition-opacity.duration-300(:class="{'hidden': currentPath !== '/'}") Contact Me
        li
          UButton.w-full(
            icon="i-heroicons-document-text"
            variant="soft"
            @click="openResume()"
          )
            span.transition-opacity.duration-300(:class="{'hidden': currentPath !== '/'}") Resume

        
</template>

<style scoped>
</style>
