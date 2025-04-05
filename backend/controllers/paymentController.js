const Razorpay = require("razorpay");
const crypto = require("crypto");
const UserModel = require("../model/user");
const { sendNotification } = require("../controllers/sendController");
const axios = require("axios");
// const generateCSV = require("../config/generateCSV");
const PDFDocument = require("pdfkit");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("[INFO] Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("[INFO] Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET);

// const CreateOrder = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     if (!amount) {
//       return res.status(400).send({
//         success: false,
//         message: "Please fill all the fields",
//       });
//     }

//     const options = {
//       amount: Number(amount) * 100, // Convert to paise
//       currency: "INR", // In CreateOrder
//       receipt: crypto.randomBytes(10).toString("hex"),
//     };

//     try {
//       const order = await razorpayInstance.orders.create(options);
//       console.log("[INFO] Order created:", order);

//       const paymentLinkRequest = {
//         amount: order.amount,
//         currency: "INR",
//         accept_partial: false,
//         description: "Registration Payment",
//         customer: {
//           name: "Customer",
//           email: "customer@example.com",
//           contact: "9876543210",
//         },
//         notify: {
//           sms: true,
//           email: true,
//         },
//         reminder_enable: true,
//       };

//       // const paymentLink = await razorpayInstance.paymentLink.create(
//       //   paymentLinkRequest
//       // );
//       const paymentLink = await razorpayInstance.paymentLink.create(
//         paymentLinkRequest
//       );

//       console.log("[INFO] Payment link created:", paymentLink);

//       res.status(200).json({
//         success: true,
//         data: {
//           order,
//           payment_link: paymentLink.short_url,
//         },
//       });
//     } catch (error) {
//       console.error("[ERROR] Razorpay API error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Error creating payment",
//         error: error.message || "Unknown error",
//         details: error.description || error.error?.description,
//       });
//     }
//   } catch (error) {
//     console.error("[ERROR] Server error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

