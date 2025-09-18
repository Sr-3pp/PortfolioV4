<template lang="pug">
UModal.modal-certificates(v-model:open="open" description="My credentials")
  template(#title) My Certificates
  template(#body)
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
            p(v-if="cert.summary" class="text-sm text-white/70") {{ cert.summary }}
          template(#footer)
            UButton(:href="cert.link" target="_blank" rel="noopener" icon="i-heroicons-arrow-top-right-on-square" variant="soft" :disabled="!cert.link") View credential

</template>

<script lang="ts" setup>
const { open } = useUiOverlay('certificates');

const { data } = await useAsyncData('certificates', () =>
  queryCollection('certificates').first()
);

const certificates = computed(() => data.value?.meta?.certificates ?? []);

const templateBindings = {
  open,
  certificates,
};

void templateBindings;
</script>

<style>

</style>
