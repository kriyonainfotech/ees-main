const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const connectDB = require("./config/db");
const port = 3000; // Use environment variable or default to 4000
const serverType = "Flutter Backend";
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");

// Use this to fix the deprecation warning
app.use(bodyParser.urlencoded({ extended: true })); // Change `true` or `false` as needed
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    server: "Flutter Backend",
    message: "Flutter backend server is running",
    port: port,
    environment: process.env.NODE_ENV || "development",
  });
});

// Routes
app.use("/", require("./routes/indexRoute"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Connect to database
connectDB()
  .then(() => {
    // Only start server after DB connection
    app.listen(port, (err) => {
      if (err) {
        console.error(`[${serverType}] Error starting server:`, err);
        process.exit(1);
      }
      console.log(`[${serverType}] Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`[${serverType}] Uncaught Exception:`, err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error(`[${serverType}] Unhandled Rejection:`, err);
  process.exit(1);
});
