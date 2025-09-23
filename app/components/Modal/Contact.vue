<template lang="pug">
UModal.modal-contact(v-model:open="open" description="Ways to reach me")
  template(#title)
    .flex.items-center.justify-between.gap-3
      span.text-lg.font-semibold Get in touch

  template(#body)
    .space-y-6
      ul.flex.flex-wrap.gap-2
        li(v-for="action in quickActions" :key="action.label")
          UButton.w-full(
            :icon="action.icon"
            :href="action.href"
            :target="action.external ? '_blank' : undefined"
            :rel="action.external ? 'noopener' : undefined"
            variant="soft"
          ) {{ action.label }}

      div(class="flex items-center gap-3 my-2")
        div(class="h-px bg-white/10 flex-1")
        span(class="text-xs uppercase tracking-wide text-white/60") Or send a quick note
        div(class="h-px bg-white/10 flex-1")

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
        .flex.flex-wrap.items-center.justify-between.mt-4.gap-3
          label(class="inline-flex items-center gap-2 select-none")
            input(type="checkbox" v-model="includeMeta" class="h-4 w-4 rounded border-white/20 bg-transparent")
            span(class="text-sm") Include device info
          UButton(icon="i-heroicons-paper-airplane" type="submit" :loading="sending" :disabled="!canSend") Send
</template>

<script lang="ts" setup>
import type { ContactFormState, ContactQuickAction } from '~/types/contact'

const { open } = useUiOverlay('contact')

const email = 'martin.ru@outlook.com'
const linkedin = 'https://linkedin.com/in/sr3pp'
const website = 'https://sr3pp.dev'

const sending = ref(false)
const includeMeta = ref(true)
const initialFormState: ContactFormState = {
  name: '',
  from: '',
  message: ''
}
const form = reactive<ContactFormState>({ ...initialFormState })

const canSend = computed(() => form.message.trim().length > 0)
const quickActions = computed<ContactQuickAction[]>(() => {
  const actions: ContactQuickAction[] = []
  if (linkedin) {
    actions.push({
      label: 'LinkedIn',
      icon: 'i-heroicons-user-circle',
      href: linkedin,
      external: true
    })
  }
  if (email) {
    actions.push({
      label: 'Email',
      icon: 'i-heroicons-envelope',
      href: `mailto:${email}`
    })
  }
  if (website) {
    actions.push({
      label: 'Portfolio',
      icon: 'i-heroicons-globe-alt',
      href: website,
      external: true
    })
  }
  return actions
})

const resetForm = () => {
  Object.assign(form, initialFormState)
  includeMeta.value = true
}

const toast = useToast()

const submit = async () => {
  if (!canSend.value) return
  sending.value = true

  const fullMessage = `
    Name: ${form.name.trim() || 'Anonymous'}
    Email: ${form.from.trim() || 'Not provided'}
    message: ${form.message.trim()}
  `

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        subject: `Contact form submission from ${form.name.trim() || 'Anonymous'}`,
        message: includeMeta.value ? `${fullMessage}\n\n---\nSent from ${navigator.userAgent}` : fullMessage
      }
    })

    resetForm()
    open.value = false

    toast.add({
      title: 'Message sent',
      description: 'Thanks! I will get back to you soon.',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
  } catch {
    toast.add({
      title: 'Failed to send message',
      description: 'Please try again later or reach out via email.',
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    sending.value = false
  }
}

const templateBindings = {
  open,
  email,
  linkedin,
  website,
  submit,
  sending,
  includeMeta,
  form,
  canSend,
  quickActions,
  resetForm,
};

void templateBindings;
</script>

<style>

</style>
