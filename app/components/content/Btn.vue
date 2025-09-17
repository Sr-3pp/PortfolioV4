<template>
  <UButton
    :to="to"
    :href="href"
    :target="target"
    :rel="rel"
    :icon="icon"
    :size="size"
    :color="color"
    :variant="variant"
  >
    <slot>{{ label }}</slot>
  </UButton>
  
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  label?: string
  to?: RouteLocationRaw
  href?: string
  target?: string
  rel?: string
  icon?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: string
  variant?: 'soft' | 'solid' | 'outline' | 'ghost' | 'link'
}>()
</script>

<style scoped></style>
