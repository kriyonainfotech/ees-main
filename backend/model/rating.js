const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
    required: true,
  },
  rater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ratedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ratingType: {
    type: String,
    enum: ["provider", "user"],
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  comment: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Rating", ratingSchema);
