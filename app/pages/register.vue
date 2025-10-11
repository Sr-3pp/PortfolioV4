<template lang="pug">
  UContainer.py-16
    .max-w-md.mx-auto
      UCard
        template(#header)
          h1.text-2xl.font-semibold Create account
        UForm.space-y-4(:state="form" @submit="onSubmit")
          UFormField(label="Name" name="name" :error="fieldErrors.name")
            UInput(type="text" v-model="form.name" autocomplete="name" required placeholder="Your name")
          UFormField(label="Email" name="email" :error="fieldErrors.email")
            UInput(type="email" v-model="form.email" autocomplete="email" required placeholder="you@example.com")
          UFormField(label="Password" name="password" :error="fieldErrors.password")
            UInput(type="password" v-model="form.password" autocomplete="new-password" required placeholder="••••••••")
          UButton(type="submit" :loading="pending") Create account
          UAlert.mt-2(v-if="error" color="red" variant="subtle" :title="error")
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
const router = useRouter()
const pending = ref(false)
const error = ref('')
const form = reactive({ name: '', email: '', password: '' })
const fieldErrors = reactive<{ name: string | null; email: string | null; password: string | null }>({ name: null, email: null, password: null })

async function onSubmit() {
  pending.value = true
  error.value = ''
  fieldErrors.name = null
  fieldErrors.email = null
  fieldErrors.password = null
  const emailPattern = /.+@.+\..+/
  if (!form.name) fieldErrors.name = 'Name is required'
  if (!form.email) fieldErrors.email = 'Email is required'
  else if (!emailPattern.test(form.email)) fieldErrors.email = 'Enter a valid email address'
  if (!form.password) fieldErrors.password = 'Password is required'
  else if (form.password.length < 8) fieldErrors.password = 'Password must be at least 8 characters'
  if (fieldErrors.name || fieldErrors.email || fieldErrors.password) { pending.value = false; return }
  try {
    // Better Auth sign-up endpoint; adjust if your config differs
    await $fetch('/api/auth/sign-up/email', {
      method: 'POST',
      body: { name: form.name, email: form.email, password: form.password }
    })
    // After creating account, redirect to /login for sign-in
    router.replace({ path: '/login', query: { created: '1' } })
  } catch (e: unknown) {
    error.value = e?.data?.message || e?.message || 'Registration failed'
  } finally {
    pending.value = false
  }
}
</script>
