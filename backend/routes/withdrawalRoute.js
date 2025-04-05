const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { verifyToken, isAdmin } = require("../middleware/auth");
const {
  addekyc,
  getWithdrawalRequests,
  verifyKYC,
  approveBankWithdrawal,
  submitWithdrawalRequest,
} = require("../controllers/withdrawalController");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post(
  "/addkyc",
  verifyToken,
  upload.fields([
    { name: "bankProof", maxCount: 1 },
    { name: "panCardfront", maxCount: 1 },
    { name: "panCardback", maxCount: 1 },
    { name: "frontAadhar", maxCount: 1 },
    { name: "backAadhar", maxCount: 1 },
  ]),
  addekyc
);

router.post("/request",verifyToken, submitWithdrawalRequest);
router.get("/withdrawals",isAdmin ,getWithdrawalRequests);
router.post("/verifyKyc", verifyKYC);
router.post("/approveKyc", approveBankWithdrawal);

module.exports = router;
