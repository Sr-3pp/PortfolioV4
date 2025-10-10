<template lang="pug">
  UContainer.py-16
    .max-w-md.mx-auto
      UCard
        template(#header)
          h1.text-2xl.font-semibold Sign in
        UForm.space-y-4(:state="form" @submit="onSubmit")
          UFormField(label="Email" name="email" :error="fieldErrors.email")
            UInput(type="email" v-model="form.email" autocomplete="email" required placeholder="you@example.com")
          UFormField(label="Password" name="password" :error="fieldErrors.password")
            UInput(type="password" v-model="form.password" autocomplete="current-password" required placeholder="••••••••")
          UButton(type="submit" :loading="pending") Sign in
          p.text-sm.mt-1 Don't have an account?
            a(href="/register" class="text-blue-500 hover:underline") Create one
          UAlert.mt-2(v-if="error" color="red" variant="subtle" :title="error")
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const next = computed(() => (typeof route.query.next === 'string' ? route.query.next : '/'))

const form = reactive({ email: '', password: '' })
const fieldErrors = reactive<{ email: string | null; password: string | null }>({ email: null, password: null })
const pending = ref(false)
const error = ref('')

async function onSubmit() {
  pending.value = true
  error.value = ''
  fieldErrors.email = null
  fieldErrors.password = null
  // Basic client-side validation
  const emailPattern = /.+@.+\..+/
  if (!form.email) {
    fieldErrors.email = 'Email is required'
  } else if (!emailPattern.test(form.email)) {
    fieldErrors.email = 'Enter a valid email address'
  }
  if (!form.password) {
    fieldErrors.password = 'Password is required'
  } else if (form.password.length < 8) {
    fieldErrors.password = 'Password must be at least 8 characters'
  }
  if (fieldErrors.email || fieldErrors.password) {
    pending.value = false
    return
  }
  try {
    // This endpoint should be provided by Better Auth once integrated.
    // Adjust if your auth handler exposes a different path.
    await $fetch('/api/auth/sign-in/email', {
      method: 'POST',
      body: { email: form.email, password: form.password }
    })
    router.replace(next.value)
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Sign-in failed'
  } finally {
    pending.value = false
  }
}
</script>
