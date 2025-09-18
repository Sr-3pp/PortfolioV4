<template lang="pug">
div(class="rounded-lg border border-white/10 bg-white/5 p-4")
  div(class="flex items-center gap-3")
    UIcon(v-if="icon" :name="icon" class="text-white/80")
    div(class="text-sm text-white/60") {{ label }}
  div(class="mt-1 text-2xl font-semibold text-white") {{ value }}
  div(v-if="$slots.default" class="mt-2 text-sm text-white/60")
    slot
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon?: string
}>()

defineOptions({
  name: 'StatCard'
})
</script>

<style scoped></style>
