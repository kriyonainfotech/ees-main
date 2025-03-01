const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MongoDB, {
      serverSelectionTimeoutMS: 50000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 20000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`[INFO] MongoDB Connected: ${conn.connection.host}`);

    // Handle connection errors
    mongoose.connection.on("error", (err) => {
      console.error("[ERROR] MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("[INFO] MongoDB disconnected. Attempting to reconnect...");
    });

    // Add reconnection logic
    mongoose.connection.on("reconnected", () => {
      console.log("[INFO] MongoDB reconnected successfully");
    });
  } catch (error) {
    console.error("[ERROR] MongoDB connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
