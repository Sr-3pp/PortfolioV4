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
      USelectMenu(
        v-model="filters.category"
        :items="categoryItems"
        value-key="value"
        label-key="label"
        placeholder="All categories"
      )
      USelectMenu(
        v-model="filters.method"
        :items="methodItems"
        value-key="value"
        label-key="label"
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
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

definePageMeta({})

const view = ref<'expenses' | 'recurring'>('expenses')
const page = ref(1)
const pageSize = 20

// Table sorting state (TanStack format). Default: createdAt desc.
type SortingState = Array<{ id: string; desc?: boolean }>
const sorting = ref<SortingState>([{ id: 'createdAt', desc: true }])

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

// --- Select options via composable -> normalize to Nuxt UI SelectMenu items ---
const { categoryOptions, methodOptions } = useExpenseFilters()

/**
 * Ensures items are { label: string, value: string|undefined }
 * Accepts: ["A", "B"] or [{ label, value }, ...]
 */
const toItems = (list: unknown) => {
  const arr = Array.isArray(list) ? list : []
  return arr.map((o: any) => typeof o === 'string'
    ? ({ label: o, value: o })
    : ({ label: o?.label ?? String(o?.value ?? ''), value: o?.value }))
}

// Add an explicit "All" option (value: undefined) if not already present
const ensureAllOption = (items: Array<{ label: string, value: any }>, label = 'All') => {
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
function switchView(v: 'expenses' | 'recurring') {
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

onMounted(() => {
  watch([expenses, recurring, errorExp, errorRec], ([e, r, ex, er]) => {
    console.log('[admin/expenses] data', { expenses: e?.length, recurring: r?.length, errorExp: ex, errorRec: er })
  }, { immediate: true })
})
</script>