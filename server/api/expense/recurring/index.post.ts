import Recurring from '~/database/Models/RecurringExpense'

export default defineEventHandler(async (event) => {
  const b = await readBody(event)
  // Minimal validation
  
  if (typeof b?.amount !== 'number' || !b?.category || !['monthly','yearly'].includes(b?.frequency)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  const doc = await Recurring.create({
    amount: b.amount,
    category: b.category,
    note: b.note ?? '',
    frequency: b.frequency,                 // 'monthly' | 'yearly'
    interval: b.interval ?? 1,              // default every 1
    startDate: new Date(b.startDate),       // ISO string recommended
    endDate: b.endDate ? new Date(b.endDate) : undefined,
    timezone: b.timezone ?? 'UTC',
    remainingOccurrences: b.remainingOccurrences, // optional number
  })

  return { success: true, recurring: doc }
})
