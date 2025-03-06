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

cloudinary.config({
  cloud_name: "dcfm0aowt",
  api_key: "576798684156725",
  api_secret: "bhhXx57-OdaxvDdZOwaUKNvBXOA",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ekyc",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [
      {
        width: 800, // Resize width to 800px (adjustable)
        crop: "limit", // Ensures the image doesn't exceed given dimensions
        gravity: "center",
        quality: "auto:eco", // Compresses while maintaining decent quality
      },
    ],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // Max file size: 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
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
