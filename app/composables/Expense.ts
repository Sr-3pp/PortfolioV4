import type { Expense, RecurringExpense } from '~/types/db'

export const useExpense = () => {
  // Fetch expenses (client-only, include credentials for cookie auth)
  const {
    data: expensesData,
    pending: pendingExp,
    error: errorExp,
    refresh: refreshExpenses,
  } = useFetch<Expense[]>('/api/expense', {
    method: 'GET',
    server: false,
    credentials: 'include',
    default: () => [],
  })

  // Fetch recurring expenses
  const {
    data: recurringData,
    pending: pendingRec,
    error: errorRec,
    refresh: refreshRecurring,
  } = useFetch<RecurringExpense[]>('/api/expense/recurring', {
    method: 'GET',
    server: false,
    credentials: 'include',
    default: () => [],
  })

  const expenses = computed<Expense[]>(() => Array.isArray(expensesData.value) ? expensesData.value : [])
  const recurring = computed<RecurringExpense[]>(() => Array.isArray(recurringData.value) ? recurringData.value : [])

  const pendingAny = computed(() => pendingExp.value || pendingRec.value)
  function refreshAll() { refreshExpenses(); refreshRecurring() }

  return {
    // raw refs
    expensesData,
    recurringData,
    pendingExp,
    pendingRec,
    errorExp,
    errorRec,
    // derived
    expenses,
    recurring,
    pendingAny,
    // actions
    refreshExpenses,
    refreshRecurring,
    refreshAll,
  }
}
