const UserModel = require("../model/user");
const { sendNotification } = require("./sendController");
const mongoose = require("mongoose");
const Request = require("../model/request"); // adjust path as needed
const Rating = require("../model/rating");
const User = require("../model/user");

const addRating = async (req, res) => {
  try {
    const { requestId, ratingValue, comment } = req.body;
    const userId = req.user.id;

    if (!requestId || !ratingValue) {
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    if (ratingValue < 1 || ratingValue > 10) {
      return res.status(400).json({
        message: "⚠️ Rating must be between 1 and 10",
      });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "❌ Request not found" });
    }

    const isSender = request.sender.toString() === userId;
    const isReceiver = request.receiver.toString() === userId;

    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: "❌ Unauthorized to rate" });
    }

    const now = new Date();

    let ratedUserId;
    let ratingType;

    // Check if rating already exists
    if (isSender) {
      if (request.providerRatingbySender?.value) {
        return res.status(400).json({
          message: "⚠️ Sender has already rated this request",
        });
      }

      request.providerRatingbySender = {
        value: ratingValue,
        comment,
        date: now,
      };

      request.completedBySender = true;
      ratedUserId = request.receiver;
      ratingType = "provider";
    } else if (isReceiver) {
      if (request.userRatingbyprovider?.value) {
        return res.status(400).json({
          message: "⚠️ Receiver has already rated this request",
        });
      }

      request.userRatingbyprovider = {
        value: ratingValue,
        comment,
        date: now,
      };

      request.completedByReceiver = true; // 💡 mark as completed by receiver
      ratedUserId = request.sender;
      ratingType = "user";
    }

    // Create a new Rating record
    await Rating.create({
      requestId,
      rater: userId,
      ratedUser: ratedUserId,
      ratingType,
      rating: ratingValue,
      comment,
      date: now,
    });

    // Update user summary stats (average + count)
    const ratings = await Rating.aggregate([
      {
        $match: {
          ratedUser: ratedUserId,
          ratingType: ratingType,
        },
      },
      {
        $group: {
          _id: null,
          average: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const { average, count } = ratings[0];

    // Update user record
    const updateField =
      ratingType === "provider"
        ? { providerAverageRating: average, providerRatingCount: count }
        : { userAverageRating: average, userRatingCount: count };

    await User.findByIdAndUpdate(ratedUserId, updateField);

    // If both ratings are done, mark request as "rated"
    if (request.completedBySender && request.completedByReceiver) {
      request.status = "rated"; // ✅ only when BOTH have completed
    }

    await request.save();

    return res.json({
      success: true,
      message: "⭐ Rating submitted successfully!",
    });
  } catch (error) {
    console.error("❌ Error adding rating:", error);
    return res.status(500).json({ message: "🚨 Server error" });
  }
};

const addRatingMobile = async (req, res) => {
  try {
    const { requestId, senderId, receiverId, ratingValue, comment } = req.body;

    if (!requestId || !ratingValue) {
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    if (ratingValue < 1 || ratingValue > 10) {
      return res.status(400).json({
        message: "⚠️ Rating must be between 1 and 10",
      });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "❌ Request not found" });
    }

    const isSender = request.sender.toString() === senderId;
    const isReceiver = request.receiver.toString() === senderId;

    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: "❌ Unauthorized to rate" });
    }

    const now = new Date();

    let ratedUserId;
    let ratingType;

    // Check if rating already exists
    if (isSender) {
      if (request.providerRatingbySender?.value) {
        return res.status(400).json({
          message: "⚠️ Sender has already rated this request",
        });
      }

      request.providerRatingbySender = {
        value: ratingValue,
        comment,
        date: now,
      };

      ratedUserId = request.receiver;
      ratingType = "provider";
    } else if (isReceiver) {
      if (request.userRatingbyprovider?.value) {
        return res.status(400).json({
          message: "⚠️ Receiver has already rated this request",
        });
      }

      request.userRatingbyprovider = {
        value: ratingValue,
        comment,
        date: now,
      };
      ratedUserId = request.sender;
      ratingType = "user";
    }

    // Create a new Rating record
    await Rating.create({
      requestId,
      rater: senderId,
      ratedUser: ratedUserId,
      ratingType,
      rating: ratingValue,
      comment,
      date: now,
    });

    // Update user summary stats (average + count)
    const ratings = await Rating.aggregate([
      {
        $match: {
          ratedUser: ratedUserId,
          ratingType: ratingType,
        },
      },
      {
        $group: {
          _id: null,
          average: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const { average, count } = ratings[0];

    // Update user record
    const updateField =
      ratingType === "provider"
        ? { providerAverageRating: average, providerRatingCount: count }
        : { userAverageRating: average, userRatingCount: count };

    await User.findByIdAndUpdate(ratedUserId, updateField);

    // If any one ratings are done, mark request as "rated"
    if (
      request.providerRatingbySender?.value ||
      request.userRatingbyprovider?.value
    ) {
      request.status = "rated";
    }

    await request.save();

    return res.json({
      success: true,
      message: "⭐ Rating submitted successfully!",
    });
  } catch (error) {
    console.error("❌ Error adding rating:", error);
    return res.status(500).json({ message: "🚨 Server error" });
  }
};

const getUserRating = async (req, res) => {
  try {
    const userId = req.user.id; // Assume authentication middleware sets `req.user`

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Find the user and select relevant fields
    const user = await UserModel.findById(userId).select(
      "name email ratings averageRating providerAverageRating providerRatings userRatings userAverageRating"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Calculate average ratings for both roles (if applicable)
    const providerAvgRating = user.providerAverageRating || 0; // As a provider
    const userAvgRating = user.userAverageRating || 0; // As a regular user

    res.status(200).json({
      message: "User ratings retrieved successfully.",
      userDetails: {
        name: user.name,
        email: user.email,
      },
      ratings: {
        providerRatings: user.providerRatings || [], // List of ratings as a provider
        userRatings: user.userRatings || [], // List of ratings as a user
      },
      averages: {
        providerAverageRating: providerAvgRating,
        userAverageRating: userAvgRating,
      },
    });
  } catch (error) {
    console.error("Error retrieving user ratings:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getProviderRating = async (req, res) => {
  const { userId } = req.params;
  // console.log(userId,"id");
  try {
    // Fetch ratings for the user
    const userRatings = await UserModel.findById(userId);
    // console.log(userRatings,"UserRating");

    if (!userRatings || userRatings.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No ratings found for this user." });
    }

    res.status(200).json({
      success: true,
      message: "Ratings fetched successfully.",
      ratings: userRatings, // Assuming each rating document contains a `rating` field
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching ratings.",
      error: error.message,
    });
  }
};
const rateUser = async (req, res) => {
  try {
    const { raterId, rating, comment } = req.body;
    const userId = req.user.id;
    if (rating < 1 || rating > 10) {
      return res
        .status(400)
        .send({ success: false, message: "Rating must be between 1 and 10." });
    }

    // Find the user being rated
    const user = await UserModel.findById(raterId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found." });
    }

    // Prevent self-rating
    if (userId === raterId) {
      return res
        .status(400)
        .send({ success: false, message: "Users cannot rate themselves." });
    }

    // Check if the rater has already rated this user
    const existingRating = user.userRatings.find(
      (r) => r.rater.toString() === raterId
    );

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = rating;
      existingRating.comment = comment || existingRating.comment;
    } else {
      // Add a new rating
      user.userRatings.push({
        rater: raterId,
        rating,
        comment,
      });
    }

    // Recalculate the average rating
    const totalRatings = user.userRatings.reduce((sum, r) => sum + r.rating, 0);
    user.userAverageRating = totalRatings / user.userRatings.length;

    await user.save();

    return res.status(200).send({
      success: true,
      message: "User rated successfully.",
      userAverageRating: user.userAverageRating,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error while rating user.",
      error: error.message,
    });
  }
};

const rateProvider = async (req, res) => {
  try {
    const { providerId, ratingValue, comment } = req.body;
    const senderId = req.user.id;

    // Validate inputs
    if (!providerId || !ratingValue || ratingValue < 1 || ratingValue > 10) {
      return res.status(400).send({
        success: false,
        message:
          "Provider ID, valid rating value (1-10), and comment are required.",
      });
    }

    // Fetch the sender and provider
    const [sender, provider] = await Promise.all([
      UserModel.findById(senderId),
      UserModel.findById(providerId),
    ]);

    if (!sender || !provider) {
      return res.status(404).send({
        success: false,
        message: "Sender or provider not found.",
      });
    }

    // Validate if the request status is "done"
    const senderRequestIndex = sender.sended_requests.findIndex(
      (req) => req.user._id.toString() === providerId && req.status === "done"
    );

    const providerRequestIndex = provider.received_requests.findIndex(
      (req) => req.user._id.toString() === senderId && req.status === "done"
    );

    if (senderRequestIndex === -1 || providerRequestIndex === -1) {
      return res.status(400).send({
        success: false,
        message: "No completed request found to rate.",
      });
    }

    // Update the rating in sender's sended_requests
    sender.sended_requests[senderRequestIndex].providerrating = {
      value: ratingValue,
      comment,
      date: new Date(),
    };

    // Add rating to provider's providerRatings
    provider.userRatings.push({
      rater: sender._id,
      rating: ratingValue,
      comment,
      date: new Date(),
    });

    // Recalculate provider's userAverageRating
    const totalUserRatings = provider.userRatings.length; // Note: Fixed reference to `providerRatings`
    const sumUserRatings = provider.userRatings.reduce(
      (acc, r) => acc + r.rating,
      0
    );
    provider.userAverageRating =
      totalUserRatings > 0 ? sumUserRatings / totalUserRatings : 0; // Avoid NaN

    // Save changes to both users
    await Promise.all([sender.save(), provider.save()]);

    return res.status(200).send({
      success: true,
      message: "Rating submitted successfully, and all records updated.",
    });
  } catch (error) {
    console.error("Error rating provider:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while rating the provider.",
      error: error.message,
    });
  }
};

const getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId)
      .populate({
        path: "userRatings.rater",
        select: "name email",
      })
      .populate({
        path: "providerRatings.rater",
        select: "name email",
      });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found." });
    }

    return res.status(200).send({
      success: true,
      userAverageRating: user.userAverageRating,
      providerAverageRating: user.providerAverageRating,
      userRatings: user.userRatings,
      providerRatings: user.providerRatings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching ratings.",
      error: error.message,
    });
  }
};

module.exports = {
  addRating,
  getUserRating,
  addRatingMobile,
  getProviderRating,
  rateUser,
  rateProvider,
  getUserRatings,
};
