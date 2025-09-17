<template>
  <UCard :ui="{ body: 'h-full' }">
    <template #header>
      <template v-if="badge">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">{{ title }}</span>
          <UBadge color="primary" variant="soft">{{ badge }}</UBadge>
        </div>
        <p v-if="subtitle" class="mt-1 text-sm text-white/60">{{ subtitle }}</p>
      </template>
    </template>

    <div v-if="!badge">
      <h3 v-if="title" class="text-base font-semibold">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-white/60">{{ subtitle }}</p>
    </div>

    <p v-if="description" class="mt-3 text-white/70">{{ description }}</p>
    <div v-if="$slots.default" class="mt-3">
      <slot />
    </div>

    <template v-if="cta || $slots.actions || to || href"  #footer>
      <div class="flex items-center gap-2">
        <UButton v-if="to || href" :to="to" :href="href" variant="soft" color="primary" icon="i-heroicons-arrow-right">
          {{ cta || 'Learn more' }}
        </UButton>
        <slot name="actions" />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  title?: string
  subtitle?: string
  description?: string
  badge?: string
  cta?: string
  to?: RouteLocationRaw
  href?: string
}>()
</script>

<style scoped></style>
