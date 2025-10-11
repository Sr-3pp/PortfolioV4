// /server/models/RecurringExpense.ts
import type { InferSchemaType, Model } from 'mongoose'
import mongoose, { Schema } from 'mongoose'
import allowedCategories from "../utils/allowedCategories"

const RecurringExpenseSchema = new Schema({
  amount: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    required: true,
    enum: allowedCategories
  },
  note: { type: String, default: '' },

  // Scheduling
  frequency: { type: String, required: true, enum: ['monthly','yearly'] },
  interval: { type: Number, default: 1, min: 1 }, // every N months/years
  startDate: { type: Date, required: true },      // anchor date (local to timezone)
  endDate: { type: Date },                         // optional stop
  timezone: { type: String, default: 'UTC' },     // e.g. "America/Mexico_City"

  // State
  status: { type: String, enum: ['active','paused','completed'], default: 'active' },
  nextRun: { type: Date, index: true },           // when to materialize next
  lastRunAt: { type: Date },
  remainingOccurrences: { type: Number },         // optional cap; decremented on each run
}, { timestamps: true })

type RecurringExpenseDoc = InferSchemaType<typeof RecurringExpenseSchema>

// --- Helpers to compute next run (no external deps) ---
function clampDay(year: number, monthIndex0: number, day: number) {
  // monthIndex0: 0-11
  const lastDay = new Date(year, monthIndex0 + 1, 0).getDate()
  return Math.min(day, lastDay)
}
function addMonthsKeepDOM(d: Date, months: number) {
  const year = d.getUTCFullYear()
  const month = d.getUTCMonth()
  const day = d.getUTCDate()
  const targetMonth = month + months
  const newYear = year + Math.floor(targetMonth / 12)
  const newMonth = ((targetMonth % 12) + 12) % 12
  const newDay = clampDay(newYear, newMonth, day)
  return new Date(Date.UTC(newYear, newMonth, newDay, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()))
}
function addYearsKeepDOM(d: Date, years: number) {
  const year = d.getUTCFullYear() + years
  const month = d.getUTCMonth()
  const day = clampDay(year, month, d.getUTCDate())
  return new Date(Date.UTC(year, month, day, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()))
}

// IMPORTANT: We treat startDate as local to `timezone`, but we store dates in UTC.
// Minimal approach: compute using the stored UTC date’s DOM as the anchor.
// If you need exact local-midnight scheduling, consider storing a localTime string too.

function computeFirstNextRun(now: Date, start: Date, freq: 'monthly'|'yearly', interval: number) {
  // If start in future → first run = start
  if (start > now) return start
  let next = new Date(start)
  if (freq === 'monthly') {
    while (next <= now) next = addMonthsKeepDOM(next, interval)
  } else {
    while (next <= now) next = addYearsKeepDOM(next, interval)
  }
  return next
}

RecurringExpenseSchema.pre('save', function(next) {
  const doc = this as mongoose.Document & { nextRun?: Date; startDate: Date; frequency: 'monthly'|'yearly'; interval: number; status: string }
  if (!doc.nextRun && doc.status !== 'completed' && doc.status !== 'paused') {
    doc.nextRun = computeFirstNextRun(new Date(), doc.startDate, doc.frequency, doc.interval || 1)
  }
  next()
})

const RecurringExpenseModel =
  (mongoose.models.RecurringExpense as Model<RecurringExpenseDoc>) ||
  mongoose.model<RecurringExpenseDoc>('RecurringExpense', RecurringExpenseSchema)

export default RecurringExpenseModel
