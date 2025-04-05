// require("dotenv").config();
// const AWS = require("aws-sdk");
// const mongoose = require("mongoose");
// const axios = require("axios");
// const path = require("path");
// const User = require("../model/user"); // Adjust path to your User model

// // AWS S3 Configuration 🌍
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const BUCKET_NAME = "ees121-images"; // Change to your bucket name

// // Connect to MongoDB 🔗
// mongoose.connect(process.env.MongoDB, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const migrateImages = async () => {
//   try {
//     console.log("🚀 Migration started...");

//     const users = await User.find(); // Fetch all users
//     console.log(`👥 Found ${users.length} users`);

//     let bulkOps = []; // Store bulk update operations
//     let uploadedUsersCount = 0; // Track successfully migrated users
//     let skippedUsersCount = 0; // Track users who were skipped

//     for (let user of users) {
//       let updatedFields = {}; // Store new S3 URLs

//       console.log(`\n🔍 Checking user: ${user.name} (ID: ${user._id})`);

//       // Only migrating frontAadhar, backAadhar, and profilePic
//       const imagesToMigrate = {
//         frontAadhar: user.frontAadhar,
//         backAadhar: user.backAadhar,
//         profilePic: user.profilePic,
//       };

//       // Check if user already has all images migrated
//       const alreadyUploaded = Object.values(imagesToMigrate).every(
//         (url) => url && url.includes("s3.ap-south-1.amazonaws.com")
//       );

//       if (alreadyUploaded) {
//         console.log(`✅ User ${user.name} already migrated. Skipping...`);
//         skippedUsersCount++;
//         continue;
//       }

//       // Upload only missing images
//       for (let [key, imageUrl] of Object.entries(imagesToMigrate)) {
//         if (!imageUrl || imageUrl.includes("s3.ap-south-1.amazonaws.com")) {
//           console.log(
//             `⚠️ Skipping ${key}, already uploaded or no image found.`
//           );
//           continue;
//         }

//         console.log(`📥 Downloading ${key} for ${user.name}...`);
//         try {
//           const imageData = await axios({
//             url: imageUrl,
//             responseType: "arraybuffer",
//           });

//           const fileName = `${user._id}/${key}${path.extname(imageUrl)}`;
//           const params = {
//             Bucket: BUCKET_NAME,
//             Key: fileName,
//             Body: Buffer.from(imageData.data),
//             ContentType: "image/jpeg",
//             ACL: "private",
//           };

//           console.log(`☁️ Uploading ${key} for ${user.name} to S3...`);
//           const uploadResult = await s3.upload(params).promise();

//           console.log(`✅ Uploaded ${key}: ${uploadResult.Location}`);
//           updatedFields[key] = uploadResult.Location;
//         } catch (error) {
//           if (error.response && error.response.status === 404) {
//             console.log(
//               `⚠️ Skipping ${key} for ${user.name} (Image not found)`
//             );
//           } else {
//             console.log(
//               `❌ Error downloading/uploading ${key} for ${user.name}:`,
//               error.message
//             );
//           }
//         }
//       }

//       // If at least one field was updated, add to bulk update array
//       if (Object.keys(updatedFields).length > 0) {
//         bulkOps.push({
//           updateOne: {
//             filter: { _id: user._id },
//             update: { $set: updatedFields },
//           },
//         });
//         uploadedUsersCount++; // Increment counter for successfully migrated users
//       }

//       // To avoid memory overload, update in batches of 10
//       if (bulkOps.length >= 10) {
//         await User.bulkWrite(bulkOps);
//         console.log(`🔥 Updated MongoDB for 10 users`);
//         bulkOps = []; // Reset bulkOps
//       }
//     }

//     // Update remaining records if any
//     if (bulkOps.length > 0) {
//       await User.bulkWrite(bulkOps);
//       console.log(`🎯 Final batch update complete!`);
//     }

//     console.log(`🎉 Migration complete!`);
//     console.log(`✅ Successfully migrated: ${uploadedUsersCount} users`);
//     console.log(`⏭️ Skipped (already migrated): ${skippedUsersCount} users`);
//     mongoose.disconnect();
//   } catch (error) {
//     console.error("❌ Migration failed:", error);
//   }
// };

// // Run the migration script
// migrateImages();
// const mongoose = require("mongoose");
// const axios = require("axios");
// const AWS = require("aws-sdk");
// const sharp = require("sharp");
// const Category = require("../model/category"); // adjust path if needed
// require("dotenv").config();

// mongoose.connect(
//   "mongodb+srv://rajivmsurati11:rajivmsurati11@cluster0.p9hso.mongodb.net/EES-121_App",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const uploadToS3 = async (buffer, fileName) => {
//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `category/${fileName}`,
//     Body: buffer,
//     ContentType: "image/jpeg",
//   };
//   const data = await s3.upload(params).promise();
//   return data.Location;
// };

// const isCloudinaryUrl = (url) =>
//   typeof url === "string" &&
//   (url.includes("res.cloudinary.com") || url.startsWith("http"));

// const migrateImages = async () => {
//   try {
//     const categories = await Category.find();
//     console.log(`📦 Total Categories Found: ${categories.length}`);

//     let migratedCount = 0;
//     let skippedCount = 0;

//     for (const category of categories) {
//       const cloudinaryUrl = category.image;

//       if (!isCloudinaryUrl(cloudinaryUrl)) {
//         console.log(
//           `⚠️ Skipping ${category.categoryName}: No valid Cloudinary image`
//         );
//         skippedCount++;
//         continue;
//       }

//       try {
//         const response = await axios.get(cloudinaryUrl, {
//           responseType: "arraybuffer",
//         });

//         const compressedBuffer = await sharp(response.data)
//           .resize({ width: 800 }) // adjust as needed
//           .jpeg({ quality: 70 })
//           .toBuffer();

//         const fileName = `${category._id}.jpg`;
//         const s3Url = await uploadToS3(compressedBuffer, fileName);

//         category.image = s3Url;
//         await category.save();

//         console.log(`✅ Migrated: ${category.categoryName}`);
//         migratedCount++;
//       } catch (err) {
//         console.log(
//           `❌ Failed to migrate ${category.categoryName}:`,
//           err.message
//         );
//         skippedCount++;
//       }
//     }

//     console.log(`\n🎯 Migration Complete`);
//     console.log(`✅ Migrated: ${migratedCount}`);
//     console.log(`⏭️ Skipped: ${skippedCount}`);
//     console.log(`📦 Total Processed: ${categories.length}`);

//     process.exit();
//   } catch (error) {
//     console.error("🔥 Migration error:", error);
//     process.exit(1);
//   }
// };

// migrateImages();
