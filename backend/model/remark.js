// models/Remark.js
const mongoose = require("mongoose");

const RemarkSchema = new mongoose.Schema(
  {
    remark: {
      type: String,
      required: true,
    },
    userStatus: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        is_completed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Remark", RemarkSchema);
