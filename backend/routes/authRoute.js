const express = require("express");
const User = require("../model/user");
const {
  registerUser,
  loginUser,
  registerUserweb,
  loginUserweb,
  getalluser,
  getUser,
  logout,
  getAdmin,
  updateProfile,
  deleteUser,
  UpdateUser,
  updateRoleByEmail,
  setUserStatus,
  approveUser,
  updateProfileMobile,
  getUserMobile,
  setUserStatusMobile,
  forgotPassword,
  verifyCode,
  resetPassword,
  getUserById,
} = require("../controllers/authController");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { verifyToken, isAdmin } = require("../middleware/auth");
const { sendNotification } = require("../controllers/sendController");
const {
  getUsersByBCategory,
  updateUserAddressAndAadhar,
  setReferral,
  updateProfilePic,
  getPaymentVerifiedUser,
  fixedPaymentHistory,
  getPendingeKYCs,
  resetekyc,
} = require("../controllers/AuthController2");
const router = express.Router();

cloudinary.config({
  cloud_name: "dcfm0aowt",
  api_key: "576798684156725",
  api_secret: "bhhXx57-OdaxvDdZOwaUKNvBXOA",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [
      {
        width: 1024, // Restrict max width
        height: 1024, // Restrict max height
        crop: "limit", // No upscaling or stretching
        quality: "auto:eco", // Compressed but retains good quality
        fetch_format: "auto", // Converts to WebP/AVIF for best compression
      },
    ],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // Set max file size to 1.5MB
});

router.post(
  "/registerUser",
  upload.fields([
    { name: "frontAadhar", maxCount: 1 },
    { name: "backAadhar", maxCount: 1 },
    { name: "profilePic", maxCount: 1 },
  ]),
  registerUser
);
router.post("/loginUser", loginUser);
router.post(
  "/registerUserweb",
  upload.fields([
    { name: "frontAadhar", maxCount: 1 },
    { name: "backAadhar", maxCount: 1 },
    { name: "profilePic", maxCount: 1 },
  ]),

  registerUserweb
);
router.post("/loginUserweb", loginUserweb);
router.put("/approveUser", approveUser);

router.post(
  "/updateProfile",
  verifyToken,
  upload.fields([
    { name: "profilePic", maxCount: 1 }, // Profile picture
    { name: "frontAadhar", maxCount: 1 }, // Aadhar front image
    { name: "backAadhar", maxCount: 1 }, // Aadhar back image
  ]),
  (req, res, next) => {
    console.log(req.files); // Check if file is received
    console.log(req.file); // Check other form fields
    try {
      // Attach the file paths to the request body if files are uploaded
      if (req.files) {
        req.body.profilePic = req.files.profilePic
          ? req.files.profilePic[0].path
          : null;
        req.body.frontAadhar = req.files.frontAadhar
          ? req.files.frontAadhar[0].path
          : null;
        req.body.backAadhar = req.files.backAadhar
          ? req.files.backAadhar[0].path
          : null;
      }

      updateProfile(req, res, next); // Proceed with the profile update logic
    } catch (error) {
      next(error); // Pass the error to the error handler
    }
  }
);

router.post("/updateProfileMobile", updateProfileMobile);
router.delete("/deleteUser", deleteUser);
router.put("/UpdateUser", UpdateUser);
router.get("/getAdmin", isAdmin, getAdmin);
router.get("/getAllUser", getalluser);
router.get("/getUser", verifyToken, getUser);
router.get("/getUserById/:id", getUserById);
router.get("/getUserMobile", getUserMobile);
router.get("/logout", logout);
router.put("/setUserStatus", verifyToken, setUserStatus);
router.put("/setUserStatusMobile", setUserStatusMobile);
router.put("/updateRoleByEmail", updateRoleByEmail);
router.post("/getUsersByBCategory", getUsersByBCategory);

router.post("/reset-ekyc", resetekyc);

// forgotpassword and reset password apis
router.post("/forgot-password", forgotPassword);
router.post("/verify-code", verifyCode);
router.post("/reset-password", resetPassword);
router.post("/setReferral", setReferral);

// Route to update permanent address and Aadhar number
router.put("/updateUserAddressAndAadhar", updateUserAddressAndAadhar);
router.put("/update-profile-pic", updateProfilePic);
router.get("/paidusers", isAdmin, getPaymentVerifiedUser);
router.get("/ekyc-pending", isAdmin, getPendingeKYCs);
router.get("/fix-payment-history", fixedPaymentHistory);

module.exports = router;
