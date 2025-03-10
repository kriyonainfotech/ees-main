const express = require("express");
const {
  CreateOrder,
  verifyPayment,
  generateGstInvoice,
  capturePayment,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", CreateOrder);
router.post("/verify-payment", verifyPayment);
router.post("/reports", generateGstInvoice);
router.post("/capture-payment", capturePayment);

module.exports = router;
