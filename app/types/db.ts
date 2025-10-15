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
  amount: number
  category: string
  note?: string
  frequency: 'monthly' | 'yearly'
  interval?: number
  startDate: Date
  endDate?: Date
  timezone?: string
  status?: 'active' | 'paused' | 'completed'
  nextRun?: Date
  lastRunAt?: Date
  remainingOccurrences?: number
  createdAt?: Date
  updatedAt?: Date
}

export type Expense = {
  _id?: string
  amount: number
  category: string
  method: string
  note?: string
  createdAt?: Date
  updatedAt?: Date
}
