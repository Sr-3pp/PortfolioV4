export type User = {
  _id?: string
  name: string
  email: string
  passwordHash: string
  emailVerified?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export type Session = {
  _id?: string
  token: string
  userId: string
  userAgent?: string
  ip?: string
  expiresAt: Date
  createdAt?: Date
  updatedAt?: Date
}

export type RecurringExpense = {
  _id?: string
  id?: string
  amount: number
  category: string
  note?: string
  frequency: 'monthly' | 'yearly'
  interval?: number
  startDate: Date | string
  endDate?: Date | string
  timezone?: string
  status?: 'active' | 'paused' | 'completed'
  nextRun?: Date | string
  lastRunAt?: Date | string
  remainingOccurrences?: number
  createdAt?: Date | string
  updatedAt?: Date | string
  monthlyEquivalent?: number
}

export type Expense = {
  _id?: string
  id?: string
  amount: number
  category: string
  method: string
  note?: string
  createdAt?: Date | string
  created_at?: Date | string
  _eventDate?: Date | string
  updatedAt?: Date | string
}
