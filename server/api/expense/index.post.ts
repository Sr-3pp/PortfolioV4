import Expense from '~/database/Models/Expense'
import { connectToDatabase } from '~/database/index'
import { requireSession } from '~~/server/utils/requireSession'

export default defineEventHandler(async (event) => {
  await requireSession(event)
  const body = await readBody(event)

  await connectToDatabase()

  if (!body || typeof body.amount !== 'number' || !body.category || !body.method) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  const doc = await Expense.create({
    amount: body.amount,
    category: body.category,
    method: body.method,
    note: body.note ?? '',
  })

  return { success: true, expense: doc }
})
