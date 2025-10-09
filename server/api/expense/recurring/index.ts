import Recurring from '~/database/Models/RecurringExpense';
import { connectToDatabase } from '~/database/index'


export default defineEventHandler(async () => {
	await connectToDatabase()
	const recurringExpenses = await Recurring.find();

	return recurringExpenses;
})
