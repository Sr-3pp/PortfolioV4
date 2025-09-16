<template>
  <div class="relative w-full overflow-hidden rounded-lg border border-white/10 shadow-sm" :class="aspectClass">
    <iframe
      v-if="embedUrl"
      :src="embedUrl"
      title="Video"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      class="absolute inset-0 h-full w-full"
    />
    <video v-else-if="src" controls class="absolute inset-0 h-full w-full">
      <source :src="src" :type="type" />
    </video>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  url?: string
  src?: string
  type?: string
  provider?: 'youtube' | 'vimeo' | 'loom' | 'file'
  aspect?: '16/9' | '4/3' | '1/1'
}>(), {
  provider: 'youtube',
  aspect: '16/9',
  type: 'video/mp4'
})

const aspectClass = computed(() => ({
  '16/9': 'aspect-[16/9]',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square'
}[props.aspect || '16/9']))

const embedUrl = computed(() => {
  if (!props.url) return ''
  const u = props.url
  if (props.provider === 'youtube') {
    // Supports both watch and share links
    const id = u.match(/(?:v=|youtu.be\/)([\w-]+)/)?.[1]
    return id ? `https://www.youtube.com/embed/${id}` : ''
  }
  if (props.provider === 'vimeo') {
    const id = u.match(/vimeo.com\/(?:video\/)?(\d+)/)?.[1]
    return id ? `https://player.vimeo.com/video/${id}` : ''
  }
  if (props.provider === 'loom') {
    const id = u.match(/loom.com\/share\/([\w-]+)/)?.[1]
    return id ? `https://www.loom.com/embed/${id}` : ''
  }
  return ''
})
</script>

<style scoped></style>

