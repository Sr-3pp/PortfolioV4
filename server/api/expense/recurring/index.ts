import Recurring from '~/database/Models/RecurringExpense';
import { connectToDatabase } from '~/database/index'


export default defineEventHandler(async (event) => {
  await connectToDatabase()
  const recurringExpenses = await Recurring.find();
  return recurringExpenses;
})
