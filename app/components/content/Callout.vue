<template>
  <UAlert
    :title="title"
    :description="description"
    :icon="iconName"
    :color="color"
    :variant="variant"
    :ui="{ base: 'leading-relaxed' }"
  >
    <slot />
  </UAlert>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  description?: string
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | string
  variant?: 'soft' | 'solid' | 'outline'
  icon?: string
  type?: 'info' | 'success' | 'warning' | 'error'
}>(), {
  color: 'primary',
  variant: 'soft',
  type: 'info'
})

const iconByType: Record<string, string> = {
  info: 'i-heroicons-information-circle',
  success: 'i-heroicons-check-circle',
  warning: 'i-heroicons-exclamation-triangle',
  error: 'i-heroicons-x-circle'
}

const iconName = computed(() => props.icon || iconByType[props.type || 'info'])
</script>

<style scoped></style>

