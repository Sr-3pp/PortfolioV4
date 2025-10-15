import { describe, it, expect } from 'vitest'
import { 
  extractSelectValue, 
  hasValue, 
  formatCurrency, 
  formatDate, 
  formatDateTime,
  formatError 
} from '~/utils/expense'

describe('Expense Utils', () => {
  describe('extractSelectValue', () => {
    it('should return string value as-is', () => {
      expect(extractSelectValue('test')).toBe('test')
      expect(extractSelectValue('food')).toBe('food')
    })

    it('should extract value from object', () => {
      expect(extractSelectValue({ label: 'Food', value: 'food' })).toBe('food')
      expect(extractSelectValue({ label: 'Bills', value: 'bills' })).toBe('bills')
    })

    it('should return string of input if not object with value', () => {
      expect(extractSelectValue(null)).toBe('null')
      expect(extractSelectValue(undefined)).toBe('undefined')
      expect(extractSelectValue(123)).toBe('123')
    })
  })

  describe('hasValue', () => {
    it('should return true for non-empty strings', () => {
      expect(hasValue('test')).toBe(true)
      expect(hasValue('food')).toBe(true)
    })

    it('should return false for empty strings', () => {
      expect(hasValue('')).toBe(false)
      expect(hasValue('   ')).toBe(false)
    })

    it('should return true for objects with value', () => {
      expect(hasValue({ label: 'Food', value: 'food' })).toBe(true)
    })

    it('should return false for falsy values', () => {
      expect(hasValue(null)).toBe(false)
      expect(hasValue(undefined)).toBe(false)
      expect(hasValue(0)).toBe(false)
      expect(hasValue(false)).toBe(false)
    })
  })

  describe('formatCurrency', () => {
    it('should format USD currency by default', () => {
      const result = formatCurrency(1234.56)
      expect(result).toContain('1,234.56')
      expect(result).toContain('$')
    })

    it('should handle zero', () => {
      const result = formatCurrency(0)
      expect(result).toContain('0')
    })

    it('should handle negative numbers', () => {
      const result = formatCurrency(-100)
      expect(result).toContain('100')
    })

    it('should handle custom currency', () => {
      const result = formatCurrency(100, 'EUR')
      expect(result).toBeTruthy()
    })

    it('should fallback on error', () => {
      const result = formatCurrency(NaN)
      expect(typeof result).toBe('string')
    })
  })

  describe('formatDate', () => {
    it('should format valid date string', () => {
      const result = formatDate('2024-01-15')
      expect(result).not.toBe('-')
      expect(result).toContain('1')
      expect(result).toContain('15')
    })

    it('should format Date object', () => {
      const date = new Date('2024-01-15')
      const result = formatDate(date)
      expect(result).not.toBe('-')
    })

    it('should return "-" for null/undefined', () => {
      expect(formatDate(null)).toBe('-')
      expect(formatDate(undefined)).toBe('-')
    })

    it('should return "-" for invalid date', () => {
      expect(formatDate('invalid')).toBe('-')
      expect(formatDate('not-a-date')).toBe('-')
    })
  })

  describe('formatDateTime', () => {
    it('should format valid datetime', () => {
      const result = formatDateTime('2024-01-15T10:30:00')
      expect(result).not.toBe('-')
    })

    it('should include time information', () => {
      const result = formatDateTime(new Date('2024-01-15T10:30:00'))
      expect(result).not.toBe('-')
      // Should contain time-related characters
      expect(result.length).toBeGreaterThan(formatDate('2024-01-15').length)
    })

    it('should return "-" for invalid input', () => {
      expect(formatDateTime(null)).toBe('-')
      expect(formatDateTime('invalid')).toBe('-')
    })
  })

  describe('formatError', () => {
    it('should extract message from error object', () => {
      const error = { message: 'Test error' }
      expect(formatError(error)).toBe('Test error')
    })

    it('should extract from data.message', () => {
      const error = { data: { message: 'API error' } }
      expect(formatError(error)).toBe('API error')
    })

    it('should convert to string if no message', () => {
      expect(formatError('Simple error')).toBe('Simple error')
    })

    it('should return default message on failure', () => {
      expect(formatError(null)).toBe('An unexpected error occurred')
    })

    it('should handle Error instances', () => {
      const error = new Error('Test error')
      expect(formatError(error)).toBe('Test error')
    })
  })
})
