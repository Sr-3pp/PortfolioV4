import { describe, it, expect, vi } from 'vitest'
import { useExpenseFilters } from '~/composables/ExpenseFilters'
import type { Expense } from '~/types/db'

// Mock the useExpense composable
vi.mock('~/composables/Expense', () => ({
  useExpense: () => ({
    expenses: ref<Expense[]>([
      { amount: 100, category: 'food', method: 'Cash', note: 'Test' },
      { amount: 200, category: 'transport', method: 'Credit Card', note: 'Test' },
      { amount: 300, category: 'food', method: 'Debit Card', note: 'Test' },
    ])
  })
}))

describe('useExpenseFilters', () => {
  it('should return categories from allowedCategories', () => {
    const { categories } = useExpenseFilters()
    
    expect(categories.value).toContain('food')
    expect(categories.value).toContain('transport')
    expect(categories.value).toContain('entertainment')
    expect(categories.value).toContain('shopping')
    expect(categories.value).toContain('bills')
    expect(categories.value).toContain('other')
  })

  it('should return categoryOptions with "All categories" option', () => {
    const { categoryOptions } = useExpenseFilters()
    
    expect(categoryOptions.value[0]).toEqual({ label: 'All categories', value: undefined })
    expect(categoryOptions.value.length).toBeGreaterThan(1)
  })

  it('should return methods from allowedMethods and existing expenses', () => {
    const { methods } = useExpenseFilters()
    
    // Should include allowed methods
    expect(methods.value).toContain('Cash')
    expect(methods.value).toContain('Credit Card')
    expect(methods.value).toContain('Debit Card')
    expect(methods.value).toContain('Bank Transfer')
    expect(methods.value).toContain('PayPal')
    expect(methods.value).toContain('Venmo')
  })

  it('should return methodOptions with "All methods" option', () => {
    const { methodOptions } = useExpenseFilters()
    
    expect(methodOptions.value[0]).toEqual({ label: 'All methods', value: undefined })
    expect(methodOptions.value.length).toBeGreaterThan(1)
  })

  it('should return methods sorted alphabetically', () => {
    const { methods } = useExpenseFilters()
    
    const sorted = [...methods.value].sort((a, b) => a.localeCompare(b))
    expect(methods.value).toEqual(sorted)
  })

  it('should include unique methods from expenses', () => {
    const { methods } = useExpenseFilters()
    
    // Should not have duplicates
    const unique = new Set(methods.value)
    expect(methods.value.length).toBe(unique.size)
  })
})
