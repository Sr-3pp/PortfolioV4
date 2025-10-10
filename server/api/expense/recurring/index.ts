import Recurring from '~/database/Models/RecurringExpense';
import { connectToDatabase } from '~/database/index'
import { requireSession } from '~~/server/utils/requireSession'


export default defineEventHandler(async (event) => {
  await requireSession(event)
  await connectToDatabase()
  const recurringExpenses = await Recurring.find();
  return recurringExpenses;
})
