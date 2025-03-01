const mongoose = require("mongoose");

const WithdrawalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    kyc: { type: mongoose.Schema.Types.ObjectId, ref: "KYC", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    payoutId: { type: String, default: null }, // Razorpay Payout ID
    processedAt: { type: Date, default: null }, // Timestamp when processed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Withdrawal", WithdrawalSchema);
