<template lang="pug">
UContainer.py-8
  .flex.items-center.justify-between.mb-4
    h1.text-2xl.font-semibold Expenses
    .flex.gap-2
      UButton(size="sm" icon="i-heroicons-plus" @click="isCreateModalOpen = true") Add Expense
      UButton(size="sm" variant="soft" :loading="pendingAny || pending" @click="refreshAll") Refresh

  // Month/Year Selector
  UCard.mb-6
    .flex.flex-wrap.items-center.gap-3
      USelectMenu(
        v-model="selectedMonth"
        :items="monthOptions"
        value-attribute="value"
        option-attribute="label"
        placeholder="Select month"
      )
      USelectMenu(
        v-model="selectedYear"
        :items="yearOptions"
        value-attribute="value"
        option-attribute="label"
        placeholder="Select year"
      )
      UButton(size="sm" variant="ghost" @click="resetToCurrentMonth") Current Month

  // Balance Dashboard
  UAlert(v-if="error" color="red" variant="subtle" :title="formatError(error)")
  
  .grid.grid-cols-1.md_grid-cols-3.gap-4.mb-6(v-if="!pending && summary")
    // One-time Expenses Card
    UCard
      template(#header)
        .flex.items-center.justify-between
          span.text-sm.font-medium.text-gray-600 One-time Expenses
          UIcon(name="i-heroicons-credit-card" class="w-5 h-5 text-blue-500")
      .text-3xl.font-bold.text-blue-600 {{ formatCurrency(summary.totals.expenses) }}
      .text-xs.text-gray-500.mt-1 {{ expenseCount }} transactions

    // Recurring Expenses Card
    UCard
      template(#header)
        .flex.items-center.justify-between
          span.text-sm.font-medium.text-gray-600 Recurring (Monthly)
          UIcon(name="i-heroicons-arrow-path" class="w-5 h-5 text-purple-500")
      .text-3xl.font-bold.text-purple-600 {{ formatCurrency(summary.totals.recurring) }}
      .text-xs.text-gray-500.mt-1 {{ recurringCount }} active subscriptions

    // Total Combined Card
    UCard
      template(#header)
        .flex.items-center.justify-between
          span.text-sm.font-medium.text-gray-600 Total Balance
          UIcon(name="i-heroicons-calculator" class="w-5 h-5 text-green-500")
      .text-3xl.font-bold.text-green-600 {{ formatCurrency(summary.totals.combined) }}
      .text-xs.text-gray-500.mt-1 Combined total for {{ monthName }} {{ selectedYear }}

  // Loading state
  .grid.grid-cols-1.md_grid-cols-3.gap-4.mb-6(v-if="pending")
    UCard(v-for="i in 3" :key="i")
      USkeleton.h-20

  UCard
    // Filters
    .flex.flex-wrap.items-center.gap-3.mb-4
      UInput(v-model="filters.query" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search notes or category")
      USelectMenu(
        v-model="filters.category"
        :items="categoryItems"
        value-attribute="value"
        option-attribute="label"
        placeholder="All categories"
      )
      USelectMenu(
        v-model="filters.method"
        :items="methodItems"
        value-attribute="value"
        option-attribute="label"
        placeholder="All methods"
      )
      UButton(size="sm" variant="ghost" @click="clearFilters") Clear

    // Toggle
    .flex.items-center.gap-2.mb-4
      UButton(:variant="view === 'expenses' ? 'solid' : 'ghost'" @click="switchView('expenses')") Expenses
      UButton(:variant="view === 'recurring' ? 'solid' : 'ghost'" @click="switchView('recurring')") Recurring

    // Status / Session + counts
    .flex.items-center.justify-between.mb-2
      UBadge(color="gray") {{ filteredExpenses.length }} expenses · {{ filteredRecurring.length }} recurring

    ClientOnly
      // Expenses Table (Nuxt UI Table)
      div(v-if="view === 'expenses'")
        UAlert.mt-2(v-if="errorExp" color="red" variant="subtle" :title="formatErr(errorExp)")
        UTable(
          :data="pagedExpenseRows"
          :columns="expenseCols"
          v-model:sorting="sorting"
        )
          template(#empty)
            UAlert(title="No expenses found" color="gray" variant="subtle")
        // Pagination (client-side)
        .flex.items-center.justify-between.mt-3
          span.text-sm.opacity-70 {{ pageLabel }}
          UPagination(:total="expenseRows.length" v-model="page" :page-count="pageSize")

      // Recurring Table (Nuxt UI Table)
      div(v-else)
        UAlert.mt-2(v-if="errorRec" color="red" variant="subtle" :title="formatErr(errorRec)")
        UTable(
          :data="pagedRecurringRows"
          :columns="recurringCols"
          v-model:sorting="sorting"
        )
          template(#empty)
            UAlert(title="No recurring expenses found" color="gray" variant="subtle")

// Create Expense Modal
ExpenseCreateForm(
  v-model="isCreateModalOpen"
  @success="handleExpenseCreated"
)
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import type { ExpenseAdminView, ExpenseSummaryResponse, SelectMenuItem } from '~/types/expense'
import type { TableSortingState } from '~/types/table'

definePageMeta({})

const view = ref<ExpenseAdminView>('expenses')
const page = ref(1)
const pageSize = 20

// Table sorting state (TanStack format). Default: createdAt desc.
const sorting = ref<TableSortingState>([{ id: 'createdAt', desc: true }])

const filters = reactive({
  query: '',
  category: undefined as string | undefined,
  method: undefined as string | undefined
})

// Reset pagination whenever filters or sorting change
watch(() => [filters.query, filters.category, filters.method], () => { page.value = 1 })
watch(sorting, () => { page.value = 1 }, { deep: true })

// Centralized fetch/state via composable
const {
  expenses,
  recurring,
  pendingAny,
  errorExp,
  errorRec,
  refreshAll,
} = useExpense()

// --- Balance Summary Data ---
const now = new Date()
const selectedMonth = ref(now.getMonth() + 1) // 1-12
const selectedYear = ref(now.getFullYear())

// Month options (1-12)
const monthOptions = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 }
]

// Year options (current year ± 5 years)
const yearOptions = computed(() => {
  const currentYear = now.getFullYear()
  const years: SelectMenuItem<number>[] = []
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    years.push({ label: String(i), value: i })
  }
  return years.reverse()
})

// Computed query string
const queryString = computed(() => `month=${selectedMonth.value}&year=${selectedYear.value}`)

// Fetch summary data
const { data: summary, pending, error, refresh } = useFetch<ExpenseSummaryResponse>(
  () => `/api/expense/summary?${queryString.value}`,
  {
    server: false,
    credentials: 'include',
    watch: [selectedMonth, selectedYear]
  }
)

// Computed values
const monthName = computed(() => {
  const option = monthOptions.find(m => m.value === selectedMonth.value)
  return option?.label || ''
})

const expenseCount = computed(() => summary.value?.expenses?.length || 0)
const recurringCount = computed(() => summary.value?.recurring?.length || 0)

// Actions
function resetToCurrentMonth() {
  selectedMonth.value = now.getMonth() + 1
  selectedYear.value = now.getFullYear()
}

// --- Create Expense Modal ---
const isCreateModalOpen = ref(false)

async function handleExpenseCreated() {
  // Refresh data after expense is created
  await refreshAll()
  await refresh() // Refresh summary
}

// --- Select options via composable -> normalize to Nuxt UI SelectMenu items ---
const { categoryOptions, methodOptions, categories, methods } = useExpenseFilters()

/**
 * Ensures items are { label: string, value: string|undefined }
 * Accepts: ["A", "B"] or [{ label, value }, ...]
 */
const toItems = (list: unknown) => {
  const arr = Array.isArray(list) ? list : []
  return arr.map((o: any): SelectMenuItem<string> => typeof o === 'string'
    ? ({ label: o, value: o })
    : ({ label: String(o?.label ?? o?.value ?? ''), value: String(o?.value ?? '') }))
}

// Add an explicit "All" option (value: undefined) if not already present
function ensureAllOption<T>(items: SelectMenuItem<T>[], label = 'All'): SelectMenuItem<T | undefined>[] {
  const hasUndefined = items.some(i => i.value === undefined)
  return hasUndefined ? items : [{ label, value: undefined }, ...items]
}

const categoryItems = computed(() => ensureAllOption(toItems(unref(categoryOptions)), 'All categories'))
const methodItems   = computed(() => ensureAllOption(toItems(unref(methodOptions)), 'All methods'))

// --- Filters (no manual sort here — let the table own sorting) ---
const filteredExpenses = computed(() => {
  const q = filters.query.trim().toLowerCase()
  return expenses.value
    .filter(e => !filters.category || e.category === filters.category)
    .filter(e => !filters.method || e.method === filters.method)
    .filter(e => !q || String(e.note || '').toLowerCase().includes(q) || String(e.category || '').toLowerCase().includes(q))
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

// Client-side pagination
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

// Recurring (no manual sort — table handles it)
const filteredRecurring = computed(() => {
  const q = filters.query.trim().toLowerCase()
  return recurring.value
    .filter(r => !filters.category || r.category === filters.category)
    .filter(r => !q || String(r.note || '').toLowerCase().includes(q) || String(r.category || '').toLowerCase().includes(q))
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
      nextRun: r.nextRun
    }
  })
)

const pagedRecurringRows = computed(() => {
  const start = (page.value - 1) * pageSize
  return recurringRows.value.slice(start, start + pageSize)
})

// --- Nuxt UI Table (TanStack) column defs ---
const expenseCols = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }: any) => formatDate(row.getValue('createdAt'))
  },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'method', header: 'Method' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }: any) => formatCurrency(row.getValue('amount'))
  },
  { accessorKey: 'note', header: 'Note' }
]

