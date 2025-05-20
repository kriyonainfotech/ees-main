const cron = require("node-cron");
const checkAndNotifyPayments = require("../controllers/checkAndNotifyPayments");

// Schedule the job to run every day at 00:00 (midnight)
cron.schedule("0 0 * * *", async () => {
  console.log("🕛 Running daily payment expiry check...");
  await checkAndNotifyPayments();
});
