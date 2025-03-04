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

// const distributeReferralRewards = async (newUserId, referrerId, session) => {
//   console.log("[INFO] 💰 Distributing referral earnings...");

//   const earningsDistribution = [20, 20, 15, 10]; // Rewards per referral level
//   let currentReferrer = referrerId;
//   let level = 0;

//   try {
//     while (currentReferrer && level < earningsDistribution.length) {
//       const earningAmount = earningsDistribution[level];

//       console.log(
//         `[INFO] 💵 Level ${level + 1} - Giving ₹${earningAmount} to ${currentReferrer}`
//       );

//       const updateResult = await UserModel.updateOne(
//         { _id: currentReferrer },
//         {
//           $inc: { earnings: earningAmount, walletBalance: earningAmount },
//           $push: {
//             earningsHistory: {
//               amount: earningAmount,
//               sourceUser: newUserId,
//               type: "Referral Bonus",
//               date: new Date(),
//               level: level + 1,
//             },
//           },
//         },
//         { session } // Ensure transaction safety
//       );

//       // If update fails, rollback and throw error
//       if (updateResult.modifiedCount === 0) {
//         throw new Error(`Failed to update rewards for user ${currentReferrer}`);
//       }

//       // Move to the next referrer (if exists)
//       const referrerData = await UserModel.findById(currentReferrer)
//         .select("referredBy")
//         .session(session);
//       currentReferrer = referrerData?.referredBy?.[0] || null;
//       level++;
//     }

