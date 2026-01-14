import Expense from '~/database/Models/Expense';
import { connectToDatabase } from '~/database/index'
import { requireSession } from '~~/server/utils/requireSession'

export default defineEventHandler(async (event) => {
  await requireSession(event)
  await connectToDatabase()
  const expenses = await Expense.find()
  return expenses
})
