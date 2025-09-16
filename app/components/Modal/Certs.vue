<template lang="pug">
UModal.modal-certificates(v-model:open="open" description="My Certificates" )
  template(#title) My Certificates
  template(#body)
    ul
      li(v-for="(cert, index) in certificates" :key="index")
        a(:href="cert.link" target="_blank" rel="noopener" class="text-blue-500 hover:underline") {{ cert.name }}

</template>

<script lang="ts" setup>
const { open } = useUiOverlay('certificates');

const { data } = await useAsyncData('certificates', () =>
  queryCollection('certificates').first()
);

const certificates = data.value?.meta.certificates || [];
</script>

<style>

</style>