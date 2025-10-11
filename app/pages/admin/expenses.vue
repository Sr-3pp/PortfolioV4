<template lang="pug">
  UContainer.py-8
    .flex.items-center.justify-between.mb-4
      h1.text-2xl.font-semibold Expenses
      div
        UButton(size="sm" variant="soft" :loading="pendingAny" @click="refreshAll") Refresh

    UCard
      // Filters
      .flex.flex-wrap.items-center.gap-3.mb-4
        UInput(v-model="filters.query" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search notes or category")
        USelectMenu(v-model="filters.category" :options="categoryOptions" placeholder="All categories" clearable)
        USelectMenu(v-model="filters.method" :options="methodOptions" placeholder="All methods" clearable)
        UButton(size="sm" variant="ghost" @click="clearFilters") Clear

      // Toggle
      .flex.items-center.gap-2.mb-4
        UButton(:variant="view === 'expenses' ? 'solid' : 'ghost'" @click="view = 'expenses'") Expenses
        UButton(:variant="view === 'recurring' ? 'solid' : 'ghost'" @click="view = 'recurring'") Recurring

      // Status / Session + counts
      .flex.items-center.justify-between.mb-2
        UBadge(color="gray") {{ filteredExpenses.length }} expenses · {{ filteredRecurring.length }} recurring

      ClientOnly
        // Expenses Table (Nuxt UI UTable)
        div(v-if="view === 'expenses'")
          UAlert.mt-2(v-if="errorExp" color="red" variant="subtle" :title="formatErr(errorExp)")
          UTable(:rows="pagedExpenseRows" :columns="expenseCols" row-key="id")
            template(#empty)
              UAlert(title="No expenses found" color="gray" variant="subtle")
            // Render body with our mapped rows for reliability
            template(#body)
              tbody
                tr(v-for="r in pagedExpenseRows" :key="r.id" class="hover:bg-gray-800/30")
                  td.py-2.px-3 {{ formatDate(r.createdAt) }}
                  td.py-2.px-3 {{ r.category || '-' }}
                  td.py-2.px-3 {{ r.method || '-' }}
                  td.py-2.px-3.text-right.font-medium {{ formatCurrency(r.amount) }}
                  td.py-2.px-3 {{ r.note || '' }}
          // Pagination (client-side)
          .flex.items-center.justify-between.mt-3
            span.text-sm.opacity-70 {{ pageLabel }}
            UPagination(:total="expenseRows.length" v-model="page" :page-count="pageSize")
        // Recurring Table (Nuxt UI UTable)
        div(v-else)
          UAlert.mt-2(v-if="errorRec" color="red" variant="subtle" :title="formatErr(errorRec)")
          UTable(:rows="pagedRecurringRows" :columns="recurringCols" row-key="id")
            template(#empty)
              UAlert(title="No recurring expenses found" color="gray" variant="subtle")
            template(#body)
              tbody
                tr(v-for="r in pagedRecurringRows" :key="r.id" class="hover:bg-gray-800/30")
                  td.py-2.px-3
                    UBadge(:color="(r.status === 'active') ? 'green' : 'gray'") {{ r.status }}
                  td.py-2.px-3 {{ r.category || '-' }}
                  td.py-2.px-3.text-right.font-medium {{ formatCurrency(r.amount) }}
                  td.py-2.px-3 {{ r.frequency }}
                  td.py-2.px-3 {{ r.interval }}
                  td.py-2.px-3.text-right {{ formatCurrency(r.monthlyEquivalent) }}
                  td.py-2.px-3 {{ formatDate(r.startDate) }}
                  td.py-2.px-3 {{ formatDate(r.nextRun) }}
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import allowedCategories from '~/database/utils/allowedCategories'

definePageMeta({})

const view = ref<'expenses' | 'recurring'>('expenses')
const page = ref(1)
const pageSize = 20
const sort = ref<{ column: string; direction: 'asc' | 'desc' } | undefined>({ column: 'createdAt', direction: 'desc' })

const filters = reactive({ query: '', category: undefined as string | undefined, method: undefined as string | undefined })

const { data: expensesData, pending: pendingExp, error: errorExp, refresh: refreshExpenses } = await useFetch('/api/expense', { method: 'GET', server: false, credentials: 'include' })
const { data: recurringData, pending: pendingRec, error: errorRec, refresh: refreshRecurring } = await useFetch('/api/expense/recurring', { method: 'GET', server: false, credentials: 'include' })

const pendingAny = computed(() => pendingExp.value || pendingRec.value)
function refreshAll() { refreshExpenses(); refreshRecurring() }

const expenses = computed<any[]>(() => Array.isArray(expensesData.value) ? expensesData.value : [])
const recurring = computed<any[]>(() => Array.isArray(recurringData.value) ? recurringData.value : [])

const categoryOptions = computed(() => [{ label: 'All categories', value: undefined }, ...allowedCategories.map((c: string) => ({ label: c, value: c }))])
const methodOptions = computed(() => {
  const set = new Set(expenses.value.map(e => e.method).filter(Boolean))
  return [{ label: 'All methods', value: undefined }, ...Array.from(set).map(m => ({ label: m, value: m }))]
})

const filteredExpenses = computed(() => {
  const q = filters.query.trim().toLowerCase()
  return expenses.value
    .filter(e => !filters.category || e.category === filters.category)
    .filter(e => !filters.method || e.method === filters.method)
    .filter(e => !q || String(e.note || '').toLowerCase().includes(q) || String(e.category || '').toLowerCase().includes(q))
    .slice()
    .sort((a, b) => {
      const dir = sort.value?.direction === 'asc' ? 1 : -1
      const col = sort.value?.column || 'createdAt'
      const av = a[col] || a._eventDate || a.created_at
      const bv = b[col] || b._eventDate || b.created_at
      const ad = new Date(av).getTime()
      const bd = new Date(bv).getTime()
      return (ad - bd) * dir
    })
})

const expenseRows = computed(() =>
  filteredExpenses.value.map((e) => ({
    id: e._id || e.id || `${e.createdAt || e._eventDate || e.created_at}-${e.amount}`,
    createdAt: e.createdAt || e._eventDate || e.created_at,
    category: e.category || '',
    method: e.method || '',
    amount: Number(e.amount || 0),
    note: e.note || ''
  }))
)

const pagedExpenseRows = computed(() => {
  const start = (page.value - 1) * pageSize
  return expenseRows.value.slice(start, start + pageSize)
})

const pageLabel = computed(() => {
  const total = expenseRows.value.length
  if (total === 0) return '0 items'
  const start = (page.value - 1) * pageSize + 1
  const end = Math.min(start + pageSize - 1, total)
  return `${start}–${end} of ${total}`
})

const filteredRecurring = computed(() => {
  const q = filters.query.trim().toLowerCase()
  return recurring.value
    .filter(r => !filters.category || r.category === filters.category)
    .filter(r => !q || String(r.note || '').toLowerCase().includes(q) || String(r.category || '').toLowerCase().includes(q))
    .slice()
    .sort((a, b) => new Date(b.createdAt || b.startDate).getTime() - new Date(a.createdAt || a.startDate).getTime())
})

const recurringRows = computed(() =>
  filteredRecurring.value.map((r) => {
    const amount = Number(r.amount || 0)
    const monthly = r.monthlyEquivalent != null
      ? Number(r.monthlyEquivalent)
      : (r.frequency === 'yearly' ? amount / 12 : amount)
    return {
      id: r._id || r.id || `${r.category}-${r.startDate || ''}-${amount}`,
      status: r.status || 'active',
      category: r.category || '',
      amount,
      frequency: r.frequency || '',
      interval: Number(r.interval ?? 1),
      monthlyEquivalent: monthly,
      startDate: r.startDate,
      nextRun: r.nextRun,
    }
  })
)

const pagedRecurringRows = computed(() => {
  const start = (page.value - 1) * pageSize
  return recurringRows.value.slice(start, start + pageSize)
})

const expenseCols = [
  { id: 'createdAt', key: 'createdAt', label: 'Date', sortable: true },
  { id: 'category', key: 'category', label: 'Category' },
  { id: 'method', key: 'method', label: 'Method' },
  { id: 'amount', key: 'amount', label: 'Amount', sortable: true },
  { id: 'note', key: 'note', label: 'Note' },
]

const recurringCols = [
  { id: 'status', key: 'status', label: 'Status' },
  { id: 'category', key: 'category', label: 'Category' },
  { id: 'amount', key: 'amount', label: 'Amount' },
  { id: 'frequency', key: 'frequency', label: 'Frequency' },
  { id: 'interval', key: 'interval', label: 'Interval' },
  { id: 'monthlyEquivalent', key: 'monthlyEquivalent', label: 'Monthly' },
  { id: 'startDate', key: 'startDate', label: 'Start' },
  { id: 'nextRun', key: 'nextRun', label: 'Next' },
]

function onSortChange(val: any) { sort.value = val; page.value = 1 }

function clearFilters() {
  filters.query = ''
  filters.category = undefined
  filters.method = undefined
  page.value = 1
}

function formatCurrency(n: number) {
  try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(n || 0)) } catch { return String(n) }
}

function formatDate(d: any) {
  if (!d) return '-'
  const date = new Date(d)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleString()
}

function monthlyEquivalent(r: any) {
  const amt = Number(r?.amount || 0)
  if (r?.frequency === 'yearly') return amt / 12
  return amt
}

function formatErr(e: any) {
  try { return e?.data?.message || e?.message || String(e) } catch { return 'Request failed' }
}

onMounted(() => {
  watch([expenses, recurring, errorExp, errorRec], ([e, r, ex, er]) => {
    console.log('[admin/expenses] data', { expenses: e?.length, recurring: r?.length, errorExp: ex, errorRec: er })
  }, { immediate: true })
})
</script>