const CreateOrder = async (req, res) => {
  try {
    const { amount, user_id } = req.body; // Add user_id to request body

    if (!amount || !user_id) {
      return res.status(400).send({
        success: false,
        message: "Amount and User ID are required",
      });
    }

    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      payment_capture: 1, // Enable auto-capture
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    try {
      // Create Razorpay order
      const order = await razorpayInstance.orders.create(options);

      // Create payment link
      const paymentLink = await razorpayInstance.paymentLink.create({
        amount: order.amount,
        currency: "INR",
        accept_partial: false,
        description: "Registration Payment",
        customer: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9876543210",
        },
        notify: { sms: true, email: true },
        reminder_enable: true,
      });

      // Create initial payment history record
      await UserModel.findByIdAndUpdate(
        user_id,
        {
          $push: {
            paymentHistory: {
              orderId: order.id,
              amount: order.amount / 100,
              currency: order.currency,
              status: "created",
              paymentLink: paymentLink.short_url,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        data: {
          order,
          payment_link: paymentLink.short_url,
        },
      });
    } catch (error) {
      console.error("[ERROR] Razorpay API error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating payment",
        error: error.message || "Unknown error",
      });
    }
  } catch (error) {
    console.error("[ERROR] Server error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const distributeReferralRewards = async (newUserId, referrerId) => {
  console.log("[INFO] 💰 Distributing referral earnings...");
  const earningsDistribution = [20, 20, 15, 10]; // Rewards per referral level
  let currentReferrer = referrerId;
  let level = 0;

  while (currentReferrer && level < earningsDistribution.length) {
    const earningAmount = earningsDistribution[level];

    console.log(
      `[INFO] 💵 Level ${
        level + 1
      } - Giving ₹${earningAmount} to ${currentReferrer}`
    );

    await UserModel.updateOne(
      { _id: currentReferrer },
      {
        $inc: { earnings: earningAmount, walletBalance: earningAmount },
        $push: {
          earningsHistory: {
            amount: earningAmount,
            sourceUser: newUserId,
            type: "Referral Bonus",
            date: new Date(),
            level: level + 1,
          },
        },
      }
    );

    // 📢 Send notification only for Level 1 referrer
    if (level === 0) {
      const referrerData = await UserModel.findById(currentReferrer).select(
        "_id fcmToken"
      );
      if (referrerData?.fcmToken) {
        await sendNotification({
          type: "reward",
          senderName: "System",
          fcmToken: referrerData.fcmToken,
          title: "Referral Bonus Earned 🎉",
          message: `You earned ₹${earningAmount} for referring a new user!`,
          receiverId: referrerData._id,
        });
      }
    }

    // 📢 Send notification to all referrers (all levels)
    // const referrerData = await UserModel.findById(currentReferrer).select(
    //   "_id fcmToken"
    // );
    // if (referrerData?.fcmToken) {
    //   await sendNotification({
    //     senderName: "System",
    //     fcmToken: referrerData.fcmToken,
    //     title: "Referral Bonus Earned 🎉",
    //     message: `You earned ₹${earningAmount} from a referral at Level ${level + 1}!`,
    //     receiverId: referrerData._id,
    //   });
    // }

    // Move to the next referrer (if exists)
    const referrerData = await UserModel.findById(currentReferrer).select(
      "referredBy"
    );
    currentReferrer = referrerData?.referredBy?.[0] || null;
    level++;
  }

  console.log("[INFO] ✅ Referral earnings distributed!");
};

// const verifyPayment = async (req, res) => {
//   try {
//     const { payment_id, user_id } = req.body;
//     if (!payment_id || !user_id) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment ID and User ID are required",
//       });
//     }

//     const paymentDetails = await razorpayInstance.payments.fetch(payment_id);

//     // 🔹 If payment is authorized but not captured, capture it
//     if (paymentDetails.status === "authorized") {
//       console.log("[INFO] Payment authorized, attempting capture...");
//       try {
//         const captureResponse = await razorpayInstance.payments.capture(
//           payment_id,
//           (paymentDetails.amount / 100).toFixed(2)
//         );
//         console.log("[SUCCESS] Payment captured:", captureResponse);
//       } catch (captureError) {
//         console.error("[ERROR] Payment capture failed:", captureError);
//       }
//     }

//     // Fetch updated payment details after capturing
//     const updatedPayment = await razorpayInstance.payments.fetch(payment_id);

//     // 🔴 If payment is still not captured, return error
//     if (updatedPayment.status !== "captured") {
//       return res.status(400).json({
//         success: false,
//         message: "Payment capture failed, please try again",
//       });
//     }

//     // 🔹 Payment is now verified, update user & distribute rewards
//     const expiryDate = new Date();
//     expiryDate.setFullYear(expiryDate.getFullYear() + 1);

//     // if (
//     //   !paymentDetails ||
//     //   (paymentDetails.status !== "authorized" &&
//     //     paymentDetails.status !== "captured")
//     // ) {
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: "Payment failed or not yet captured",
//     //   });
//     // }

//     // if (paymentDetails.status === "authorized") {
//     //   await razorpayInstance.payments.capture(
//     //     payment_id,
//     //     paymentDetails.amount
//     //   );
//     // }

//     // const expiryDate = new Date();
//     // expiryDate.setFullYear(expiryDate.getFullYear() + 1);

//     if (updatedPayment.status === "captured") {
//       // ✅ Update user only after capture is confirmed
//       const updatedUser = await UserModel.findByIdAndUpdate(
//         user_id,
//         { paymentVerified: true, paymentExpiry: expiryDate },
//         { new: true }
//       );
//     }

//     if (!updatedUser) {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to update user payment status",
//       });
//     }

//     // Distribute rewards only after payment is verified
//     if (updatedUser.referredBy.length > 0) {
//       console.log("[INFO] 🔄 User referred by:", updatedUser.referredBy[0]);

//       await distributeReferralRewards(
//         updatedUser._id,
//         updatedUser.referredBy[0]
//       );
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Payment verified, referral updated",
//       user: updatedUser,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error verifying payment",
//       error: error.message,
//     });
//   }
// };

// const verifyPayment = async (req, res) => {
//   try {
//     const { payment_id, user_id } = req.body;
//     if (!payment_id || !user_id) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment ID and User ID are required",
//       });
//     }

//     //     const paymentDetails = await razorpayInstance.payments.fetch(payment_id);
//     const paymentDetails = await razorpayInstance.payments.fetch(payment_id);

//     // 🔹 If payment is authorized but not captured, capture it
//     if (paymentDetails.status === "authorized") {
//       console.log("[INFO] Payment authorized, capturing...");
//       await razorpayInstance.payments.capture(
//         payment_id,
//         paymentDetails.amount
//       );
//     }

//     // Fetch updated payment details after capturing
//     const updatedPayment = await razorpayInstance.payments.fetch(payment_id);

//     // 🔴 If payment is still not captured, return error
//     if (updatedPayment.status !== "captured") {
//       return res.status(400).json({
//         success: false,
//         message: "Payment capture failed, please try again",
//       });
//     }

//     // 🔹 Payment is now verified, update user payment history
//     const expiryDate = new Date();
//     expiryDate.setFullYear(expiryDate.getFullYear() + 1);

//     const updatedUser = await UserModel.findByIdAndUpdate(
//       user_id,
//       {
//         paymentVerified: true,
//         paymentExpiry: expiryDate,
//         $push: {
//           paymentHistory: {
//             paymentId: updatedPayment.id,
//             // orderId: order_id,
//             amount: updatedPayment.amount / 100, // Convert from paise to INR
//             currency: updatedPayment.currency,
//             status: updatedPayment.status,
//             createdAt: new Date(),
//           },
//         },
//       },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to update user payment status",
//       });
//     }

//     // Distribute referral rewards only after successful payment
//     if (updatedUser.referredBy.length > 0) {
//       console.log("[INFO] 🔄 User referred by:", updatedUser.referredBy[0]);
//       await distributeReferralRewards(
//         updatedUser._id,
//         updatedUser.referredBy[0]
//       );
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Payment verified and stored successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error verifying payment",
//       error: error.message,
//     });
//   }
// };

// const verifyPayment = async (req, res) => {
//   try {
//     const { payment_id, user_id } = req.body;

//     if (!payment_id || !user_id) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment ID and User ID are required",
//       });
//     }

//     const paymentDetails = await razorpayInstance.payments.fetch(payment_id);
//     const orderId = paymentDetails.order_id; // Get associated order ID

//     if (!orderId) {
//       return res.status(400).json({
//         success: false,
//         message: "Order ID not found in payment details",
//       });
//     }

//     console.log(`🔍 Payment Details:`, paymentDetails);


//     // Update payment history with payment ID and status
//     const updateResult = await UserModel.updateOne(
//       {
//         _id: user_id,
//         "paymentHistory.orderId": orderId,
//       },
//       {
//         $set: {
//           "paymentHistory.$.paymentId": payment_id,
//           "paymentHistory.$.status": paymentDetails.status,
//           "paymentHistory.$.updatedAt": new Date(),
//         },
//       }
//     );

//     if (updateResult.matchedCount === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Order not found in payment history",
//       });
//     }

//     // Handle failed payments
//     if (paymentDetails.status === "failed") {
//       return res.status(400).json({
//         success: false,
//         message: "Payment failed",
//         error: paymentDetails.error_description,
//       });
//     }

//     // Handle authorized but not captured (manual capture scenario)
//     if (paymentDetails.status === "authorized") {
//       await razorpayInstance.payments.capture(
//         payment_id,
//         paymentDetails.amount
//       );
//     }

//     // Final status update
//     const updatedPayment = await razorpayInstance.payments.fetch(payment_id);
//     await UserModel.updateOne(
//       { _id: user_id, "paymentHistory.orderId": orderId },
//       {
//         $set: {
//           "paymentHistory.$.status": updatedPayment.status,
//           "paymentHistory.$.updatedAt": new Date(),
//         },
//       }
//     );

//     // Update user status and handle referrals
//     const expiryDate = new Date();
//     expiryDate.setFullYear(expiryDate.getFullYear() + 1);

//     const updatedUser = await UserModel.findByIdAndUpdate(
//       user_id,
//       {
//         paymentVerified: true,
//         paymentExpiry: expiryDate,
//       },
//       { new: true }
//     );

//     if (updatedUser.referredBy.length > 0) {
//       await distributeReferralRewards(
//         updatedUser._id,
//         updatedUser.referredBy[0]
//       );
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Payment verified and updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.error("[ERROR] Payment verification error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error verifying payment",
//       error: error.message,
//     });
//   }
// };

const verifyPayment = async (req, res) => {
  try {
    const { payment_id, user_id } = req.body;

    if (!payment_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Payment ID and User ID are required",
      });
    }

    // Fetch payment details from Razorpay
    const paymentDetails = await razorpayInstance.payments.fetch(payment_id);
    const orderId = paymentDetails.order_id; // Get associated order ID

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID not found in payment details",
      });
    }

    console.log(`🔍 Payment Details:`, paymentDetails);

    // If payment is "authorized", capture it manually
    if (paymentDetails.status === "authorized") {
      await razorpayInstance.payments.capture(
        payment_id,
        paymentDetails.amount
      );
    }

    // Fetch latest payment details after capture
    const updatedPayment = await razorpayInstance.payments.fetch(payment_id);

    console.log(`✅ Updated Payment Details:`, updatedPayment);

    // Update payment history with paymentId and new status
    const updateResult = await UserModel.updateOne(
      {
        _id: user_id,
        "paymentHistory.orderId": orderId,
      },
      {
        $set: {
          "paymentHistory.$.paymentId": payment_id, // ✅ Payment ID update
          "paymentHistory.$.status": updatedPayment.status, // ✅ Update status
          "paymentHistory.$.updatedAt": new Date(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Order not found in payment history",
      });
    }

    // If payment failed, return error response
    if (updatedPayment.status === "failed") {
      return res.status(400).json({
        success: false,
        message: "Payment failed",
        error: updatedPayment.error_description,
      });
    }

    // ✅ Update user payment status
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const updatedUser = await UserModel.findByIdAndUpdate(
      user_id,
      {
        paymentVerified: true,
        paymentExpiry: expiryDate,
      },
      { new: true }
    );

    console.log(`✅ User Updated:`, updatedUser);

    return res.status(200).json({
      success: true,
      message: "Payment verified and updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("[ERROR] Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
};


const generateGstInvoice = async (req, res) => {
  try {
    console.log("🚀 Fetching Payment Details from Razorpay...");

    const { year, month, startDate, endDate } = req.body;
    if (!year) return res.status(400).json({ message: "Year is required" });

    let query = {
      created_at: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    };
    if (month) {
      const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
      query.created_at.$gte = new Date(`${year}-${monthIndex + 1}-01`);
      query.created_at.$lte = new Date(`${year}-${monthIndex + 1}-31`);
    }
    if (startDate && endDate) {
      query.created_at.$gte = new Date(startDate);
      query.created_at.$lte = new Date(endDate);
    }

    // Fetch payment data from Razorpay
    const payments = await razorpayInstance.payments.all({ count: 25 }); // Fetch 25 records

    const capturedPayments = payments.items.filter(
      (payment) => payment.status === "captured"
    );
    console.log(capturedPayments);

    if (!payments.items.length) {
      return res.status(404).json({ message: "No payments found" });
    }

    console.log("📄 Creating GST Invoice PDF...");
    const doc = new PDFDocument({ margin: 10, size: "A4" });
    const fileName = `GST_Invoices_${year}_${month || "All"}.pdf`;

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    doc.fontSize(20).text("GST Invoices", { align: "center" }).moveDown();

    // **Table Headers**
    const headers = [
      "Sr No",
      "Date",
      "Client Name",
      "City",
      "State",
      "Taxable Amt",
      "CGST",
      "SGST",
      "IGST",
      "Total Amt",
    ];
    const columnWidths = [40, 70, 50, 50, 50, 50, 40, 40, 40, 60];

    let startX = 50;
    let startY = 150;

    // **Draw Table Header**
    doc
      .fillColor("gray")
      .rect(startX, startY - 0, 500, 40)
      .fill();
    doc.fillColor("white").fontSize(10);
    headers.forEach((header, i) => {
      doc.text(
        header,
        startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
        startY + 12,
        {
          width: columnWidths[i],
          align: "center",
        }
      );
    });
    startY += 50;

    // **Processing Each Payment**
    for (const [index, txn] of capturedPayments.entries()) {
      const paymentDate = new Date(txn.created_at * 1000).toLocaleDateString();
      let phone = txn.contact.replace("+91", "").trim(); // Remove +91 if present

      // **Find User from UserModel**
      const user = await UserModel.findOne({ phone });
      const clientName = user ? user.name : "N/A"; // Use found name or N/A
      const city = user ? user.address.city : "N/A";
      const state = user ? user.address.state : "N/A";
      const amount = Number(txn.amount) / 100; // Convert to number safely
      const gst = 18;
      // Extract base price from total amount
      const basePrice = amount / (1 + gst / 100);

      // Calculate GST amount
      const totalGst = amount - basePrice;

      // CGST and SGST split equally
      const cgst = parseFloat((totalGst / 2).toFixed(2));
      const sgst = parseFloat((totalGst / 2).toFixed(2));

      const igst = 0;

      const formatCurrency = (value) => `₹${parseFloat(value).toFixed(2)}`;

      const taxableAmount = (amount * 100) / (100 + gst);
      const formattedTaxableAmount = formatCurrency(taxableAmount);
      const formattedAmount = formatCurrency(amount);
      const rowData = [
        index + 1,
        paymentDate,
        clientName,
        city,
        state,
        formattedTaxableAmount,
        `${cgst}`,
        `${sgst}`,
        `${igst}`,
        formattedAmount,
      ];

      let rowX = startX;

      // **Apply Row Background First**
      doc
        .fillColor(index % 2 !== 0 ? "#f0f0f0" : "white")
        .rect(startX, startY - 6, 500, 25)
        .fill();

      doc.fillColor("black"); // Reset text color

      rowData.forEach((data, i) => {
        doc.text(data.toString(), rowX, startY, {
          width: columnWidths[i],
          align: "center",
        });
        rowX += columnWidths[i];
      });

      startY += 25;
    }

    console.log("✅ GST Invoice PDF Generated Successfully");
    doc.end();
  } catch (error) {
    console.error("❌ Error Generating Invoices:", error);
    res.status(500).json({ message: "Failed to generate invoices" });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, userId } = req.body;

    // Validate input
    if (!paymentId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID and User ID are required",
      });
    }

    // 1. Fetch payment details from Razorpay
    const paymentDetails = await razorpayInstance.payments.fetch(paymentId);

    // Validate payment state
    if (paymentDetails.status !== "authorized") {
      return res.status(400).json({
        success: false,
        message: `Payment cannot be captured. Current status: ${paymentDetails.status}`,
      });
    }

    // 2. Capture the payment
    const capturedPayment = await razorpayInstance.payments.capture(
      paymentId,
      paymentDetails.amount
    );

    // 3. Update payment history and user status
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const updateResult = await UserModel.findOneAndUpdate(
      {
        _id: userId,
        "paymentHistory.paymentId": paymentId,
        "paymentHistory.status": "authorized", // Ensure we're updating correct record
      },
      {
        $set: {
          "paymentHistory.$.status": "captured",
          "paymentHistory.$.updatedAt": new Date(),
          paymentVerified: true,
          paymentExpiry: expiryDate,
        },
      },
      { new: true }
    );

    if (!updateResult) {
      return res.status(404).json({
        success: false,
        message: "User or payment record not found",
      });
    }

    // 4. Distribute referrals only if applicable
    if (updateResult.referredBy?.length > 0) {
      await distributeReferralRewards(
        updateResult._id, // newUserId
        updateResult.referredBy[0] // referrerId
      );
    }

    // 5. Verify final state
    const finalPaymentState = await razorpayInstance.payments.fetch(paymentId);

    return res.status(200).json({
      success: true,
      message: "Payment captured and verified",
      data: {
        razorpayStatus: finalPaymentState.status,
        userStatus: updateResult.paymentVerified,
        expiryDate: updateResult.paymentExpiry,
      },
    });
  } catch (error) {
    console.error("[PAYMENT CAPTURE ERROR]", error);

    // Handle specific Razorpay errors
    const errorMessage = error.error?.description || error.message;

    return res.status(error.statusCode || 500).json({
      success: false,
      message: "Capture failed",
      error: errorMessage,
      resolution: "Please check payment authorization window (max 1 day)",
    });
  }
};

