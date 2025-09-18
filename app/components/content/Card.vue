<template lang="pug">
UCard(:ui="{ body: 'h-full' }")
  template(#header)
    h3.text-base.font-semibold(v-if="title") {{ title }}
    p.text-sm.text-white/60(v-if="subtitle") {{ subtitle }}
    template(v-if="badge")
      div(class="flex items-center justify-between")
        span(class="text-sm font-medium") {{ title }}
        UBadge(color="primary" variant="soft") {{ badge }}
      p(v-if="subtitle" class="mt-1 text-sm text-white/60") {{ subtitle }}

  p(v-if="description" class="mt-3 text-white/70") {{ description }}
  div(v-if="$slots.default" class="mt-3")
    slot

  template(#footer v-if="cta || $slots.actions || to || href")
    div(class="flex items-center gap-2")
      UButton(v-if="to || href" :to="to" :href="href" variant="soft" color="primary" icon="i-heroicons-arrow-right")
        | {{ cta || 'Learn more' }}
      slot(name="actions")
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
