const express = require("express");
const {
  CreateOrder,
  verifyPayment,
  generateGstInvoice,
  capturePayment,
  verifyCapturedPayment,
  paymentVerifeid,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", CreateOrder);
router.post("/verify-payment", verifyPayment);
router.post("/reports", generateGstInvoice);
router.post("/capture-payment", capturePayment);
router.post("/verify-capture-payment", verifyCapturedPayment);
router.post("/paymentVerified", paymentVerifeid);

module.exports = router;
