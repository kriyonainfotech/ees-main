const mongoose = require("mongoose");

const investmentPlanSchema = new mongoose.Schema({
  type: { type: String, enum: ["monthly", "yearly"], required: true }, // Monthly or Yearly
  investmentAmount: { type: Number, required: true }, // Minimum Investment Amount
  returnAmount: { type: Number, required: true }, // Fixed return amount per cycle
  duration: { type: Number, required: true }, // In months (e.g., 12 for yearly, 1 for monthly)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("InvestmentPlan", investmentPlanSchema);
