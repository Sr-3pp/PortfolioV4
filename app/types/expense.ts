import type { Expense, RecurringExpense } from '~/types/db'

export type ExpenseAdminView = 'expenses' | 'recurring'
export type ExpenseFrequency = 'monthly' | 'yearly'

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
  frequency: ExpenseFrequency
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
export interface SelectMenuItem<T = string> {
  label: string
  value: T
}

export interface ExpenseSummaryTotals {
  expenses: number
  recurring: number
  combined: number
}

export interface ExpenseSummaryResponse {
  success: boolean
  month: number
  year: number
  totals: ExpenseSummaryTotals
  expenses: Expense[]
  recurring: RecurringExpense[]
}
