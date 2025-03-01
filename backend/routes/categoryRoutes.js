const express = require("express");
const router = express.Router();
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const sharp = require("sharp");
const Readable  = require("stream").Readable;
const {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
} = require("../controllers/categoryController");

cloudinary.config({
  cloud_name: "dcfm0aowt",
  api_key: "576798684156725",
  api_secret: "bhhXx57-OdaxvDdZOwaUKNvBXOA",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "category",
    allowed_formats: ["jpg", "png", "jpeg" , "webp"],
    transformation: [
      {
        crop: "fill",
        gravity: "center",
        quality: "auto:best", // Automatically optimizes quality while maintaining visual fidelity
      },
    ],
  },
});

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     let chunks = [];

//     // Convert stream to buffer
//     for await (const chunk of file.stream) {
//       chunks.push(chunk);
//     }
//     const fileBuffer = Buffer.concat(chunks);

//     // ✅ Ensure buffer is not empty
//     if (!fileBuffer || fileBuffer.length === 0) {
//       throw new Error("Empty file buffer");
//     }

//     const fileFormat = file.mimetype.split("/")[1]; // Get format dynamically
//     let quality = 60; // Start compression at 60%
//     let sharpInstance = sharp(fileBuffer).resize({ width: 800 });

//     // Apply format-specific compression
//     if (fileFormat === "jpeg" || fileFormat === "jpg") {
//       sharpInstance = sharpInstance.jpeg({ quality });
//     } else if (fileFormat === "png") {
//       sharpInstance = sharpInstance.png({ quality });
//     } else if (fileFormat === "webp") {
//       sharpInstance = sharpInstance.webp({ quality });
//     }

//     let compressedBuffer = await sharpInstance.toBuffer();

//     // Reduce quality if image is >2MB
//     while (compressedBuffer.length > 2 * 1024 * 1024 && quality > 30) {
//       quality -= 5;
//       sharpInstance = sharp(fileBuffer).resize({ width: 800 });

//       if (fileFormat === "jpeg" || fileFormat === "jpg") {
//         sharpInstance = sharpInstance.jpeg({ quality });
//       } else if (fileFormat === "png") {
//         sharpInstance = sharpInstance.png({ quality });
//       } else if (fileFormat === "webp") {
//         sharpInstance = sharpInstance.webp({ quality });
//       }

//       compressedBuffer = await sharpInstance.toBuffer();
//     }

//     // ✅ Ensure compressed buffer is not empty before uploading
//     if (!compressedBuffer || compressedBuffer.length === 0) {
//       throw new Error("Compressed file buffer is empty");
//     }

//     return {
//       folder: "category",
//       format: fileFormat, // Preserve original format
//       transformation: [{ quality: "auto:best" }], // Cloudinary auto-optimization
//     };
//   },
// });




// Multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB pre-upload limit
});

router.post("/addCategory", upload.single("category"), addCategory);
router.post("/updateCategory", upload.single("categoryImg"), updateCategory);
router.delete("/deleteCategory", deleteCategory);
router.get("/getAllCategory", getAllCategory);

module.exports = router;
