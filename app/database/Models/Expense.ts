import mongoose from "mongoose";
import allowedCategories from "../utils/allowedCategories";
const expenseSchema = new mongoose.Schema(
  {
	  amount: {type: Number, required: true},
	  category: {
		type: String,
		required: true,
		enum: allowedCategories 
	  },
	  method: {type: String, required: true},
	  note: {type: String}
  },
  { timestamps: true, strict: true, strictQuery: true },
);
export default mongoose.models.Expense ||
  mongoose.model("Expense", expenseSchema, "expense");