//     console.log("[INFO] ✅ Referral earnings distributed!");
//   } catch (error) {
//     console.error("[ERROR] ❌ Failed to distribute rewards:", error.message);
//     throw error; // Ensures transaction rollback in `setReferral`
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

    const paymentDetails = await razorpayInstance.payments.fetch(payment_id);
    if (
      !paymentDetails ||
      (paymentDetails.status !== "authorized" &&
        paymentDetails.status !== "captured")
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment failed or not yet captured",
      });
    }

    if (paymentDetails.status === "authorized") {
      await razorpayInstance.payments.capture(
        payment_id,
        paymentDetails.amount
      );
    }

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const updatedUser = await UserModel.findByIdAndUpdate(
      user_id,
      { paymentVerified: true, paymentExpiry: expiryDate },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to update user payment status",
      });
    }

    // Distribute rewards only after payment is verified
    if (updatedUser.referredBy.length > 0) {
      console.log("[INFO] 🔄 User referred by:", updatedUser.referredBy[0]);

      await distributeReferralRewards(
        updatedUser._id,
        updatedUser.referredBy[0]
      );
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified, referral updated",
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
// **GST Calculation**
// const calculateGST = (amount) => {
//   const gst = amount * 0.18;
//   return {
//     totalGST: gst.toFixed(2),
//     cgst: (gst / 2).toFixed(2), // CGST 9%
//     sgst: (gst / 2).toFixed(2), // SGST 9%
//   };
// };
// const generateUserReport = async (req, res) => {
//   try {
//     console.log("🚀 [START] Generating PDF Report...");

//     const { userId } = req.body;
//     if (!userId) {
//       console.log("❌ [ERROR] User ID is missing.");
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     console.log("🛠️ Fetching payment history from Razorpay...");
//     const payments = await razorpayInstance.payments.all({
//       customer_id: userId,
//     });
//     if (!payments.items.length) {
//       console.log("⚠️ No transactions found for this user.");
//       return res.status(404).json({ message: "No payments found" });
//     }

//     console.log("📄 Creating PDF document...");
//     const doc = new PDFDocument({ margin: 50 });
//     const fileName = `user_${userId}_report.pdf`;
//     res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
//     res.setHeader("Content-Type", "application/pdf");
//     doc.pipe(res);

//     // Header Section
//     doc.fontSize(20).text("Payment Report", { align: "center" }).moveDown(0.5);
//     doc
//       .fontSize(14)
//       .text(`User ID: ${userId}`, { align: "center" })
//       .moveDown(1);
//     doc.moveDown(0.5);

//     // Table Headers
//     const tableHeaders = [
//       "Transaction ID",
//       "Amount",
//       "GST",
//       "CGST",
//       "SGST",
//       "Status",
//       "Date",
//     ];
//     const columnWidths = [110, 70, 50, 50, 50, 70, 120];
//     doc.fontSize(12).fillColor("black");

//     let startX = 50;
//     let startY = doc.y;
//     tableHeaders.forEach((header, i) => {
//       doc.text(header, startX, startY, {
//         width: columnWidths[i],
//         align: "center",
//       });
//       startX += columnWidths[i];
//     });

//     doc.moveDown(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();

//     // Adding Transaction Data
//    capturedPayments.items.forEach((txn) => {
//       const { totalGST, cgst, sgst } = calculateGST(txn.amount / 100);
//       let rowX = 50;
//       let rowY = doc.y + 5;
//       const rowData = [
//         txn.id,
//         (txn.amount / 100).toFixed(2),
//         totalGST,
//         cgst,
//         sgst,
//         txn.status,
//         new Date(txn.created_at * 1000).toLocaleString(),
//       ];

//       rowData.forEach((data, i) => {
//         doc.text(data.toString(), rowX, rowY, {
//           width: columnWidths[i],
//           align: "center",
//         });
//         rowX += columnWidths[i];
//       });
//       doc.moveDown(0.5);
//     });

//     // Footer Section
//     doc.moveDown(2);
//     doc
//       .fontSize(10)
//       .fillColor("gray")
//       .text("Generated on: " + new Date().toLocaleString(), 50, doc.y, {
//         align: "right",
//       });

//     console.log("✅ [SUCCESS] PDF report generated and sent to client.");
//     doc.end();
//   } catch (error) {
//     console.error("❌ [ERROR] Failed to generate report:", error);
//     res.status(500).json({ message: "Failed to generate report" });
//   }
// };

const generateGstInvoice = async (req, res) => {
  try {
    console.log("🚀 Fetching Payment Details from Razorpay...");

    const { year, month, startDate, endDate } = req.body;
    if (!year) return res.status(400).json({ message: "Year is required" });

    let query = { created_at: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } };
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

    const capturedPayments = payments.items.filter(payment => payment.status === "captured");
    console.log(capturedPayments);


    if (!payments.items.length) {
      return res.status(404).json({ message: "No payments found" });
    }

    console.log("📄 Creating GST Invoice PDF..." );
    const doc = new PDFDocument({ margin: 10, size: "A4" });
    const fileName = `GST_Invoices_${year}_${month || "All"}.pdf`;

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

doc.fontSize(20).text("GST Invoices", { align: "center" }).moveDown();

// **Table Headers**
const headers = [
  "Sr No", "Date", "Client Name", "City", "State", "Taxable Amt",
  "CGST", "SGST", "IGST", "Total Amt"
];
const columnWidths = [40, 70, 50, 50, 50, 50, 40, 40, 40, 60];

let startX = 50;
let startY = 150;

// **Draw Table Header**
doc.fillColor("gray").rect(startX, startY - 0, 500, 40).fill();
doc.fillColor("white").fontSize(10);
headers.forEach((header, i) => {
  doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), startY + 12, { 
    width: columnWidths[i], align: "center" 
  });
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
    index + 1, paymentDate, clientName, city, state , formattedTaxableAmount, `${cgst}`, `${sgst}`, `${igst}`, formattedAmount
  ];

  let rowX = startX;
    
  // **Apply Row Background First**
  doc.fillColor(index % 2 !== 0 ? "#f0f0f0" : "white")
     .rect(startX, startY - 6, 500, 25)
     .fill();

  doc.fillColor("black"); // Reset text color

  rowData.forEach((data, i) => {
    doc.text(data.toString(), rowX, startY, { width: columnWidths[i], align: "center" });
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


module.exports = {
  CreateOrder,
  verifyPayment,
  distributeReferralRewards,
  generateGstInvoice,
};
