<template lang="pug">
UContainer.py-8
  .flex.items-center.justify-between.mb-6
    h1.text-3xl.font-bold Admin Dashboard
    UButton(size="sm" variant="soft" @click="logout") Sign out

  // Admin Section Summary
  UCard.mb-6
    template(#header)
      h2.text-lg.font-semibold Admin Section Overview
    .space-y-4
      p.text-gray-600 Welcome to the admin dashboard. Manage your expenses, view financial summaries, and track recurring payments.
      
      .grid.grid-cols-1.md_grid-cols-2.gap-4
        UCard
          .flex.items-center.gap-3
            UIcon(name="i-heroicons-currency-dollar" class="w-8 h-8 text-green-500")
            div
              .text-sm.text-gray-600 Expense Management
              .text-xs.text-gray-500 Track one-time and recurring expenses
        
        UCard
          .flex.items-center.gap-3
            UIcon(name="i-heroicons-chart-bar" class="w-8 h-8 text-blue-500")
            div
              .text-sm.text-gray-600 Financial Reports
              .text-xs.text-gray-500 View monthly and yearly summaries

  // Quick Actions
  UCard
    template(#header)
      h2.text-lg.font-semibold Quick Actions
    .flex.flex-wrap.gap-3
      UButton(to="/admin/expenses" icon="i-heroicons-list-bullet" variant="soft") Manage Expenses
      UButton(to="/admin/expenses" icon="i-heroicons-chart-bar" variant="soft") View Balance & Reports
</template>

<script setup lang="ts">
definePageMeta({
  middleware: []
})

const router = useRouter()

// Logout function used in template - disable unused var warning
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function logout() {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/login')
  } catch {
    // ignore
  }
}
</script>
