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

const CreateOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).send({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const options = {
      amount: Number(amount) * 100, // Convert to paise
      currency: "INR", // In CreateOrder
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    try {
      const order = await razorpayInstance.orders.create(options);
      console.log("[INFO] Order created:", order);

      const paymentLinkRequest = {
        amount: order.amount,
        currency: "INR",
        accept_partial: false,
        description: "Registration Payment",
        customer: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9876543210",
        },
        notify: {
          sms: true,
          email: true,
        },
        reminder_enable: true,
      };

      // const paymentLink = await razorpayInstance.paymentLink.create(
      //   paymentLinkRequest
      // );
      const paymentLink = await razorpayInstance.paymentLink.create(
        paymentLinkRequest
      );

      console.log("[INFO] Payment link created:", paymentLink);

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
        details: error.description || error.error?.description,
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

const verifyPayment = async (req, res) => {
  try {
    const { payment_id, user_id } = req.body;
    if (!payment_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Payment ID and User ID are required",
      });
    }

    //     const paymentDetails = await razorpayInstance.payments.fetch(payment_id);
    const paymentDetails = await razorpayInstance.payments.fetch(payment_id);

    // 🔹 If payment is authorized but not captured, capture it
    if (paymentDetails.status === "authorized") {
      console.log("[INFO] Payment authorized, capturing...");
      await razorpayInstance.payments.capture(
        payment_id,
        paymentDetails.amount
      );
    }

    // Fetch updated payment details after capturing
    const updatedPayment = await razorpayInstance.payments.fetch(payment_id);

    // 🔴 If payment is still not captured, return error
    if (updatedPayment.status !== "captured") {
      return res.status(400).json({
        success: false,
        message: "Payment capture failed, please try again",
      });
    }

    // 🔹 Payment is now verified, update user payment history
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const updatedUser = await UserModel.findByIdAndUpdate(
      user_id,
      {
        paymentVerified: true,
        paymentExpiry: expiryDate,
        $push: {
          paymentHistory: {
            paymentId: updatedPayment.id,
            // orderId: order_id,
            amount: updatedPayment.amount / 100, // Convert from paise to INR
            currency: updatedPayment.currency,
            status: updatedPayment.status,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to update user payment status",
      });
    }

    // Distribute referral rewards only after successful payment
    if (updatedUser.referredBy.length > 0) {
      console.log("[INFO] 🔄 User referred by:", updatedUser.referredBy[0]);
      await distributeReferralRewards(
        updatedUser._id,
        updatedUser.referredBy[0]
      );
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and stored successfully",
      user: updatedUser,
    });
  } catch (error) {
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
    console.log("🔍 Capturing payment:", paymentId, userId);
    if (!paymentId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID and User ID are required",
      });
    }

    // Fetch payment details
    const paymentDetails = await razorpayInstance.payments.fetch(paymentId);

    if (paymentDetails.status !== "authorized") {
      console.log("❌ Payment is not in authorized state");
      return res.status(400).json({
        success: false,
        message: "Payment is not in authorized state",
      });
    }

    // Capture the payment
    await razorpayInstance.payments.capture(paymentId, paymentDetails.amount);

    // Update the user's payment history
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId, "paymentHistory.paymentId": paymentId },
      {
        $set: {
          "paymentHistory.$.status": "captured",
        },
      },
      { new: true }
    );

    await distributeReferralRewards(userId, updatedUser.referredBy[0]);

    return res.status(200).json({
      success: true,
      message: "Payment captured successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error capturing payment",
      error: error.message,
    });
  }
};

const verifyCapturedPayment = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(`🔍 Checking payment status for user: ${userId}`);

    // Fetch user details
    const user = await UserModel.findById(userId);
    if (!user) {
      console.log(`❌ User not found: ${userId}`);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log(`✅ User found: ${user.name} (${user.email})`);

    // Check if user has any payments
    if (!user.paymentHistory || user.paymentHistory.length === 0) {
      console.log("⚠️ No payment history found.");
      return res
        .status(400)
        .json({ success: false, message: "No payment history found" });
    }

    let paymentVerified = false;

    // Loop through paymentHistory and verify each payment
    for (let payment of user.paymentHistory) {
      console.log(
        `🔄 Checking payment ID: ${payment.paymentId} (Current status: ${payment.status})`
      );

      if (payment.status !== "captured") {
        try {
          const razorpayResponse = await axios.get(
            `https://api.razorpay.com/v1/payments/${payment.paymentId}`,
            {
              auth: {
                username: process.env.RAZORPAY_KEY_ID,
                password: process.env.RAZORPAY_KEY_SECRET,
              },
            }
          );

          const paymentStatus = razorpayResponse.data.status;
          console.log(
            `💳 Razorpay Response: Payment ${
              payment.paymentId
            } is ${paymentStatus.toUpperCase()}`
          );

          if (paymentStatus === "captured") {
            payment.status = "captured"; // Update status in paymentHistory
            paymentVerified = true; // Mark payment as verified
            console.log(`✅ Payment ${payment.paymentId} captured!`);
          }
        } catch (error) {
          console.error(
            `❌ Error verifying payment ${payment.paymentId}:`,
            error.message
          );
        }
      } else {
        console.log(`⚡ Payment ${payment.paymentId} already captured.`);
      }
    }

    // If any payment was captured, update user
    if (paymentVerified) {
      user.paymentVerified = true;
      await user.save();

      console.log(
        `🎉 Payment verified! User ${userId} is now marked as verified.`
      );

      await distributeReferralRewards(userId, user.referredBy[0]);
    } else {
      console.log("❌ No new captured payments found.");
    }

    return res.json({
      success: true,
      message: paymentVerified
        ? "✅ Payment verified and updated"
        : "⚠️ No captured payments found",
      user,
    });
  } catch (error) {
    console.error("🔥 Error verifying payment:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  CreateOrder,
  verifyPayment,
  distributeReferralRewards,
  generateGstInvoice,
  capturePayment,
  verifyCapturedPayment,
};
