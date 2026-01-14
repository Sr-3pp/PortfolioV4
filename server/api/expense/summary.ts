import Expense from '~/database/Models/Expense'
import RecurringExpense from '~/database/Models/RecurringExpense'
import { connectToDatabase } from '~/database/index'
import { requireSession } from '~~/server/utils/requireSession'
import type { RecurringExpense as RecurringExpenseType } from '~/types/db'

export default defineEventHandler(async (event) => {
  await requireSession(event)
  const q = getQuery(event)

  // --- Params & validation ---
  const monthParam = Number(q.month) // 1–12
  const yearParam  = Number(q.year)

  if (!isNaN(monthParam) && (monthParam < 1 || monthParam > 12)) {
    throw createError({ statusCode: 400, statusMessage: `Invalid month "${q.month}". Must be 1–12.` })
  }
  if (!isNaN(yearParam) && (yearParam < 1970 || yearParam > 9999)) {
    throw createError({ statusCode: 400, statusMessage: `Invalid year "${q.year}". Must be 1970–9999.` })
  }

  const now = new Date()
  const month0 = !isNaN(monthParam) ? monthParam - 1 : now.getUTCMonth()
  const year   = !isNaN(yearParam)  ? yearParam       : now.getUTCFullYear()

  // UTC month window: [start, nextStart)
  const monthStartUTC     = new Date(Date.UTC(year, month0, 1))
  const nextMonthStartUTC = new Date(Date.UTC(year, month0 + 1, 1))
	
  await connectToDatabase()

  // --- EXPENSES: total for the month ---
  const [expenseAgg] = await Expense.aggregate([
    {
      $addFields: {
        _eventDate: {
          $ifNull: [
            {
              $cond: [
                { $eq: [{ $type: '$created_at' }, 'string'] },
                { $toDate: '$created_at' },
                '$created_at'
              ]
            },
            {
              $cond: [
                { $eq: [{ $type: '$createdAt' }, 'string'] },
                { $toDate: '$createdAt' },
                '$createdAt'
              ]
            }
          ]
        },
        _amountNum: {
          $convert: { input: '$amount', to: 'double', onError: 0, onNull: 0 }
        }
      }
    },
    { $match: { _eventDate: { $ne: null } } },
    { $match: { _eventDate: { $gte: monthStartUTC, $lt: nextMonthStartUTC } } },
    { $group: { _id: null, total: { $sum: '$_amountNum' }, count: { $sum: 1 } } }
  ])

  const monthlyExpenses = expenseAgg?.total ?? 0

  // --- EXPENSES: list for the month (sorted newest first) ---
  const expenses = await Expense.aggregate([
    {
      $addFields: {
        _eventDate: {
          $ifNull: [
            {
              $cond: [
                { $eq: [{ $type: '$created_at' }, 'string'] },
                { $toDate: '$created_at' },
                '$created_at'
              ]
            },
            {
              $cond: [
                { $eq: [{ $type: '$createdAt' }, 'string'] },
                { $toDate: '$createdAt' },
                '$createdAt'
              ]
            }
          ]
        }
      }
    },
    { $match: { _eventDate: { $ne: null } } },
    { $match: { _eventDate: { $gte: monthStartUTC, $lt: nextMonthStartUTC } } },
    { $sort: { _eventDate: -1 } }
  ])

  // --- RECURRING: list of active recurring + computed monthlyEquivalent ---
  const recurring = await RecurringExpense.aggregate([
    { $match: { status: 'active' } },
    {
      $addFields: {
        amountNum: {
          $convert: { input: '$amount', to: 'double', onError: 0, onNull: 0 }
        },
        startMonth: { $month: '$startDate' }, // Extract month from startDate (1-12)
        monthlyEquivalent: {
          $cond: [
            { $eq: ['$frequency', 'monthly'] },
            // Monthly: always include full amount
            { $convert: { input: '$amount', to: 'double', onError: 0, onNull: 0 } },
            // Yearly: only include if startMonth matches the selected month
            {
              $cond: [
                { $eq: [{ $month: '$startDate' }, month0 + 1] }, // month0 is 0-indexed, $month returns 1-12
                { $convert: { input: '$amount', to: 'double', onError: 0, onNull: 0 } },
                0 // Not due this month
              ]
            }
          ]
        }
      }
    },
    { $sort: { createdAt: -1 } } // adjust if your timestamps are snake_case
  ])

  // Sum recurring monthly from the list we already computed
  const recurringMonthly = recurring.reduce((sum: number, r: Partial<RecurringExpenseType> & { monthlyEquivalent?: number }) => sum + (r.monthlyEquivalent || 0), 0)

  return {
    success: true,
    month: month0 + 1, // 1–12
    year,
    totals: {
      expenses: monthlyExpenses,
      recurring: recurringMonthly,
      combined: monthlyExpenses + recurringMonthly
    },
    expenses,   // one-time expenses for the month
    recurring   // active recurring items with monthlyEquivalent
  }
})
