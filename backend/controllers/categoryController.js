const Banner = require("../model/banner");
const Category = require("../model/category");
const User = require("../model/user");
const AWS = require("aws-sdk");
const multer = require("multer");

// AWS S3 config
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const addCategory = async (req, res) => {
  try {
    const { categoryName, image } = req.body; // ✅ Use req.body.image now

    // Check if category already exists
    const existingCategory = await Category.findOne({ categoryName });

    if (existingCategory) {
      return res.status(400).send({
        success: false,
        message: "Category already exists",
      });
    }

    // Create a new category
    const category = new Category({
      categoryName,
      image, // ✅ This will now contain S3 URL
    });

    // Save category to the database
    await category.save();

    return res.status(201).send({
      success: true,
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while adding the category",
      error: error.message,
    });
  }
};

// const updateCategory = async (req, res) => {
//   try {
//     const { categorId, categoryName } = req.body;
//     const category = await Category.findById(categorId);
//     if (!category) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Category not found" });
//     }
//     // Extract Cloudinary public ID from the image URL
//     const getPublicIdFromUrl = (imageUrl) => {
//       if (!imageUrl) return null;
//       const parts = imageUrl.split("/");
//       return parts.slice(-1)[0].split(".")[0]; // Extract public ID (removes extension)
//     };

//     let imageUrl = category.image; // Keep existing image if no new one is uploaded

//     if (req.file) {
//       // Validate file type
//       if (
//         !["image/jpeg", "image/png", "image/webp"].includes(req.file.mimetype)
//       ) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid file format. Only JPG, PNG, and WEBP are allowed.",
//         });
//       }

//       // Delete old image if it exists
//       if (imageUrl) {
//         const publicId = getPublicIdFromUrl(imageUrl);
//         if (publicId) {
//           await cloudinary.uploader.destroy(publicId);
//         }
//       }

//       imageUrl = req.file.path; // Update with new image
//     }

//     category.image = imageUrl; // Ensure it matches the database field
//     const oldCategoryName = category.categoryName
//     category.categoryName = categoryName;
//     await category.save();

//     // **Update `businessCategory` in User model**
//     await User.updateMany(
//       { businessCategory: oldCategoryName }, // Find users with old category
//       { $set: { "businessCategory.$": categoryName } } // Update only the matched category
//     );

//     res.status(200).json({
//       success: true,
//       message: "Category updated successfully",
//       category,
//     });
//   } catch (error) {
//     if (error instanceof multer.MulterError) {
//       return res
//         .status(400)
//         .json({ success: false, message: `Multer error: ${error.message}` });
//     }
//     console.log("Error updating category:", error);
//     res.status(500).json({ success: false, message: "Server error", error });
//   }
// };

const updateCategory = async (req, res) => {
  try {
    const { categorId, categoryName } = req.body;

    console.log("📥 Request Body:", req.body);

    const category = await Category.findById(categorId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "❌ Category not found" });
    }

    let imageUrl = category.image;
    const oldCategoryName = category.categoryName;

    if (req.file) {
      // ✅ Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message:
            "❌ Invalid file format. Only JPG, PNG, and WEBP are allowed.",
        });
      }

      // ✅ Delete old image from S3 if it's from AWS
      if (imageUrl && imageUrl.includes("amazonaws.com")) {
        const key = new URL(imageUrl).pathname.substring(1); // ✅ safe key extract
        console.log("🗑️ Attempting to delete key:", key);

        if (key) {
          await s3
            .deleteObject({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: key,
            })
            .promise();
          console.log("✅ Old image deleted from S3");
        }
      }
       if (category.image && category.image.includes("amazonaws.com")) {
         const key = category.image.split(".amazonaws.com/")[1];
         if (key) {
           await s3
             .deleteObject({
               Bucket: process.env.AWS_BUCKET_NAME,
               Key: key,
             })
             .promise();
           console.log("Image deleted from S3:", key);
         } else {
           console.log("Image key not found in S3 URL:", category.image);
         }
       }

      // ✅ Get new compressed image from middleware
      if (req.body.image) {
        imageUrl = req.body.image;
        console.log("🆕 New compressed image from middleware:", imageUrl);
      } else {
        console.log("⚠️ Middleware didn't set image in req.body");
        return res.status(500).json({
          success: false,
          message: "❌ Image upload failed in middleware",
        });
      }
    }

    // ✅ Update category fields
    category.categoryName = categoryName;
    category.image = imageUrl;
    await category.save();
    console.log("✅ Category saved");

    // ✅ Update category name in User model
    await User.updateMany(
      { businessCategory: oldCategoryName },
      { $set: { "businessCategory.$": categoryName } }
    );
    console.log("🔄 User model businessCategory updated");

    res.status(200).json({
      success: true,
      message: "✅ Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("❗Error updating category:", error);
    const errorMessage =
      error instanceof multer.MulterError
        ? `Multer error: ${error.message}`
        : "Server error";
    res.status(500).json({ success: false, message: errorMessage, error });
  }
};

// const deleteCategory = async (req, res) => {
//   try {
//     const { categoryId } = req.body;
//     console.log(req.body);

//     const category = await Category.findById(categoryId);
//     if (!category) {
//       return res
//         .status(404)
//         .json({ success: false, message: "category not found" });
//     }
//     if (category.image) {
//       const publicId = getPublicIdFromUrl(category.image);
//       if (publicId) {
//         const result = await cloudinary.uploader.destroy(publicId);
//         console.log("Cloudinary deletion result:", result);
//       } else {
//         console.log(
//           "Could not extract publicId from image URL:",
//           category.image
//         );
//       }
//     }
//     await Category.findByIdAndDelete(categoryId);

//     res
//       .status(200)
//       .json({ success: true, message: "category deleted successfully" });
//   } catch (error) {
//     console.error("Error in deleteProduct:", error);
//     res.status(500).json({ success: false, message: "Server error", error });
//   }
// };

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (!categoryId) {
      return res
        .status(400)
        .json({ success: false, message: "Category ID is required" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // ✅ Delete image from S3 if it exists
    if (category.image && category.image.includes("amazonaws.com")) {
      const key = category.image.split(".amazonaws.com/")[1];
      if (key) {
        await s3
          .deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
          })
          .promise();
        console.log("Image deleted from S3:", key);
      } else {
        console.log("Image key not found in S3 URL:", category.image);
      }
    }

    // ✅ Delete category from DB
    await Category.findByIdAndDelete(categoryId);

    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      // Step 1: Sort by updated date to get the latest image for each category
      { $sort: { updatedAt: -1 } },

      // Step 2: Group by categoryName (case-insensitive)
      {
        $group: {
          _id: { categoryName: { $toLower: "$categoryName" } },
          originalId: { $first: "$_id" },
          categoryName: { $first: "$categoryName" },
          image: { $first: "$image" }, // ✅ Ensures the latest updated image is taken
        },
      },

      // Step 3: Sort categories alphabetically
      { $sort: { categoryName: 1 } },

      // Step 4: Project final structure
      {
        $project: {
          _id: "$originalId",
          categoryName: 1,
          image: 1,
        },
      },
    ]).collation({ locale: "en", strength: 2 }); // Case-insensitive sorting

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      category: categories,
    });
  } catch (error) {
    console.error("[ERROR] Failed to fetch categories:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
};
