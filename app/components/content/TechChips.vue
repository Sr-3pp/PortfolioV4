<template>
  <div v-bind="$attrs" class="flex flex-wrap gap-2">
    <UBadge
      v-for="(chip, i) in items"
      :key="i + '-' + chip"
      :color="color"
      :variant="variant"
      :size="size"
    >
      <UIcon v-if="icon" :name="icon" class="mr-1" />
      {{ chip }}
    </UBadge>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  items?: string[]
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: string
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
