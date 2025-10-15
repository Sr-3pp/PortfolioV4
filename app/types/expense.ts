/**
 * Form interface for creating/editing expenses
 * Combines fields for both one-time and recurring expenses
 */
export interface ExpenseFormData {
  amount: number
  category: string
  method: string
  note: string
  isRecurring: boolean
  frequency: 'monthly' | 'yearly'
  interval: number
  startDate: string
  endDate: string
}

/**
 * Initial/default values for expense form
 */
export const DEFAULT_EXPENSE_FORM: ExpenseFormData = {
  amount: 0,
  category: '',
  method: '',
  note: '',
  isRecurring: false,
  frequency: 'monthly',
  interval: 1,
  startDate: new Date().toISOString().split('T')[0],
  endDate: ''
}

/**
 * Frequency options for recurring expenses
 */
export const FREQUENCY_OPTIONS = [
  { label: 'Monthly', value: 'monthly' as const },
  { label: 'Yearly', value: 'yearly' as const }
] as const

/**
 * Helper type for SelectMenu items
 */
export interface SelectMenuItem {
  label: string
  value: string
}
