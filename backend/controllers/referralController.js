const UserModel = require("../model/user"); // Adjust path based on your project structure
const { distributeReferralRewards } = require("../services/referralService"); // If you create a referral service later
const { sendNotification } = require("./sendController");
const mongoose = require("mongoose");

const getReferrals = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user and populate their referrals up to 3 levels
    const user = await UserModel.findById(userId)
      .select("name phone email referrals paymentVerified")
      .populate({
        path: "referrals",
        select: "name phone email referrals paymentVerified",
        populate: {
          path: "referrals",
          select: "name phone email referrals",
          populate: {
            path: "referrals",
            select: "name phone email",
          },
        },
      });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Find users who registered with this user's referral code
    const referredUsers = await UserModel.find({ referredBy: userId })
      .select("name phone email referrals paymentVerified")
      .populate({
        path: "referrals",
        select: "name phone email",
      });
    console.log(referredUsers, "ru");
    // // Function to recursively count referrals
    // const countReferrals = (referrals) => {
    //   let count = referrals.length;
    //   referrals.forEach((referral) => {
    //     if (referral.referrals) {
    //       count += countReferrals(referral.referrals);
    //     }
    //   });
    //   return count;
    // };

    // // Calculate referral counts
    // const directReferralCount = user.referrals.length;
    // const totalReferralCount = countReferrals(user.referrals);

    return res.status(200).send({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        referrals: user.referrals, // Direct referrals
        // referralCounts: {
        //   direct: directReferralCount,
        //   total: totalReferralCount, // Includes all levels
        // },
      },
      referredUsers, // Users who used this user's referral code
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching referrals",
      error: error.message,
    });
  }
};

// View who referred the user
const getReferredBy = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId)
      .select("-password -referrals")
      .populate("referredBy", "name phone");

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    return res.status(200).send({
      success: true,
      referredBy: user.referredBy,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching referred by",
      error: error.message,
    });
  }
};

const getEarnings = async (req, res) => {
  try {
    const userId = req.params.id;

    // Add timeout to the database query
    const user = await UserModel.findById(userId)
      .select("walletBalance earningsHistory")
      .maxTimeMS(5000); // 5 second timeout for DB query

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Process earnings history in batches if needed
    const validEarningsHistory = await Promise.all(
      user.earningsHistory.slice(0, 10).map(async (entry) => {
        const referrerExists = await UserModel.exists({
          _id: entry.sourceUser,
        });
        if (referrerExists) {
          return entry;
        }
        return null;
      })
    );

    // Filter out null entries
    const filteredHistory = validEarningsHistory.filter(
      (entry) => entry !== null
    );

    return res.status(200).send({
      success: true,
      earnings: user.walletBalance,
      earningsHistory: filteredHistory,
    });
  } catch (error) {
    console.error("[ERROR] Failed to fetch earnings:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching earnings",
      error: error.message,
    });
  }
};

// Manually trigger rewards distribution after a payment
const distributeRewards = async (req, res) => {
  try {
    const { userId, paymentAmount } = req.body;

    // Validate input
    if (!userId || !paymentAmount) {
      return res.status(400).send({ success: false, message: "Invalid data" });
    }

    // Distribute rewards
    await distributeReferralRewards(userId, paymentAmount);

    return res.status(200).send({
      success: true,
      message: "Payment processed and rewards distributed",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error distributing rewards",
      error: error.message,
    });
  }
};
// Get user by ID (for referredBy)
const getReffaredById = async (req, res) => {
  try {
    const { id } = req.query; // Get the user ID from query params
    // console.log(id);

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // You can return the relevant user details or the whole user object based on your need
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone, // Add any other fields you want to return
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

// Get the current wallet balance of a user, including earnings
// const getUserWalletBalance = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await UserModel.findById(userId);

//     if (!user) {
//       return res
//         .status(404)
//         .send({ success: false, message: "User not found" });
//     }

//     return res.status(200).send({
//       success: true,
//       walletBalance: user.walletBalance,
//       earningsHistory: user.earningsHistory, // Include the full earnings history
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .send({ success: false, message: "Error fetching wallet balance" });
//   }
// };

const getUserWalletBalance = async (req, res) => {
  try {
    const userId = req.params.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    // Optimized query with field projection
    const user = await UserModel.findById(userId)
      .select("walletBalance earningsHistory")
      .populate({
        path: "earningsHistory.sourceUser",
        select: "name email profilePic referredBy createdAt", // Select only required fields
      })
      .lean();
    console.log(user, "user");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const filteredEarnings = user.earningsHistory.filter((earning) =>
      earning.sourceUser?.referredBy?.some((refId) =>
        refId.equals(userObjectId)
      )
    );

    // Optimize response payload
    const response = {
      success: true,
      walletBalance: user.walletBalance,
      // Send only recent 10 transactions by default
      earningsHistory: filteredEarnings,
    };
    // console.log(response, "response of wallet balance");

    return res.status(200).json(response);
  } catch (error) {
    console.error("Wallet balance error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching wallet balance",
      error: error.message,
    });
  }
};

const getReferralsMobile = async (req, res) => {
  try {
    const { userId } = req.body; // Expecting userId from the request body

    if (!userId) {
      return res.status(400).send({ message: "User ID is required" });
    }

    // Find the user and populate their direct referrals
    const user = await UserModel.findById(userId)
      .select("name phone email referrals")
      .populate({
        path: "referrals",
        select: "name phone email",
        populate: {
          path: "referrals", // Populate referrals of the referrals (second level)
          select: "name phone email",
          populate: {
            path: "referrals", // Populate referrals of the second-level referrals (third level)
            select: "name phone email",
          },
        },
      });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Find users who registered with this user's referral code
    const referredUsers = await UserModel.find({ referredBy: userId })
      .select("name phone email referrals")
      .populate({
        path: "referrals",
        select: "name phone email",
        populate: {
          path: "referrals", // Populate referrals of the referred users (second level)
          select: "name phone email",
        },
      });

    return res.status(200).send({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        referrals: user.referrals, // Direct referrals of the user
      },
      referredUsers: referredUsers, // Users who registered using this user's referral and their referrals
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching referrals",
      error: error.message,
    });
  }
};

module.exports = {
  getReferrals,
  getReferredBy,
  getEarnings,
  distributeRewards,
  getReffaredById,
  getUserWalletBalance,
  getReferralsMobile,
};
