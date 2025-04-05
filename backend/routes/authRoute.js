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
const { verifyToken, isAdmin } = require("../middleware/auth");
const { sendNotification } = require("../controllers/sendController");
const {
  getUsersByBCategory,
  updateUserAddressAndAadhar,
  setReferral,
  updateProfilePic,
  getPaymentVerifiedUser,
  resetUserImages,
  getPendingeKYCs,
  resetekyc,
  getUserCount,
} = require("../controllers/AuthController2");
const { downloadFunction } = require("../controllers/migrateImages");
const multer = require("multer");

const bucketName = process.env.AWS_BUCKET_NAME;

const router = express.Router();

// const upload = multer({
//   storage: multerS3({
//     s3: s3, // ✅ Use the updated S3Client
//     bucket: process.env.AWS_BUCKET_NAME,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: (req, file, cb) => {
//       cb(
//         null,
//         `user-images/${file.fieldname}_${Date.now()}_${file.originalname}`
//       );
//     },
//   }),
// });

// Use memory storage for buffer upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

router.post(
  "/uploadUserImages",
  upload.fields([
    { name: "frontAadhar", maxCount: 1 },
    { name: "backAadhar", maxCount: 1 },
    { name: "profilePic", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }

      // ✅ Find user and update images
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          frontAadhar: req.files.frontAadhar
            ? req.files.frontAadhar[0].location
            : "",
          backAadhar: req.files.backAadhar
            ? req.files.backAadhar[0].location
            : "",
          profilePic: req.files.profilePic
            ? req.files.profilePic[0].location
            : "",
        },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res.json({
        success: true,
        message: "Images uploaded successfully!",
        user: updatedUser,
      });
    } catch (error) {
      console.error("[ERROR] ❌ Image Upload Failed:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
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
router.post("/setUserStatusMobile", setUserStatusMobile);
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
router.get("/getUserCount", getUserCount);

router.post("/resetUserImages", resetUserImages);


module.exports = router;
