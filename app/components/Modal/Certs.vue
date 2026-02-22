<template lang="pug">
UModal.modal-certificates(v-model:open="open" description="My credentials")
  template(#title) My Certificates
  template(#body)
    div(v-if="isLoading" class="py-8 text-sm text-white/60") Loading certificates...
    div(v-else-if="loadError" class="py-8 text-sm text-red-300") Failed to load certificates.
    div(v-else-if="certificates.length === 0" class="py-8 text-sm text-white/60") No certificates found.
    ul(class="grid grid-cols-1 sm:grid-cols-2 gap-4")
      li(v-for="cert in certificates" :key="cert.name")
        UCard(class="h-full")
          template(#header)
            .flex.flex-col
              span.font-medium.leading-tight {{ cert.name }}
              span(v-if="cert.issuer" class="text-xs text-white/60") Issued by {{ cert.issuer }}
          template(#default)
            .flex.items-center.gap-4
              NuxtImg(v-if="cert.thumbnail" :src="cert.thumbnail" :alt="cert.name" width="300" height="300" class="w-full rounded-md object-cover shadow-sm")
            p(v-if="cert.summary" class="text-sm text-white/70" v-html="cert.summary")
          template(#footer)
            UButton(:href="cert.link" target="_blank" rel="noopener" icon="i-heroicons-arrow-top-right-on-square" variant="soft" :disabled="!cert.link") View credential

</template>

<script lang="ts" setup>
import type { Certificate } from '~/types/certificate'

const { open } = useUiOverlay('certificates');
const { getCertificates } = useCertificates()

const certificates = ref<Certificate[]>([])
const isLoading = ref(false)
const hasLoaded = ref(false)
const loadError = ref<unknown>(null)

const loadCertificates = async () => {
  if (hasLoaded.value || isLoading.value) return

  isLoading.value = true
  loadError.value = null

  try {
    certificates.value = await getCertificates()
    hasLoaded.value = true
  } catch (error) {
    loadError.value = error
  } finally {
    isLoading.value = false
  }
}

watch(
  open,
  (isOpen) => {
    if (!isOpen || hasLoaded.value) return

    if (!import.meta.client) {
      void loadCertificates()
      return
    }

    requestAnimationFrame(() => {
      void loadCertificates()
    })
  },
  { immediate: true }
)

const templateBindings = {
  open,
  certificates,
  isLoading,
  hasLoaded,
  loadError,
  loadCertificates,
};

void templateBindings;
</script>

<style>

</style>
