const Banner = require("../model/banner");
const cloudinary = require("cloudinary").v2;
const Category = require("../model/category");
const User = require("../model/user");

const getPublicIdFromUrl = (url) => {
  const regex = /\/(?:v\d+\/)?([^\/]+)\/([^\/]+)\.[a-z]+$/;
  const match = url.match(regex);
  if (match) {
    return `${match[1]}/${match[2]}`; // captures the folder and file name without versioning or extension
  }
  return null;
};

const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body; // Extract category name from the request body
    const imageUrl = req.file.path; // Extract uploaded image URL from Cloudinary

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
      image: imageUrl,
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
const updateCategory = async (req, res) => {
  try {
    const { categorId, categoryName } = req.body;
    const category = await Category.findById(categorId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    // Extract Cloudinary public ID from the image URL
    const getPublicIdFromUrl = (imageUrl) => {
      if (!imageUrl) return null;
      const parts = imageUrl.split("/");
      return parts.slice(-1)[0].split(".")[0]; // Extract public ID (removes extension)
    };

    let imageUrl = category.image; // Keep existing image if no new one is uploaded

    if (req.file) {
      // Validate file type
      if (
        !["image/jpeg", "image/png", "image/webp"].includes(req.file.mimetype)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid file format. Only JPG, PNG, and WEBP are allowed.",
        });
      }

      // Delete old image if it exists
      if (imageUrl) {
        const publicId = getPublicIdFromUrl(imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      imageUrl = req.file.path; // Update with new image
    }

    category.image = imageUrl; // Ensure it matches the database field
    const oldCategoryName = category.categoryName
    category.categoryName = categoryName;
    await category.save();


    // **Update `businessCategory` in User model**
    await User.updateMany(
      { businessCategory: oldCategoryName }, // Find users with old category
      { $set: { "businessCategory.$": categoryName } } // Update only the matched category
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ success: false, message: `Multer error: ${error.message}` });
    }
    console.log("Error updating category:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    console.log(req.body);

    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "category not found" });
    }
    if (category.image) {
      const publicId = getPublicIdFromUrl(category.image);
      if (publicId) {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary deletion result:", result);
      } else {
        console.log(
          "Could not extract publicId from image URL:",
          category.image
        );
      }
    }
    await Category.findByIdAndDelete(categoryId);

    res
      .status(200)
      .json({ success: true, message: "category deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
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
