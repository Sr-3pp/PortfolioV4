<template lang="pug">
div(:class="classes")
  slot
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  cols?: 1 | 2 | 3 | 4
  md?: 1 | 2 | 3 | 4
  lg?: 1 | 2 | 3 | 4
}>(), {
  cols: 1,
  md: 2,
  lg: 3
})

const classes = computed(() => [
  'grid gap-4',
  props.cols === 1 && 'grid-cols-1',
  props.cols === 2 && 'grid-cols-2',
  props.cols === 3 && 'grid-cols-3',
  props.cols === 4 && 'grid-cols-4',
  props.md === 1 && 'md:grid-cols-1',
  props.md === 2 && 'md:grid-cols-2',
  props.md === 3 && 'md:grid-cols-3',
  props.md === 4 && 'md:grid-cols-4',
  props.lg === 1 && 'lg:grid-cols-1',
  props.lg === 2 && 'lg:grid-cols-2',
  props.lg === 3 && 'lg:grid-cols-3',
  props.lg === 4 && 'lg:grid-cols-4'
].filter((value): value is string => typeof value === 'string'))

const templateBindings = {
  classes,
}

void templateBindings;
</script>

<style scoped></style>
