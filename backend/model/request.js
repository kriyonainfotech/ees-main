const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "cancelled",
        "rejected",
        "completed",
        "rated",
      ],
      default: "pending",
    },
    completedBySender: { type: Boolean, default: false },
    completedByReceiver: { type: Boolean, default: false },
    userRatingbyprovider: {
      value: { type: Number, min: 1, max: 10, default: null },
      comment: { type: String, default: null },
      date: { type: Date },
    },

    providerRatingbySender: {
      value: { type: Number, min: 1, max: 10, default: null },
      comment: { type: String, default: null },
      date: { type: Date },
    },

    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
