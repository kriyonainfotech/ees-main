// const express = require("express");
// const router = express.Router();
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
// const sharp = require("sharp");
// const Readable  = require("stream").Readable;
// const {
//   addCategory,
//   updateCategory,
//   deleteCategory,
//   getAllCategory,
// } = require("../controllers/categoryController");

// cloudinary.config({
//   cloud_name: "dcfm0aowt",
//   api_key: "576798684156725",
//   api_secret: "bhhXx57-OdaxvDdZOwaUKNvBXOA",
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "category",
//     allowed_formats: ["jpg", "png", "jpeg" , "webp"],
//     transformation: [
//       {
//         crop: "fill",
//         gravity: "center",
//         quality: "auto:best", // Automatically optimizes quality while maintaining visual fidelity
//       },
//     ],
//   },
// });

// // const storage = new CloudinaryStorage({
// //   cloudinary: cloudinary,
// //   params: async (req, file) => {
// //     let chunks = [];

// //     // Convert stream to buffer
// //     for await (const chunk of file.stream) {
// //       chunks.push(chunk);
// //     }
// //     const fileBuffer = Buffer.concat(chunks);

// //     // ✅ Ensure buffer is not empty
// //     if (!fileBuffer || fileBuffer.length === 0) {
// //       throw new Error("Empty file buffer");
// //     }

// //     const fileFormat = file.mimetype.split("/")[1]; // Get format dynamically
// //     let quality = 60; // Start compression at 60%
// //     let sharpInstance = sharp(fileBuffer).resize({ width: 800 });

// //     // Apply format-specific compression
// //     if (fileFormat === "jpeg" || fileFormat === "jpg") {
// //       sharpInstance = sharpInstance.jpeg({ quality });
// //     } else if (fileFormat === "png") {
// //       sharpInstance = sharpInstance.png({ quality });
// //     } else if (fileFormat === "webp") {
// //       sharpInstance = sharpInstance.webp({ quality });
// //     }

// //     let compressedBuffer = await sharpInstance.toBuffer();

// //     // Reduce quality if image is >2MB
// //     while (compressedBuffer.length > 2 * 1024 * 1024 && quality > 30) {
// //       quality -= 5;
// //       sharpInstance = sharp(fileBuffer).resize({ width: 800 });

// //       if (fileFormat === "jpeg" || fileFormat === "jpg") {
// //         sharpInstance = sharpInstance.jpeg({ quality });
// //       } else if (fileFormat === "png") {
// //         sharpInstance = sharpInstance.png({ quality });
// //       } else if (fileFormat === "webp") {
// //         sharpInstance = sharpInstance.webp({ quality });
// //       }

// //       compressedBuffer = await sharpInstance.toBuffer();
// //     }

// //     // ✅ Ensure compressed buffer is not empty before uploading
// //     if (!compressedBuffer || compressedBuffer.length === 0) {
// //       throw new Error("Compressed file buffer is empty");
// //     }

// //     return {
// //       folder: "category",
// //       format: fileFormat, // Preserve original format
// //       transformation: [{ quality: "auto:best" }], // Cloudinary auto-optimization
// //     };
// //   },
// // });

// // Multer upload middleware
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB pre-upload limit
// });

// router.post("/addCategory", upload.single("category"), addCategory);
// router.post("/updateCategory", upload.single("categoryImg"), updateCategory);
// router.delete("/deleteCategory", deleteCategory);
// router.get("/getAllCategory", getAllCategory);

// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const AWS = require("aws-sdk");
const {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
} = require("../controllers/categoryController");

// AWS config
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer middleware (to memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 7 * 1024 * 1024 }, // 5MB
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum allowed size is 5MB.",
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
};

// Image compression + S3 upload
const uploadCompressedImageToS3 = async (fileBuffer, fileName) => {
  let quality = 60;
  let compressedBuffer = await sharp(fileBuffer)
    .resize({ width: 800 })
    .jpeg({ quality })
    .toBuffer();

  // Compress till < 2MB
  while (compressedBuffer.length > 2 * 1024 * 1024 && quality > 30) {
    quality -= 5;
    compressedBuffer = await sharp(fileBuffer)
      .resize({ width: 800 })
      .jpeg({ quality })
      .toBuffer();
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `category/${Date.now()}-${fileName}`,
    Body: compressedBuffer,
    ContentType: "image/jpeg",
  };

  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location;
};

// Image processor middleware
const processCategoryImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded ❌" });
    }

    const imageUrl = await uploadCompressedImageToS3(
      req.file.buffer,
      req.file.originalname
    );
    req.body.image = imageUrl; // categorySchema uses `image`

    next();
  } catch (error) {
    console.error("🛑 Error in S3 upload:", error);
    return res.status(500).json({ message: "Image upload failed", error });
  }
};

// Routes
router.post(
  "/addCategory",
  upload.single("category"),
  handleMulterError,
  processCategoryImage,
  addCategory
);

router.post(
  "/updateCategory",
  upload.single("categoryImg"),
  handleMulterError,
  processCategoryImage,
  updateCategory
);

router.delete("/deleteCategory", deleteCategory);
router.get("/getAllCategory", getAllCategory);

module.exports = router;
