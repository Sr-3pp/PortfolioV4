import Expense from '~/database/Models/Expense';

export default defineEventHandler(async () => {
	const expenses = await Expense.find()
	return expenses;
})
