/**
 * Utility functions for expense management
 */

/**
 * Helper to extract value from SelectMenu component
 * Handles cases where SelectMenu returns either a string or an object with {label, value}
 * 
 * @param val - The value from SelectMenu v-model
 * @returns The extracted string value
 */
export function extractSelectValue(val: unknown): string {
  if (typeof val === 'object' && val !== null && 'value' in val) {
    return String(val.value)
  }
  return String(val)
}

/**
 * Check if a value exists (handles both string and object from SelectMenu)
 * 
 * @param val - The value to check
 * @returns True if value exists and is not empty
 */
export function hasValue(val: unknown): boolean {
  if (!val) return false
  if (typeof val === 'string') return val.trim().length > 0
  if (typeof val === 'object' && val !== null && 'value' in val) return true
  return false
}

/**
 * Format currency for display
 * 
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat(undefined, { 
      style: 'currency', 
      currency 
    }).format(Number(amount || 0))
  } catch {
    return String(amount)
  }
}

/**
 * Format date for display
 * 
 * @param date - The date to format (string, Date, or any)
 * @returns Formatted date string or '-' if invalid
 */
export function formatDate(date: unknown): string {
  if (!date) return '-'
  const d = new Date(date as string | number | Date)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString()
}

/**
 * Format datetime for display
 * 
 * @param date - The date to format (string, Date, or any)
 * @returns Formatted datetime string or '-' if invalid
 */
export function formatDateTime(date: unknown): string {
  if (!date) return '-'
  const d = new Date(date as string | number | Date)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleString()
}

/**
 * Format error for display in toast/alert
 * 
 * @param error - The error object
 * @returns User-friendly error message
 */
export function formatError(error: unknown): string {
  if (!error) return 'An unexpected error occurred'
  
  try {
    if (typeof error === 'object' && error !== null) {
      if ('data' in error && typeof error.data === 'object' && error.data !== null && 'message' in error.data) {
        return String(error.data.message)
      }
      if ('message' in error) {
        return String(error.message)
      }
    }
    return String(error)
  } catch {
    return 'An unexpected error occurred'
  }
}
