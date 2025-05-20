// const User = require("../model/user");
// // const sendEmail = require("./utils/sendEmail"); // Your existing email utility

// // const MS_PER_DAY = 24 * 60 * 60 * 1000;

// // const checkAndNotifyPayments = async () => {
// //   try {
// //     const today = new Date();
// //     console.log(`🔎 [${today.toISOString()}] Starting payment expiry check...`);

// //     // Get users with paymentExpiry not null
// //     const users = await User.find({
// //       paymentExpiry: { $ne: null },
// //     });

// //     console.log(`👥 Found ${users.length} users with paymentExpiry set.`);

// //     for (const user of users) {
// //       try {
// //         const expiry = new Date(user.paymentExpiry);
// //         const diffDays = Math.ceil((expiry - today) / MS_PER_DAY);

// //         console.log(`📅 User ${user._id} - expires in ${diffDays} day(s)`);

// //         // If expired (expiry date < today)
// //         if (expiry < today) {
// //           if (user.paymentVerified) {
// //             // Set paymentVerified false
// //             await User.findByIdAndUpdate(user._id, { paymentVerified: false });
// //             console.log(
// //               `❌ User ${user._id} payment expired, paymentVerified set to false.`
// //             );

// //             // Notify user about expiration
// //             await sendEmail({
// //               to: user.email,
// //               subject: "❗ Payment Expired",
// //               text: `Hello ${
// //                 user.name
// //               },\nYour payment expired on ${expiry.toDateString()}. Please renew to continue services.`,
// //             });
// //             console.log(
// //               `📧 Notified user ${user._id} about payment expiration.`
// //             );
// //           } else {
// //             console.log(
// //               `ℹ️ User ${user._id} payment already marked unverified.`
// //             );
// //           }
// //           continue; // skip to next user after handling expiry
// //         }

// //         // Notify at specific days before expiry
// //         if ([15, 7, 3, 2, 1].includes(diffDays)) {
// //           await sendEmail({
// //             to: user.email,
// //             subject: `⏳ Payment Expiry Reminder - ${diffDays} day(s) left`,
// //             text: `Hello ${
// //               user.name
// //             },\nYour payment will expire on ${expiry.toDateString()}.\nPlease renew within ${diffDays} day(s) to avoid service interruption.`,
// //           });
// //           console.log(
// //             `🔔 Sent expiry reminder to user ${user._id} (${diffDays} days left)`
// //           );
// //         } else {
// //           console.log(`⏳ No notification needed for user ${user._id} today.`);
// //         }
// //       } catch (userErr) {
// //         console.error(
// //           `❌ Error processing user ${user._id}: ${userErr.message}`
// //         );
// //         continue; // skip this user on error, continue loop
// //       }
// //     }

// //     console.log("✅ Payment expiry check completed.");
// //   } catch (err) {
// //     console.error(`💥 Fatal error in payment expiry check: ${err.message}`);
// //   }
// // };

// // module.exports = checkAndNotifyPayments;
// const resetAllUsersRequests = async () => {
//   try {
//     const users = await User.find({}, "_id"); // Get only _id to reduce memory

//     console.log(`🔍 Found ${users.length} users. Starting reset...`);

//     let successCount = 0;
//     let failCount = 0;

//     for (const user of users) {
//       try {
//         await User.updateOne(
//           { _id: user._id },
//           {
//             $unset: {
//               sended_requests: "",
//               received_requests: "",
//             },
//           }
//           //   {
//           //     $set: {
//           //       sended_requests: [],
//           //       received_requests: [],
//           //       userAverageRating: 0,
//           //       providerAverageRating: 0,
//           //       providerRatings: [],
//           //       userRatings: [],
//           //       notifications: [],
//           //     },
//           //   }
//         );

//         console.log(`✅ Reset done for user: ${user._id}`);
//         successCount++;
//       } catch (err) {
//         console.error(`❌ Error resetting user ${user._id}:`, err.message);
//         failCount++;
//       }
//     }

//     console.log(
//       `🎯 Reset finished. Success: ${successCount}, Failed: ${failCount}`
//     );
//   } catch (error) {
//     console.error(
//       "🔥 Critical failure during user reset process:",
//       error.message
//     );
//   }
// };

// module.exports = resetAllUsersRequests;