const verifyCapturedPayment = async (req, res) => {
  try {
    const { paymentId, userId } = req.body;
    console.log(`🔍 Checking payment status for user: ${req.body}`);

    // Fetch user details
    const user = await UserModel.findById(userId);
    if (!user) {
      console.log(`❌ User not found: ${userId}`);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log(`✅ User found: ${user.name} (${user.phone})`);

    // If paymentHistory is empty, fetch from Razorpay API using the phone number
    if (!user.paymentHistory || user.paymentHistory.length === 0) {
      console.log("⚠️ No payment history found. Fetching from Razorpay...");

      try {
        const razorpayResponse = await axios.get(
          `https://api.razorpay.com/v1/payments/${paymentId}`,
          {
            auth: {
              username: process.env.RAZORPAY_KEY_ID,
              password: process.env.RAZORPAY_KEY_SECRET,
            },
          }
        );

        const payment = razorpayResponse.data; // ✅ Correct: Directly use the response object

        console.log(
          "🔍 Razorpay API Response:",
          JSON.stringify(payment, null, 2)
        );

        if (!payment || !payment.id) {
          console.log("❌ No payments found for this payment ID.");
          return res
            .status(400)
            .json({ success: false, message: "No payment history found" });
        }

        // Update user's payment history
        user.paymentHistory = [
          {
            paymentId: payment.id,
            amount: payment.amount / 100, // Convert to INR
            status: payment.status,
            date: new Date(payment.created_at * 1000), // Convert timestamp to date
            method: payment.method,
            vpa: payment.upi ? payment.upi.vpa : null, // UPI details if available
            email: payment.email,
            contact: payment.contact,
          },
        ];

        await user.save();
        console.log("✅ Payment history updated from Razorpay.");
      } catch (error) {
        console.log(
          "❌ Error fetching payment history from Razorpay:",
          error.message
        );
        return res.status(500).json({ success: false, message: error });
      }
    }

    let paymentVerified = false;

    // Loop through paymentHistory and verify each payment
    for (let payment of user.paymentHistory) {
      console.log(
        `🔄 Checking payment ID: ${paymentId} (Current status: ${payment.status})`
      );

      if (payment.status !== "captured") {
        try {
          const paymentDetails = await axios.get(
            `https://api.razorpay.com/v1/payments/${paymentId}`,
            {
              auth: {
                username: process.env.RAZORPAY_KEY_ID,
                password: process.env.RAZORPAY_KEY_SECRET,
              },
            }
          );

          const paymentStatus = paymentDetails.data.status;
          console.log(
            `💳 Razorpay Response: Payment ${paymentId} is ${paymentStatus.toUpperCase()}`
          );

          if (paymentStatus === "captured") {
            payment.status = "captured"; // Update status in paymentHistory
            paymentVerified = true; // Mark payment as verified
            console.log(`✅ Payment ${paymentId} captured!`);
          }
        } catch (error) {
          console.log(
            `❌ Error verifying payment ${paymentId}:`,
            error.message
          );
        }
      } else {
        console.log(`⚡ Payment ${paymentId} already captured.`);
      }
    }

    // If any payment was captured, update user
    user.paymentVerified = true;
    await user.save();

    console.log(
      `🎉 Payment verified! User ${userId} is now marked as verified.`,
      user
    );

    // await distributeReferralRewards(userId, user.referredBy[0]);

    return res.json({
      success: true,
      message: paymentVerified
        ? "✅ Payment verified and updated"
        : "✅ Payment verified and updated !!!!",
      user,
    });
  } catch (error) {
    console.log("🔥 Error verifying payment:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const paymentVerifeid = async (req, res) => {
  try {
    const { userId } = req.body;

    // Update only the paymentVerified field
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { paymentVerified: true } }, // Only updating this field
      { new: true } // Return updated document
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Payment verified", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  CreateOrder,
  verifyPayment,
  distributeReferralRewards,
  generateGstInvoice,
  capturePayment,
  verifyCapturedPayment,
  paymentVerifeid,
};
