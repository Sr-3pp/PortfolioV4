import Recurring from '~/database/Models/RecurringExpense';

export default defineEventHandler(async () => {
	const recurringExpenses = await Recurring.find();

	return recurringExpenses;
})
