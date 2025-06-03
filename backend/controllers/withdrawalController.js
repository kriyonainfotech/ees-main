const Withdrawal = require("../model/withdrawal");
const KYC = require("../model/kyc");
const UserModel = require("../model/user");
const Razorpay = require("razorpay");
const axios = require("axios");
const { uploadToS3 } = require("../services/ekycService"); // utility that compress + uploads to S3

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const addekyc = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bankAccountNumber, accountHolderName, ifscCode, upiId, amount, useruniqueId } =
      req.body;

    console.log("🛠️ adding ekyc for user:", req.body);

    const files = req.files;

    const getFileUrl = async (fieldName, label) => {
      if (files?.[fieldName]?.[0]) {
        const file = files[fieldName][0];
        return await uploadToS3(file.buffer, file.originalname, "ekyc", useruniqueId, label);
      }
      return null;
    };

    // Upload all files to S3
    const panCardfront = await getFileUrl("panCardfront", "panfront");
    const panCardback = await getFileUrl("panCardback", "panback");
    const bankProof = await getFileUrl("bankProof", "bankproof");
    // const frontAadhar = await getFileUrl("frontAadhar", "aadharfront");
    // const backAadhar = await getFileUrl("backAadhar", "aadharback");

    console.log("📂 Uploaded files:", {
      panCardfront,
      panCardback,
      bankProof,
      // frontAadhar,
      // backAadhar,
    });

    // Validations
    if (!panCardfront || !panCardback || !bankProof) {
      return res.status(400).json({
        message: "Both panCardfront, panCardback and bankProof are required.",
      });
    }

    if (!upiId && (!bankAccountNumber || !ifscCode || !accountHolderName)) {
      return res
        .status(400)
        .json({ message: "Either UPI ID or bank details must be provided." });
    }

    if (ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid IFSC code. It must be 11 characters long.",
      });
    }

    // Check for existing KYC
    const existingKYC = await KYC.findOne({ userId });
    if (existingKYC) {
      return res
        .status(400)
        .json({ message: "KYC details already submitted." });
    }

    // Create new KYC document
    const newKYC = new KYC({
      userId,
      bankAccountNumber: bankAccountNumber || null,
      accountHolderName: accountHolderName || null,
      ifscCode: ifscCode || null,
      upiId: upiId || null,
      panCardfront,
      panCardback,
      bankProof,
      amount,
    });

    await newKYC.save();
    console.log("✅ New KYC saved with ID:", newKYC._id);

    // Update user with ekyc and aadhar images
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // await UserModel.findByIdAndUpdate(userId, {
    //   ...(user.ekyc ? {} : { ekyc: newKYC._id }),
    //   frontAadhar: frontAadhar || user.frontAadhar,
    //   backAadhar: backAadhar || user.backAadhar,
    // });
    await UserModel.findByIdAndUpdate(userId, {
      ekyc: newKYC._id,
    });

    console.log("✅ User updated with ekyc.");

    res.status(201).send({
      message: "Withdrawal request submitted successfully.",
      kyc: newKYC,
    });
  } catch (error) {
    console.log("❌ Server Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};

// const addekyc = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { bankAccountNumber, accountHolderName, ifscCode, upiId, amount } =
//       req.body;

//     console.log("🛠️ Processing withdrawal request for user:", userId);

//     // Extract files from request
//     const panCardfront = req.files?.panCardfront?.[0]?.path; // File URL
//     const panCardback = req.files?.panCardback?.[0]?.path; // File URL
//     const bankProof = req.files?.bankProof?.[0]?.path; // File URL
//     const frontAadhar = req.files?.frontAadhar?.[0]?.path;
//     const backAadhar = req.files?.backAadhar?.[0]?.path;

//     console.log("📂 Uploaded files:");
//     console.log("➡️ PAN Front:", panCardfront);
//     console.log("➡️ PAN Back:", panCardback);
//     console.log("➡️ Bank Proof:", bankProof);
//     console.log("➡️ Aadhar Front:", frontAadhar);
//     console.log("➡️ Aadhar Back:", backAadhar);

//     if (!panCardfront || !panCardback || !bankProof) {
//       console.log("❌ Missing required files!");
//       return res.status(400).json({
//         message: "Both panCardfront, panCardback and bankProof are required.",
//       });
//     }

//     // Ensure either UPI ID or bank details are provided
//     if (!upiId && (!bankAccountNumber || !ifscCode || !accountHolderName)) {
//       console.log("❌ Missing payment details!");
//       return res
//         .status(400)
//         .json({ message: "Either UPI ID or bank details must be provided." });
//     }

//     if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid IFSC code. It must be 11 characters long.",
//       });
//     }

//     // if (amount < 120) {
//     //   return res
//     //     .status(400)
//     //     .json({ message: "Minimum withdrawal amount is ₹120." });
//     // }

//     // Check if KYC already exists for the user
//     let existingKYC = await KYC.findOne({ userId });
//     if (existingKYC) {
//       console.log("❌ KYC already exists for this user!");
//       return res
//         .status(400)
//         .json({ message: "KYC details already submitted." });
//     }

//     // Save new KYC details with withdrawal amount
//     console.log("🛠️ Creating new KYC document...");
//     const newKYC = new KYC({
//       userId,
//       bankAccountNumber: bankAccountNumber || null,
//       accountHolderName: accountHolderName || null,
//       ifscCode: ifscCode || null,
//       upiId: upiId || null,
//       panCardback,
//       panCardfront,
//       bankProof,
//       amount,
//     });

//     await newKYC.save();
//     console.log("✅ New KYC saved with ID:", newKYC._id);

//     // Fetch user document
//     let user = await UserModel.findById(userId);
//     if (!user) {
//       console.log("❌ User not found!");
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Check if ekyc field exists in UserModel, if not, add it
//     if (!user.ekyc) {
//       console.log("🛠️ Adding ekyc field to user...");
//       await UserModel.findByIdAndUpdate(userId, { ekyc: newKYC._id });
//       console.log("✅ ekyc field added and linked to KYC ID:", newKYC._id);
//     } else {
//       console.log("✅ ekyc field already exists in user document.");
//     }

//     // Update Aadhar photos in UserModel
//     await UserModel.findByIdAndUpdate(userId, {
//       frontAadhar: frontAadhar || user.frontAadhar,
//       backAadhar: backAadhar || user.backAadhar,
//     });
//     console.log("✅ Aadhar photos updated in UserModel");

//     res.status(201).send({
//       message: "Withdrawal request submitted successfully.",
//       kyc: newKYC,
//     });
//   } catch (error) {
//     console.log("❌ Server Error:", error);
//     res.status(500).json({ message: "Server error. Try again later." });
//   }
// };

const submitWithdrawalRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, upiId } = req.body;

    console.log("📝 New withdrawal request received:", { userId, amount, upiId });

    if (!amount) {
      console.log("⚠️ Missing amount in request.");
      return res.status(400).json({ message: "Amount is required." });
    }

    // Fetch user's KYC
    console.log("🔍 Checking KYC for user:", userId);
    const userKYC = await KYC.findOne({ userId });

    if (!userKYC) {
      console.log("❌ KYC not found for user:", userId);
      return res.status(400).json({ message: "KYC not found. Please complete eKYC first." });
    }

    console.log("✅ KYC verified. Proceeding with withdrawal request.");

    const newWithdrawal = new Withdrawal({
      user: userId,
      kyc: userKYC._id,
      amount,
      status: "pending",
      payoutId: null,
      processedAt: null,
    });

    await newWithdrawal.save();
    console.log("💰 Withdrawal request saved successfully:", newWithdrawal);

    res.status(200).send({ message: "Withdrawal request submitted successfully.", withdrawal: newWithdrawal });
  } catch (error) {
    console.log("❌ Server Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
}

const getWithdrawalRequests = async (req, res) => {
  // try {
  // Fetch withdrawal requests and count
  //   const withdrawals = await KYC.find().populate("userId", "name phone");
  //   const count = await KYC.countDocuments();

  //   res.status(200).json({
  //     success: true,
  //     message: "Withdrawal requests fetched successfully.",
  //     count,
  //     withdrawals,
  //   });
  // } catch (error) {
  //   console.error("❌ Error fetching withdrawals:", error);
  //   res.status(500).json({
  //     success: false,
  //     message: "Server error. Try again later.",
  //     error: error.message,
  //   });
  // }

  try {
    console.log("📥 Fetching all withdrawal requests...");

    const withdrawals = await Withdrawal.find()
      .populate("user", "name phone")
      .populate("kyc") // Populating KYC details
      .sort({ createdAt: -1 });

    const totalWithdrawals = await Withdrawal.countDocuments();
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: "pending" });

    console.log(`✅ Total: ${totalWithdrawals}, Pending: ${pendingWithdrawals}`);

    res.status(200).json({
      success: true,
      message: "All withdrawal requests fetched successfully.",
      totalWithdrawals,
      count: pendingWithdrawals,
      withdrawals,
    });
  } catch (error) {
    console.log("❌ Server Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};

const verifyKYC = async (req, res) => {
  try {
    const { kycId } = req.body;

    // 1️⃣ Find KYC Record
    const kyc = await KYC.findById(kycId);
    if (!kyc) return res.status(404).json({ message: "KYC record not found." });

    // 2️⃣ Check if already approved
    if (kyc.status === "approved") {
      return res.status(400).json({ message: "KYC is already approved." });
    }

    // 3️⃣ Update KYC Status to Approved
    kyc.status = "approved";
    await kyc.save();

    // 4️⃣ Notify User (Optional)
    // sendNotification(kyc.user, "Your KYC has been approved! You can now withdraw funds.");

    res
      .status(200)
      .send({ success: true, message: "KYC approved successfully!" });
  } catch (error) {
    console.error("KYC Approval Error:", error);
    res.status(500).json({
      message: "Failed to approve KYC.",
      error: error.message,
    });
  }
};

const processUPIPayout = async (withdrawal) => {
  try {
    // Step 1: Create Contact (if not already created)
    const contact = await razorpay.contacts.create({
      name: withdrawal.user.name,
      email: withdrawal.user.email,
      contact: withdrawal.user.phone,
      type: "customer",
    });

    // Step 2: Create Fund Account for UPI
    const fundAccount = await razorpay.fundAccounts.create({
      contact_id: contact.id,
      account_type: "vpa",
      vpa: { address: withdrawal.upiId },
    });

    // Step 3: Create Payout
    const payout = await razorpay.payouts.create({
      account_number: "Your Razorpay Account",
      amount: withdrawal.amount * 100, // Convert to paise
      currency: "INR",
      mode: "UPI",
      purpose: "payout",
      fund_account_id: fundAccount.id,
      queue_if_low_balance: true, // Ensures payout is queued if insufficient balance
    });

    console.log("Payout Successful:", payout);
    return { success: true, payout };
  } catch (error) {
    console.error("Payout Failed:", error);
    return { success: false, error: error.message };
  }
};

const approveWithdrawal = async (req, res) => {
  try {
    const { withdrawalId } = req.body;

    // 1️⃣ Fetch Withdrawal Request
    const withdrawal = await Withdrawal.findById(withdrawalId).populate("user");
    if (!withdrawal)
      return res.status(404).json({ message: "Withdrawal not found." });
    if (withdrawal.status !== "pending")
      return res.status(400).json({ message: "Withdrawal already processed." });

    // 2️⃣ Fetch KYC Details (UPI ID)
    const kyc = await KYC.findOne({ user: withdrawal.user._id });
    if (!kyc || !kyc.upiId)
      return res
        .status(400)
        .json({ message: "KYC details not found or UPI ID missing." });

    // 3️⃣ Create Razorpay Contact
    const contact = await razorpay.contacts.create({
      name: withdrawal.user.name,
      email: withdrawal.user.email,
      contact: withdrawal.user.phone,
      type: "customer",
    });

    // 4️⃣ Create Fund Account for UPI
    const fundAccount = await razorpay.fundAccounts.create({
      contact_id: contact.id,
      account_type: "vpa",
      vpa: { address: kyc.upiId },
    });

    // 5️⃣ Create Razorpay Payout
    const payout = await razorpay.payouts.create({
      account_number: "Your Razorpay Account",
      amount: withdrawal.amount * 100, // Convert to paise
      currency: "INR",
      mode: "UPI",
      purpose: "payout",
      fund_account_id: fundAccount.id,
      queue_if_low_balance: true,
    });

    // 6️⃣ Update Withdrawal Status
    withdrawal.status = "approved";
    withdrawal.payoutId = payout.id;
    await withdrawal.save();

    // 7️⃣ Notify User
    // sendNotification(withdrawal.user._id, "Your withdrawal has been approved & processed!");

    res
      .status(200)
      .json({ message: "Withdrawal approved successfully.", payout });
  } catch (error) {
    console.error("Payout Error:", error);
    res
      .status(500)
      .json({ message: "Failed to process payout.", error: error.message });
  }
};

const approveBankWithdrawal = async (req, res) => {
  try {
    const { kycId, amount } = req.body;
    console.log("🔄 Initiating Bank Withdrawal...");

    // Fetch KYC
    const kyc = await KYC.findById(kycId).populate("userId");
    if (!kyc)
      return res
        .status(404)
        .json({ success: false, message: "KYC record not found." });
    if (!kyc.verified)
      return res
        .status(400)
        .json({ success: false, message: "KYC is not verified yet." });

    // Validate IFSC code
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(kyc.ifscCode)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid IFSC code format." });
    }

    // RazorpayX API Credentials
    const auth = {
      auth: {
        username: process.env.RAZORPAY_KEY_ID,
        password: process.env.RAZORPAY_KEY_SECRET,
      },
    };

    // ✅ Step 1: Create Contact (Check if contact exists before creating a new one)
    let contactId;
    try {
      const contactResponse = await axios.post(
        "https://api.razorpay.com/v1/contacts",
        {
          name: kyc.userId.name,
          email: kyc.userId.email,
          contact: kyc.userId.phone,
          type: "customer",
        },
        auth
      );
      contactId = contactResponse.data.id;
    } catch (error) {
      console.error(
        "❌ Contact Creation Error:",
        error.response?.data || error.message
      );
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to create Razorpay contact.",
          error: error.response?.data || error.message,
        });
    }

    // ✅ Step 2: Create Fund Account
    let fundAccountId;
    try {
      const fundResponse = await axios.post(
        "https://api.razorpay.com/v1/fund_accounts",
        {
          contact_id: contactId,
          account_type: "bank_account",
          bank_account: {
            name: kyc.accountHolderName,
            ifsc: kyc.ifscCode,
            account_number: kyc.bankAccountNumber,
          },
        },
        auth
      );
      fundAccountId = fundResponse.data.id;
    } catch (error) {
      console.error(
        "❌ Fund Account Creation Error:",
        error.response?.data || error.message
      );
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to create fund account.",
          error: error.response?.data || error.message,
        });
    }

    // ✅ Step 3: Create Payout
    let payoutId;
    try {
      const payoutResponse = await axios.post(
        "https://api.razorpay.com/v1/payouts",
        {
          account_number: "2323230077721678", // ✅ Ensure this is your RazorpayX account number
          fund_account_id: fundAccountId,
          amount: amount * 100, // Convert to paise
          currency: "INR",
          mode: "IMPS",
          purpose: "payout",
          queue_if_low_balance: true,
        },
        auth
      );
      payoutId = payoutResponse.data.id;
    } catch (error) {
      console.error("❌ Payout Error:", error.response?.data || error.message);
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to process payout.",
          error: error.response?.data || error.message,
        });
    }

    // ✅ Step 4: Save Withdrawal Record
    try {
      const withdrawal = new Withdrawal({
        userId: kyc.userId._id,
        kyc: kyc._id,
        amount,
        status: "approved",
        payoutId,
      });
      await withdrawal.save();
    } catch (error) {
      console.error("❌ Withdrawal Save Error:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Failed to save withdrawal record." });
    }

    return res.status(200).json({
      success: true,
      message: "Bank withdrawal approved successfully.",
      payoutId,
    });
  } catch (error) {
    console.error("❌ Unexpected Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
      error: error.message,
    });
  }
};

module.exports = {
  getWithdrawalRequests,
  verifyKYC,
  addekyc,
  processUPIPayout,
  approveWithdrawal,
  approveBankWithdrawal, submitWithdrawalRequest
};
