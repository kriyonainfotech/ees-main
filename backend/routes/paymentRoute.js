const express = require("express");
const {
  CreateOrder,
  verifyPayment,
  generateUserReport,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", CreateOrder);
router.post("/verify-payment", verifyPayment);
router.post("/reports", generateUserReport);

module.exports = router;
