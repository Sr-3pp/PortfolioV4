<template lang="pug">
  UContainer.py-12
    .max-w-3xl.mx-auto
      UCard
        template(#header)
          h1.text-2xl.font-semibold Admin
        p.mt-2.text-sm.opacity-80 This area is protected by route middleware.
        form.mt-6(@submit.prevent="logout")
          UButton(type="submit" color="gray" variant="solid") Sign out
</template>

<script setup lang="ts">
definePageMeta({
  // Not strictly required since we use a global middleware scoped to /admin,
  // but kept as explicit marker for maintainers.
  middleware: []
})

const router = useRouter()
async function logout() {
  try {
    await $fetch('/api/auth/sign-out', { method: 'POST' })
    router.replace('/login')
  } catch (e) {}
}
</script>
