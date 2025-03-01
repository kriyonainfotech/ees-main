const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: { type: String },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    ekyc: { type: mongoose.Schema.Types.ObjectId, ref: "KYC" }, // Reference KYC
    address: {
      area: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },
    permanentAddress: {
      type: String,
    },
    aadharNumber: {
      type: String,
      unique: true,
      minlength: 12,
      maxlength: 12,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["User", "Admin"], // Restrict to specific values
      default: "User",
    },
    businessCategory: {
      type: Array,
    },
    businessName: {
      type: String,
    },
    businessAddress: {
      type: String,
    },
    businessDetaile: {
      type: String,
    },
    frontAadhar: {
      type: String,
    },
    backAadhar: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    fcmToken: {
      type: String,
      default: null,
    },
    isAdminApproved: { type: Boolean, default: false },
    userstatus: {
      type: String,
      enum: ["available", "unavailable"], // Allowed values
      default: "available", // Default value
    },
    sended_requests: [
      {
        requestId: { type: mongoose.Schema.Types.ObjectId, required: true },
        user: {
          // Renamed for clarity
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
        date: { type: Date, default: Date.now },
        providerrating: {
          value: { type: Number, min: 1, max: 10, default: null },
          comment: { type: String, default: null },
          date: { type: Date, default: Date.now },
        },
      },
    ],

    received_requests: [
      {
        requestId: { type: mongoose.Schema.Types.ObjectId, required: true },
        user: {
          // Renamed for clarity
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
        date: { type: Date, default: Date.now },

        userrating: {
          value: { type: Number, min: 1, max: 10, default: null },
          comment: { type: String, default: null },
          date: { type: Date, default: Date.now },
        },
      },
    ],

    userRatings: [
      {
        rater: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 10,
        },
        comment: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    userAverageRating: {
      type: Number,
      default: 0,
    },
    // Ratings received as a provider
    providerRatings: [
      {
        rater: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 10,
        },
        comment: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    providerAverageRating: {
      type: Number,
      default: 0,
    },
    referralCode: { type: String, unique: true }, // Unique referral code (userId)
    referredBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Up to 4 levels of referrals
    referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Direct referrals

    // Earnings & Wallet
    earnings: { type: Number, default: 0 }, // Total earnings from referrals
    walletBalance: { type: Number, default: 0 }, // Available balance in wallet
    earningsHistory: [
      {
        amount: { type: Number, required: true }, // Earned amount from referral
        sourceUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        }, // User who generated the earnings
        date: { type: Date, default: Date.now }, // Timestamp of earning
        type: { type: String }, // Type of earning (e.g., "Referral Bonus", "Withdrawal")
      },
    ],
    paymentHistory: [
      {
        paymentId: String, // Razorpay Payment ID
        orderId: String, // Razorpay Order ID or Payment Link ID
        amount: Number, // Amount paid
        currency: String, // Currency of the transaction
        status: String, // Payment status (e.g., "paid", "failed")
        createdAt: { type: Date, default: Date.now },
      },
    ],
    withdrawalHistory: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Withdrawal" },
    ],
    notifications: [
      {
        senderName: String,
        title: String,
        message: String,
        type: { type: String, enum: ["referral", "reward", "new_work"] },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    resetCode: { type: String }, // To store the reset code
    resetCodeExpires: { type: Number },
    paymentVerified: { type: Boolean, default: false }, // New field added
    paymentExpiry: { type: Date, default: null },
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
