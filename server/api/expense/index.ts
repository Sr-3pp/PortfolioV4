import Expense from '~/database/Models/Expense';
import { connectToDatabase } from '~/database/index'

export default defineEventHandler(async (event) => {
  await connectToDatabase()
  const expenses = await Expense.find()
  return expenses
})
