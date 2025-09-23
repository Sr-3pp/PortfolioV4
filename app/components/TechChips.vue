<template lang="pug">
div.flex.flex-wrap.gap-2(v-bind="$attrs")
  UBadge(
    v-for="(chip, i) in items"
    :key="i + '-' + chip"
    :color="color"
    :variant="variant"
    :size="size"
  )
    UIcon(v-if="icon" :name="icon" class="mr-1")
    | {{ chip }}
  slot
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  items?: string[]
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
  variant?: 'soft' | 'solid' | 'outline'
  icon?: string | null
}>(), {
  items: () => [],
  size: 'sm',
  color: 'primary',
  variant: 'soft',
  icon: null
})
</script>

<style scoped>
</style>
