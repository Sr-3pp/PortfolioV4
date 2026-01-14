import allowedCategories from '~/database/utils/allowedCategories'
import allowedMethods from '~/database/utils/allowedMethods'
import type { Expense } from '~/types/db'

export const useExpenseFilters = () => {
  const { expenses } = useExpense()

  // Categories from allowed list
  const categories = computed(() => Array.from(allowedCategories))
  const categoryOptions = computed(() => [
    { label: 'All categories', value: undefined },
    ...categories.value.map(c => ({ label: c, value: c }))
  ])

  // Methods: combine allowed methods with methods from existing expenses
  const methods = computed(() => {
    const set = new Set<string>(allowedMethods)
    for (const e of (expenses.value as Expense[]) || []) {
      const m = String(e.method || '').trim()
      if (m) set.add(m)
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  })
  const methodOptions = computed(() => [
    { label: 'All methods', value: undefined },
    ...methods.value.map(m => ({ label: m, value: m }))
  ])

  return {
    categories,
    methods,
    categoryOptions,
    methodOptions,
  }
}
