import Recurring from '~/database/Models/RecurringExpense'
import Expense from '~/database/Models/Expense'

function advanceNextRun(start: Date, currentNext: Date, freq: 'monthly'|'yearly', interval: number) {
  // Advance from currentNext by exactly one step
  if (freq === 'monthly') return new Date(addMonths(currentNext, interval))
  return new Date(addYears(currentNext, interval))
  // Helpers using DOM-safe versions:
  function addMonths(d: Date, months: number) { return addMonthsKeepDOM(d, months) }
  function addYears(d: Date, years: number) { return addYearsKeepDOM(d, years) }
}

export default defineEventHandler(async (event) => {
  // TODO: add auth (e.g., HMAC or Bearer) so only your cron can call this
  const now = new Date()

  const recurrences = await Recurring.find({
    status: 'active',
    nextRun: { $lte: now },
    $or: [
      { endDate: { $exists: false } },
      { endDate: { $gte: now } }
    ],
    $or: [
      { remainingOccurrences: { $exists: false } },
      { remainingOccurrences: { $gt: 0 } }
    ],
  }).lean(false) // need full docs to modify & save

  let created = 0

  for (const r of recurrences) {
    // 1) Create the concrete expense
    await Expense.create({
      amount: r.amount,
      category: r.category,
      note: r.note,
      occurred_at: r.nextRun ?? now, // stamp at scheduled time or now
    })
    created++

    // 2) Update recurrence state
    if (typeof r.remainingOccurrences === 'number') {
      r.remainingOccurrences = r.remainingOccurrences - 1
    }
    r.lastRunAt = now

    // 3) Compute next
    const next = advanceNextRun(r.startDate, r.nextRun ?? r.startDate, r.frequency as any, r.interval ?? 1)

    // Stop if past end or exhausted
    const exhausted = typeof r.remainingOccurrences === 'number' && r.remainingOccurrences <= 0
    const pastEnd = r.endDate && next > r.endDate
    if (exhausted || pastEnd) {
      r.status = 'completed'
      r.nextRun = undefined
    } else {
      r.nextRun = next
    }
    await r.save()
  }

  return { success: true, processed: recurrences.length, created }
})
