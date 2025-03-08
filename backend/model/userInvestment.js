const mongoose = require("mongoose");

const userInvestmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "InvestmentPlan", required: true }, // Investment Plan Reference
  amount: { type: Number, required: true }, // Invested Amount
  startDate: { type: Date, default: Date.now }, // Start Date
  nextPayoutDate: { type: Date, required: true }, // Next Scheduled Payout
  status: { type: String, enum: ["active", "completed"], default: "active" }, // Investment Status
});

module.exports = mongoose.model("UserInvestment", userInvestmentSchema);
