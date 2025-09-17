<template>
  <figure :class="['space-y-2', alignClass]">
    <NuxtImg
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :format="format"
      :sizes="sizes"
      class="rounded-lg border border-white/10 shadow-sm"
    />
    <figcaption v-if="$slots.default || caption" class="text-sm text-white/70">
      <slot>
        {{ caption }}
      </slot>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt?: string
  caption?: string | null
  width?: number | string | null
  height?: number | string | null
  sizes?: string
  format?: string
  align?: 'left' | 'center' | 'right'
}>(), {
  alt: '',
  caption: null,
  width: null,
  height: null,
  sizes: '(min-width: 768px) 768px, 100vw',
  format: 'webp',
  align: 'center'
})

const alignClass = computed(() => ({
  left: 'md:mr-auto',
  center: 'mx-auto',
  right: 'md:ml-auto'
}[props.align || 'center']))
</script>

<style scoped></style>
