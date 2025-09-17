<template lang="pug">
UModal.modal-contact(v-model:open="open" description="Ways to reach me")
  template(#title)
    .flex.items-center.justify-between.gap-3
      span.text-lg.font-semibold Get in touch

  template(#body)
    .space-y-6
      //- Quick actions
      .flex.flex-wrap.gap-2
        UButton(icon="i-heroicons-envelope" :href="`mailto:${email}`" variant="soft") Email
        UButton(icon="i-heroicons-user-circle" :href="linkedin" target="_blank" rel="noopener" variant="soft") LinkedIn
        UButton(icon="i-heroicons-link" :href="website" target="_blank" rel="noopener" variant="soft") Website
        UButton(icon="i-heroicons-document-duplicate" variant="ghost" @click="copyEmail") Copy email

      //- Divider replacement (UDivider not available)
      div(class="flex items-center gap-3 my-2")
        div(class="h-px bg-white/10 flex-1")
        span(class="text-xs uppercase tracking-wide text-white/60") Or send a quick note
        div(class="h-px bg-white/10 flex-1")

      //- Simple mailto form (no backend)
      form(@submit.prevent="submit")
        div(class="grid grid-cols-1 sm:grid-cols-2 gap-4")
          div
            label(class="text-sm block mb-1") Name
            UInput(v-model="form.name" placeholder="Your name")
          div
            label(class="text-sm block mb-1") Your Email
            UInput(v-model="form.from" type="email" placeholder="you@email.com")
        div(class="mt-4")
          label(class="text-sm block mb-1") Message
          textarea(v-model="form.message" rows="5" placeholder="How can I help?" class="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary")
        .flex.items-center.justify-between.mt-4
          label(class="inline-flex items-center gap-2 select-none")
            input(type="checkbox" v-model="includeMeta" class="h-4 w-4 rounded border-white/20 bg-transparent")
            span(class="text-sm") Include device info in message
          UButton(icon="i-heroicons-paper-airplane" type="submit" :loading="sending" :disabled="!canSend") Send
</template>

<script lang="ts" setup>
const { open } = useUiOverlay('contact')

// Contact details (kept here for simplicity)
const email = 'martin.ru@outlook.com'
const linkedin = 'https://linkedin.com/in/sr3pp'
const website = 'https://sr3pp.dev'

const sending = ref(false)
const includeMeta = ref(true)
const form = reactive({
  name: '',
  from: '',
  message: ''
})

const canSend = computed(() => form.message.trim().length > 0)

function copyEmail() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(email).catch(() => {})
  }
}

function submit() {
  if (!canSend.value) return
  sending.value = true
  const subject = encodeURIComponent(`Portfolio contact from ${form.name || 'Anonymous'}`)
  const meta = includeMeta.value
    ? `\n\n—\nFrom: ${form.from || 'n/a'}\nUA: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'n/a'}`
    : ''
  const body = encodeURIComponent(`${form.message}${meta}`)
  const href = `mailto:${email}?subject=${subject}&body=${body}`
  // Open mail client
  if (typeof window !== 'undefined') {
    window.location.href = href
  }
  // Small delay to reset state
  setTimeout(() => { sending.value = false }, 600)
}

const templateBindings = {
  open,
  email,
  linkedin,
  website,
  copyEmail,
  submit,
  sending,
  includeMeta,
  form,
  canSend,
};

void templateBindings;
</script>

<style>

</style>
