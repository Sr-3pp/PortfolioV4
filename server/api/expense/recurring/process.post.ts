import Recurring from '~/database/Models/RecurringExpense'
import Expense from '~/database/Models/Expense'

/**
 * Utilities to advance dates while keeping Day-Of-Month where possible.
 * (e.g., Jan 31 -> Feb 29/28, then Mar 31; time component preserved)
 */
function lastDayOfMonthUTC(year: number, monthIndex0: number) {
  return new Date(Date.UTC(year, monthIndex0 + 1, 0)).getUTCDate()
}
function clampDay(year: number, monthIndex0: number, day: number) {
  return Math.min(day, lastDayOfMonthUTC(year, monthIndex0))
}
function addMonthsKeepDOM(d: Date, months: number) {
  const y = d.getUTCFullYear()
  const m = d.getUTCMonth()
  const day = d.getUTCDate()
  const targetM = m + months
  const newY = y + Math.floor(targetM / 12)
  const newM = ((targetM % 12) + 12) % 12
  const newD = clampDay(newY, newM, day)
  return new Date(Date.UTC(newY, newM, newD, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()))
}
function addYearsKeepDOM(d: Date, years: number) {
  const y = d.getUTCFullYear() + years
  const m = d.getUTCMonth()
  const newD = clampDay(y, m, d.getUTCDate())
  return new Date(Date.UTC(y, m, newD, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()))
}

function advanceNextRun(currentNext: Date, freq: 'monthly' | 'yearly', interval = 1) {
  return freq === 'monthly'
    ? addMonthsKeepDOM(currentNext, interval)
    : addYearsKeepDOM(currentNext, interval)
}

export default defineEventHandler(async (event) => {
  // OPTIONAL: protect this route (e.g., with a Bearer token header)
  // const auth = getHeader(event, 'authorization')
  // if (auth !== `Bearer ${useRuntimeConfig().cronToken}`) {
  //   throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  // }

  const now = new Date()

  // Find all active, due recurrences (no duplicate $or keys!)
  const recurrences = await Recurring.find({
    status: 'active',
    nextRun: { $lte: now },
    $and: [
      { $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }] },
      { $or: [{ remainingOccurrences: { $exists: false } }, { remainingOccurrences: { $gt: 0 } }] },
    ],
  }).lean(false) // need full documents to modify & save

  let created = 0
  const processedIds: string[] = []
  const createdExpenseIds: string[] = []
  const errors: Array<{ id: string; error: string }> = []

  for (const r of recurrences) {
    processedIds.push(String(r._id))
    try {
      // 1) Create the concrete Expense at scheduled time (or now as fallback)
      const occurredAt = r.nextRun ?? now
      const exp = await Expense.create({
        amount: r.amount,
        category: r.category,
        note: r.note ?? '',
        // If your Expense schema uses timestamps only, you don't need occurred_at.
        // Using createdAt timestamps will reflect when this materialization happened.
        // occurred_at: occurredAt, // <-- include only if your model has it
        createdAt: occurredAt, // if you mapped timestamps to snake_case, remove this line
      })
      created++
      createdExpenseIds.push(String(exp._id))

      // 2) Update recurrence state
      if (typeof r.remainingOccurrences === 'number') {
        r.remainingOccurrences = r.remainingOccurrences - 1
      }
      r.lastRunAt = now

      // 3) Compute the subsequent nextRun
      const interval = (r as any).interval ?? 1
      const freq = (r as any).frequency as 'monthly' | 'yearly'
      const currentNext = r.nextRun ?? r.startDate
      const candidateNext = advanceNextRun(currentNext, freq, interval)

      const exhausted =
        typeof r.remainingOccurrences === 'number' && r.remainingOccurrences <= 0
      const pastEnd = r.endDate && candidateNext > r.endDate

      if (exhausted || pastEnd) {
        r.status = 'completed'
        r.nextRun = undefined
      } else {
        r.nextRun = candidateNext
      }

      await r.save()
    } catch (err: any) {
      errors.push({ id: String(r._id), error: err?.message || String(err) })
    }
  }

  return {
    success: errors.length === 0,
    processed: recurrences.length,
    created,
    processedIds,
    createdExpenseIds,
    errors, // any per-item failures are reported here
  }
})
