<template>
  <div
    :class="[
      'grid gap-4',
      cols === 1 && 'grid-cols-1',
      cols === 2 && 'grid-cols-2',
      cols === 3 && 'grid-cols-3',
      cols === 4 && 'grid-cols-4',
      md === 1 && 'md:grid-cols-1',
      md === 2 && 'md:grid-cols-2',
      md === 3 && 'md:grid-cols-3',
      md === 4 && 'md:grid-cols-4',
      lg === 1 && 'lg:grid-cols-1',
      lg === 2 && 'lg:grid-cols-2',
      lg === 3 && 'lg:grid-cols-3',
      lg === 4 && 'lg:grid-cols-4'
    ]"
  >
    <slot />
  </div>
  
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  cols?: 1 | 2 | 3 | 4
  md?: 1 | 2 | 3 | 4
  lg?: 1 | 2 | 3 | 4
}>(), {
  cols: 1,
  md: 2,
  lg: 3
})
</script>

<style scoped></style>
