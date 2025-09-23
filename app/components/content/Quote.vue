<template lang="pug">
blockquote(class="rounded-lg border-l-4 border-primary-500/70 bg-white/5 p-4 text-white/80")
  p(class="italic leading-relaxed")
    slot
  footer(v-if="author || role" class="mt-2 text-sm text-white/60")
    | — {{ author }}
    span(v-if="role" class="text-white/40")
      | , {{ role }}
</template>

<script setup lang="ts">
defineProps<{
  author?: string
  role?: string
}>()
</script>

<style scoped></style>
