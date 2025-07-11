// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const sharp = require("sharp");
// const cloudinary = require("cloudinary").v2;
// const {
//   addbanner,
//   getUserByBanner,
//   updateBanner,
//   deleteBanner,
//   getAllBanners,
//   getBanners,
//   addBannerMobile,
//   updateBannerMobile,
//   getUserByBannerMobile,
//   getUserBannerMobile,
//   deleteBannerMobile,
// } = require("../controllers/bannerController");
// const { verifyToken } = require("../middleware/auth");

// cloudinary.config({
//   cloud_name: "dcfm0aowt",
//   api_key: "576798684156725",
//   api_secret: "bhhXx57-OdaxvDdZOwaUKNvBXOA",
// });

// // Use memory storage for processing
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 2.5 * 1024 * 1024 }, // 5MB limit
// });

// // Function to compress & upload image
// const uploadImage = async (fileBuffer) => {
//   try {
//     let quality = 60; // Start with 60% quality
//     let compressedBuffer = await sharp(fileBuffer)
//       .resize({ width: 800 }) // Resize width
//       .jpeg({ quality }) // Compress image
//       .toBuffer();

//     // Ensure size is under 2MB, reduce quality if needed
//     while (compressedBuffer.length > 2 * 1024 * 1024 && quality > 30) {
//       quality -= 5; // Decrease quality step by step
//       compressedBuffer = await sharp(fileBuffer)
//         .resize({ width: 800 })
//         .jpeg({ quality })
//         .toBuffer();
//     }

//     return new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         { folder: "banner", resource_type: "image" },
//         (error, result) => {
//           if (error) return reject(error);
//           resolve(result.secure_url);
//         }
//       );
//       uploadStream.end(compressedBuffer);
//     });
//   } catch (error) {
//     console.error("Image Upload Error:", error);
//     throw error;
//   }
// };

// // Middleware to process image before uploading
// const processImage = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Compress & upload to Cloudinary
//     const imageUrl = await uploadImage(req.file.buffer);
//     if (!imageUrl) {
//       return res.status(500).json({ message: "Image upload failed" });
//     }

//     req.body.imageUrl = imageUrl; // Ensure imageUrl is in the request body

//     next();
//   } catch (error) {
//     return res.status(500).json({ message: "Image processing failed", error });
//   }
// };

// // Routes
// router.post(
//   "/addBanner",
//   verifyToken,
//   upload.single("banner"),
//   processImage,
//   addbanner
// );
// router.post(
//   "/addBannerMobile",
//   upload.single("banner"),
//   processImage,
//   addBannerMobile
// );
// router.get("/getUserByBanner/:bannerId", getUserByBanner);
// router.post(
//   "/updateBanner",
//   verifyToken,
//   upload.single("banner"),
//   processImage,
//   updateBanner
// );
// router.post(
//   "/updateBannerMobile",
//   upload.single("banner"),
//   processImage,
//   updateBannerMobile
// );
// router.delete("/deleteBanner", verifyToken, deleteBanner);
// router.delete("/deleteBannerMobile", deleteBannerMobile);
// router.get("/getBanners", verifyToken, getBanners);
// router.post("/getUserBannerMobile", getUserBannerMobile);
// router.post("/getUserByBannerMobile", getUserByBannerMobile);
// router.get("/getAllBanners", getAllBanners);
// router.post("/getAllBannersMobile", getAllBanners);

// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const AWS = require("aws-sdk");
require("dotenv").config();

const {
  addbanner,
  getUserByBanner,
  updateBanner,
  deleteBanner,
  getAllBanners,
  getBanners,
  addBannerMobile,
  updateBannerMobile,
  getUserByBannerMobile,
  getUserBannerMobile,
  deleteBannerMobile,
} = require("../controllers/bannerController");
const { verifyToken } = require("../middleware/auth");

// AWS Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer config
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2.5 * 1024 * 1024 },
});

// Upload image to S3
// Update this function in bannerRoute.js
const uploadImageToS3 = async (fileBuffer, fileName, userId) => {
  let quality = 60;
  let compressedBuffer = await sharp(fileBuffer)
    .resize({ width: 800 })
    .jpeg({ quality })
    .toBuffer();

  while (compressedBuffer.length > 2 * 1024 * 1024 && quality > 30) {
    quality -= 5;
    compressedBuffer = await sharp(fileBuffer)
      .resize({ width: 800 })
      .jpeg({ quality })
      .toBuffer();
  }

  const newFileName = `${userId}-${fileName}`; // ✅ userId prefix
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `banner/${newFileName}`,
    Body: compressedBuffer,
    ContentType: "image/jpeg",
  };

  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location;
};

// Middleware to process image
const processImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ Get userId from req.user (web) or req.body (mobile)
    const userId = req.user?.id || req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const imageUrl = await uploadImageToS3(
      req.file.buffer,
      req.file.originalname,
      userId // ✅ Pass to function
    );

    req.body.imageUrl = imageUrl;
    next();
  } catch (error) {
    console.error("Error uploading to AWS S3:", error);
    return res.status(500).json({ message: "Image processing failed", error });
  }
};

// Routes
router.post(
  "/addBanner",
  verifyToken,
  upload.single("banner"),
  processImage,
  addbanner
);
router.post(
  "/addBannerMobile",
  upload.single("banner"),
  processImage,
  addBannerMobile
);
router.get("/getUserByBanner/:bannerId", getUserByBanner);
router.post(
  "/updateBanner",
  verifyToken,
  upload.single("banner"),
  processImage,
  updateBanner
);
router.post(
  "/updateBannerMobile",
  upload.single("banner"),
  processImage,
  updateBannerMobile
);
router.delete("/deleteBanner", verifyToken, deleteBanner);
router.delete("/deleteBannerMobile", deleteBannerMobile);
router.get("/getBanners", verifyToken, getBanners);
router.post("/getUserBannerMobile", getUserBannerMobile);
router.post("/getUserByBannerMobile", getUserByBannerMobile);
router.get("/getAllBanners", getAllBanners);
router.post("/getAllBannersMobile", getAllBanners);

module.exports = router;