const recurringCols = [
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'category', header: 'Category' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }: any) => formatCurrency(row.getValue('amount'))
  },
  { accessorKey: 'frequency', header: 'Frequency' },
  { accessorKey: 'interval', header: 'Interval' },
  {
    accessorKey: 'monthlyEquivalent',
    header: 'Monthly',
    cell: ({ row }: any) => formatCurrency(row.getValue('monthlyEquivalent'))
  },
  {
    accessorKey: 'startDate',
    header: 'Start',
    cell: ({ row }: any) => formatDate(row.getValue('startDate'))
  },
  {
    accessorKey: 'nextRun',
    header: 'Next',
    cell: ({ row }: any) => formatDate(row.getValue('nextRun'))
  }
]

// Helpers / events
function switchView(v: ExpenseAdminView) {
  view.value = v
  page.value = 1 // reset pagination when switching tabs
}

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

function formatErr(e: any) {
  try { return e?.data?.message || e?.message || String(e) } catch { return 'Request failed' }
}

function formatError(e: any) {
  try {
    return e?.data?.message || e?.message || String(e)
  } catch {
    return 'Failed to load data'
  }
}

onMounted(() => {
  watch([expenses, recurring, errorExp, errorRec], ([e, r, ex, er]) => {
  }, { immediate: true })
})
</script>
