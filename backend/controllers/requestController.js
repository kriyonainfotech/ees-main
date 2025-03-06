const User = require("../model/user"); // Update the path as needed
const mongoose = require("mongoose");
const { sendNotification } = require("./sendController");

const sendRequestNotification = async (userId, title, message) => {
  try {
    const user = await User.findById(userId);
    if (user && user.fcmToken) {
      await sendNotification(user.fcmToken, title, message);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const sentRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;
    console.log(receiverId, senderId);

    console.log("🔍 Fetching sender and receiver details...");

    if (!senderId || !receiverId) {
      return res.status(400).send({
        success: false,
        message: "Sender or receiver ID is missing.",
      });
    }

    if (senderId === receiverId) {
      return res.status(400).send({
        success: false,
        message: "You cannot send a request to yourself.",
      });
    }

    // ✅ Generate a common requestId for both sender & receiver

    // Fetch sender and receiver details
    const sender = await User.findById(senderId).select(
      "_id name sended_requests"
    );
    const receiver = await User.findById(receiverId).select(
      "_id name received_requests fcmToken"
    );

    if (!sender || !receiver) {
      return res.status(404).send({
        success: false,
        message: "Sender or receiver not found.",
      });
    }

    console.log("📌 Sender:", sender);
    console.log("📌 Receiver:", receiver);

    // Ensure sender & receiver requests arrays exist
    sender.sended_requests = sender.sended_requests || [];
    receiver.received_requests = receiver.received_requests || [];

    // ✅ Check if a pending request already exists (using requestId)
    const existingSentRequest = sender.sended_requests.find(
      (req) =>
        req.user &&
        req.user.toString() === receiverId &&
        req.status === "pending"
    );

    if (existingSentRequest) {
      console.log("❌ Already sent request.");
      return res.status(400).send({
        success: false,
        message: "Already sent request.",
      });
    }

    console.log("✅ No existing request found. Proceeding to send request...");
    // ✅ Generate a common requestId
    const requestId = new mongoose.Types.ObjectId();
    console.log(requestId, "requestId");

    if (requestId) {
      sender.sended_requests.push({
        requestId: requestId, // Convert to string
        user: receiverId,
        status: "pending",
        date: new Date(),
      });

      receiver.received_requests.push({
        requestId: requestId,
        user: senderId,
        status: "pending",
        date: new Date(),
      });
    } else {
      console.error("❌ requestId is undefined!");
      return res.status(500).send({
        success: false,
        message: "Error generating request ID.",
      });
    }

    // ✅ Save both users
    await sender.save();
    await receiver.save();

    console.log("📌 Sending notification...");
    const Notification = {
      type: "new_work",
      senderName: sender.name,
      fcmToken: receiver.fcmToken,
      title: "🚀 New Work Request!",
      message: `🔔 ${sender.name} has sent you a work request! 📩`,
      receiverId: receiver._id, // Include receiver's ID to store the notification
    };
    console.log("🔵 Notification:", Notification);
    await sendNotification(Notification);

    return res.status(200).send({
      success: true,
      message: "Request sent successfully.",
      sender: { _id: sender._id, name: sender.name },
      receiver: { _id: receiver._id, name: receiver.name },
      requestId, // Return requestId for tracking
    });
  } catch (error) {
    console.error("❌ Error in request process:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred during the request.",
      error: error.message,
    });
  }
};

const getUserRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select("sended_requests received_requests")
      .populate("sended_requests.user", "name email")
      .populate("received_requests.user", "name email");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({
      success: true,
      requests: user,
    });
  } catch (error) {
    console.error("Error fetching user requests:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Function to send FCM Notification
const sentRequestMobile = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body; // 🔹 Extract senderId directly from request

    console.log("🔍 Fetching sender and receiver details...");

    if (!senderId || !receiverId) {
      return res.status(400).send({
        success: false,
        message: "Sender or receiver ID is missing.",
      });
    }

    if (senderId === receiverId) {
      return res.status(400).send({
        success: false,
        message: "You cannot send a request to yourself.",
      });
    }

    // Fetch sender and receiver details
    const sender = await User.findById(senderId).select(
      "_id name sended_requests"
    );
    const receiver = await User.findById(receiverId).select(
      "_id name received_requests fcmToken"
    );

    if (!sender || !receiver) {
      return res.status(404).send({
        success: false,
        message: "Sender or receiver not found.",
      });
    }

    console.log("📌 Sender:", sender);
    console.log("📌 Receiver:", receiver);

    sender.sended_requests = sender.sended_requests || [];
    receiver.received_requests = receiver.received_requests || [];

    // ✅ Check if a pending request already exists
    const existingSentRequest = sender.sended_requests.find(
      (req) => req.user.toString() === receiverId && req.status === "pending"
    );

    if (existingSentRequest) {
      console.log("❌ Already sent request.");
      return res.status(400).send({
        success: false,
        message: "Already sent request.",
      });
    }

    console.log("✅ No existing request found. Proceeding to send request...");

    // ✅ Generate a common requestId
    const requestId = new mongoose.Types.ObjectId();
    console.log(requestId, "requestId");

    if (requestId) {
      sender.sended_requests.push({
        requestId: requestId, // Convert to string
        user: receiverId,
        status: "pending",
        date: new Date(),
      });

      receiver.received_requests.push({
        requestId: requestId,
        user: senderId,
        status: "pending",
        date: new Date(),
      });
    } else {
      console.log("❌ requestId is undefined!");
      return res.status(500).send({
        success: false,
        message: "Error generating request ID.",
      });
    }

    await sender.save();
    await receiver.save();

    console.log("📌 Sending notification...");
    const Notification = {
      type: "new_work",
      senderName: sender.name,
      fcmToken: receiver.fcmToken,
      title: "🚀 New Work Request!",
      message: `🔔 ${sender.name} has sent you a work request! 📩`,
      receiverId: receiver._id, // Include receiver's ID to store the notification
    };
    console.log("🔵 Notification:", Notification);
    await sendNotification(Notification);


    return res.status(200).send({
      success: true,
      message: "Request sent successfully.",
      sender: { _id: sender._id, name: sender.name },
      receiver: { _id: receiver._id, name: receiver.name },
      requestId,
    });
  } catch (error) {
    console.error("❌ Error in request process:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred during the request.",
      error: error.message,
    });
  }
};

const getSentRequests = async (req, res) => {
  console.log("📤 [INFO] Fetching sent requests...");

  try {
    const userId = req.user?.id;
    if (!userId) {
      console.warn("⚠️ [WARN] Missing userId in request.");
      return res
        .status(400)
        .json({ success: false, message: "🔒 User authentication required." });
    }

    console.log(`🔎 [INFO] Fetching sent requests for userId: ${userId}`);

    const user = await User.findById(userId)
      .select("sended_requests")
      .populate({
        path: "sended_requests.user",
        select:
          "name phone email profilePic address businessCategory businessName businessAddress fcmToken userstatus averageRating ratings providerAverageRating providerRatings userAverageRating userRatings businessDetaile",
        options: { lean: true },
      })
      .lean();
    if (!user) {
      console.warn(`❌ [WARN] User with ID ${userId} not found.`);
      return res
        .status(404)
        .json({ success: false, message: "🙅‍♂️ User not found." });
    }

    const sendedRequests =
      user.sended_requests?.map((req) => ({
        requestId: req.requestId, // ✅ Include requestId
        receiverId: req.user?._id,
        name: req.user?.name,
        phone: req.user?.phone,
        email: req.user?.email,
        profilePic: req.user?.profilePic,
        businessCategory: req.user?.businessCategory,
        businessName: req.user?.businessName,
        businessAddress: req.user?.businessAddress,
        sended_requests: req.user?.sended_requests,
        status: req.status,
        date: req.date,
        providerrating: req.providerrating,
      })) || [];

    console.log(`✅ [SUCCESS] Retrieved ${sendedRequests.length} sent requests.`);

    return res.status(200).json({
      success: true,
      message: "📩 Sent requests retrieved successfully!",
      sendedRequests,
      user,
    });
  } catch (error) {
    console.error("❌ [ERROR] Failed to fetch sent requests:", error);
    return res.status(500).json({
      success: false,
      message: "🚨 An error occurred while retrieving sent requests.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getReceivedRequests = async (req, res) => {
  console.log("📥 [INFO] Fetching received requests...");

  try {
    const userId = req.user?.id;
    if (!userId) {
      console.warn("⚠️ [WARN] Missing userId in request.");
      return res
        .status(400)
        .json({ success: false, message: "🔒 User authentication required." });
    }

    console.log(`🔎 [INFO] Fetching received requests for userId: ${userId}`);

    const user = await User.findById(userId)
      .select("received_requests")
      .populate({
        path: "received_requests.user",
        select:
          "name phone email profilePic address businessCategory businessName businessAddress fcmToken userstatus providerAverageRating userAverageRating  businessDetaile userRating",
        options: { lean: true },
      })
      .lean();
    // console.log(user, "user");
    if (!user) {
      console.warn(`❌ [WARN] User with ID ${userId} not found.`);
      return res
        .status(404)
        .json({ success: false, message: "🙅‍♂️ User not found." });
    }

    const receivedRequests =
      user.received_requests?.map((req) => ({
        requestId: req.requestId, // ✅ Include requestId
        senderId: req.user?._id,
        name: req.user?.name,
        phone: req.user?.phone,
        email: req.user?.email,
        profilePic: req.user?.profilePic,
        address: req.user?.address,
        businessCategory: req.user?.businessCategory,
        businessName: req.user?.businessName,
        businessAddress: req.user?.businessAddress,
        fcmToken: req.user?.fcmToken,
        userstatus: req.user?.userstatus,
        providerAverageRating: req.user?.providerAverageRating,
        userAverageRating: req.user?.userAverageRating,
        businessDetaile: req.user?.businessDetaile,
        received_requests: req.user?.received_requests,
        status: req.status,
        date: req.date,
        userrating: req.userrating,
      })) || [];

    console.log(
      // `✅ [SUCCESS] Retrieved ${receivedRequests.length} received requests.`
    );
    return res.status(200).json({
      success: true,
      message: "📥 Received requests retrieved successfully!",
      receivedRequests,
    });
  } catch (error) {
    console.error("❌ [ERROR] Failed to fetch received requests:", error);
    return res.status(500).json({
      success: false,
      message: "🚨 An error occurred while retrieving received requests.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const { requestId, userId } = req.body;

    console.log("🔹 Incoming delete request:", { requestId, userId });

    if (!requestId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Request ID and User ID are required.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(requestId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request or user ID." });
    }

    // Fetch user to check if they are sender or receiver
    const user = await User.findById(userId).select(
      "sended_requests received_requests"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    let senderId = null,
      receiverId = null;

    const sentRequest = user.sended_requests.find(
      (req) => req.requestId.toString() === requestId
    );
    if (sentRequest) {
      senderId = userId;
      receiverId = sentRequest.user.toString();
    }

    const receivedRequest = user.received_requests.find(
      (req) => req.requestId.toString() === requestId
    );
    if (receivedRequest) {
      receiverId = userId;
      senderId = receivedRequest.user.toString();
    }

    if (!senderId || !receiverId) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found." });
    }

    console.log("✅ Found request. Sender:", senderId, "Receiver:", receiverId);

    // Remove request from sender's `sended_requests`
    const senderUpdate = await User.updateOne(
      { _id: senderId },
      {
        $pull: {
          sended_requests: {
            requestId: new mongoose.Types.ObjectId(requestId),
          },
        },
      }
    );

    // Remove request from receiver's `received_requests`
    const receiverUpdate = await User.updateOne(
      { _id: receiverId },
      {
        $pull: {
          received_requests: {
            requestId: new mongoose.Types.ObjectId(requestId),
          },
        },
      }
    );

    console.log("🔹 Sender Update Result:", senderUpdate);
    console.log("🔹 Receiver Update Result:", receiverUpdate);

    if (!senderUpdate.modifiedCount && !receiverUpdate.modifiedCount) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found in DB." });
    }

    return res.status(200).json({
      success: true,
      message: "Request deleted successfully from both users.",
    });
  } catch (error) {
    console.error("❌ Error deleting request:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the request.",
      error: error.message,
    });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const userId = req.user.id;

    console.log(
      `📩 User(${userId}) updating request(${requestId}) to: ${status}`
    );

    if (!userId || !requestId || !status) {
      return res.status(400).json({
        success: false,
        message: "User ID, request ID, or status is missing!",
      });
    }

    const user = await User.findOne({
      $or: [
        { _id: userId, "sended_requests.requestId": requestId },
        { _id: userId, "received_requests.requestId": requestId },
      ],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "❌ Request not found!" });
    }

    if (!user || !user.sended_requests || !user.received_requests) {
      console.error("User or request lists are undefined");
      return res
        .status(400)
        .json({ success: false, message: "Invalid user data" });
    }

    const isSender = user.sended_requests.some(
      (r) => r.requestId && r.requestId.toString() === requestId
    );
    console.log(isSender, "is sender");

    const isReceiver = user.received_requests.some(
      (r) => r.requestId && r.requestId.toString() === requestId
    );

    console.log(isReceiver, "is receiver");

    if (!isSender && !isReceiver) {
      return res.status(404).json({
        success: false,
        message: "❌ Request not found in user data!",
      });
    }

    // 🚫 Prevent changing to the same status
    const requestField = isSender ? "sended_requests" : "received_requests";
    console.log(
      requestField,
      "request field============================================"
    );
    const request = user[requestField].find(
      (r) => r.requestId.toString() === requestId
    );

    if (request.status === status) {
      return res.status(400).json({
        success: false,
        message: `⚠️ Request is already '${status}'!`,
      });
    }

    console.log(
      request,
      "request--------------------------------------------------------"
    );

    let updateQueries = [];

    if (status === "cancelled") {
      updateQueries = [
        User.updateOne(
          { _id: request.user, "received_requests.requestId": requestId },
          { $set: { "received_requests.$.status": status } }
        ),
        User.updateOne(
          { "sended_requests.requestId": requestId },
          { $set: { "sended_requests.$.status": status } }
        ),
      ];
    } else if (status === "rejected" || status === "accepted") {
      updateQueries = [
        // ✅ Update receiver's received_requests (user is rejecting the request)
        User.updateOne(
          { _id: userId, "received_requests.requestId": requestId },
          { $set: { "received_requests.$.status": status } }
        ),
        // ✅ Update sender's sended_requests (their request is being rejected)
        User.updateOne(
          { _id: request.user, "sended_requests.requestId": requestId },
          { $set: { "sended_requests.$.status": status } }
        ),
      ];
    } else if (status === "completed") {
      // ✅ Update only the user making the request when completed
      updateQueries = [
        User.updateOne(
          { _id: userId, [`${requestField}.requestId`]: requestId },
          { $set: { [`${requestField}.$.status`]: status } }
        ),
      ];
    }

    console.log(
      updateQueries,
      "uq---------------------------------------------------------------------"
    );
    // Run updates in parallel and wait for both to complete
    const [userUpdate, otherUserUpdate] = await Promise.all(updateQueries);

    // If both updates failed, return error
    if (!userUpdate.modifiedCount && !otherUserUpdate.modifiedCount) {
      return res
        .status(400)
        .json({ success: false, message: "❌ Request update failed!" });
    }

    const sender = await User.findById(request.user).lean();
    const receiver = await User.findById(userId).lean();

    console.log({ sender, receiver }, "User Data");

    if (!sender || !receiver) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    return res.status(200).json({
      success: true,
      message: `✅ Request '${status}' successfully! `,
    });
  } catch (error) {
    console.log(error, "error from update request status");
    return res.status(500).json({
      success: false,
      message: "🚨 Error updating request!",
      error: error.message,
    });
  }
};

const updateRequestStatusMobile = async (req, res) => {
  try {
    const { userId, requestId, status } = req.body; // 🔹 Extract userId from request body

    console.log(
      `📩 User(${userId}) updating request(${requestId}) to: ${status}`
    );

    if (!userId || !requestId || !status) {
      return res.status(400).json({
        success: false,
        message: "User ID, request ID, or status is missing!",
      });
    }

    const user = await User.findOne({
      $or: [
        { _id: userId, "sended_requests.requestId": requestId },
        { _id: userId, "received_requests.requestId": requestId },
      ],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "❌ Request not found!" });
    }

    if (!user.sended_requests || !user.received_requests) {
      console.error("User request lists are undefined");
      return res
        .status(400)
        .json({ success: false, message: "Invalid user data" });
    }

    const isSender = user.sended_requests.some(
      (r) => r.requestId && r.requestId.toString() === requestId
    );
    console.log(isSender, "is sender");

    const isReceiver = user.received_requests.some(
      (r) => r.requestId && r.requestId.toString() === requestId
    );
    console.log(isReceiver, "is receiver");

    if (!isSender && !isReceiver) {
      return res.status(404).json({
        success: false,
        message: "❌ Request not found in user data!",
      });
    }

    // 🚫 Prevent changing to the same status
    const requestField = isSender ? "sended_requests" : "received_requests";
    console.log(
      requestField,
      "request field===================================="
    );

    const request = user[requestField].find(
      (r) => r.requestId.toString() === requestId
    );

    if (request.status === status) {
      return res.status(400).json({
        success: false,
        message: `⚠️ Request is already '${status}'!`,
      });
    }

    console.log(
      request,
      "request--------------------------------------------------------"
    );

    let updateQueries = [];

    if (status === "cancelled") {
      updateQueries = [
        User.updateOne(
          { _id: userId, "received_requests.requestId": requestId },
          { $set: { "received_requests.$.status": status } }
        ),
        User.updateOne(
          { "sended_requests.requestId": requestId },
          { $set: { "sended_requests.$.status": status } }
        ),
      ];
    } else if (status === "rejected" || status === "accepted") {
      updateQueries = [
        // ✅ Update receiver's received_requests (user is rejecting the request)
        User.updateOne(
          { _id: userId, "received_requests.requestId": requestId },
          { $set: { "received_requests.$.status": status } }
        ),
        // ✅ Update sender's sended_requests (their request is being rejected)
        User.updateOne(
          { _id: request.user, "sended_requests.requestId": requestId },
          { $set: { "sended_requests.$.status": status } }
        ),
      ];
    } else if (status === "completed") {
      // ✅ Update only the user making the request when completed
      updateQueries = [
        User.updateOne(
          { _id: userId, [`${requestField}.requestId`]: requestId },
          { $set: { [`${requestField}.$.status`]: status } }
        ),
      ];
    }
    // Run updates in parallel and wait for both to complete
    const [userUpdate, otherUserUpdate] = await Promise.all(updateQueries);

    // If both updates failed, return error
    if (!userUpdate.modifiedCount && !otherUserUpdate.modifiedCount) {
      return res
        .status(400)
        .json({ success: false, message: "❌ Request update failed!" });
    }

    // Fetch sender and receiver details for notification
    const sender = await User.findById(request.user);
    const receiver = await User.findById(userId);

    // if (sender && receiver && sender.fcmToken) {
    //   const notification = {
    //     senderName: receiver.name,
    //     fcmToken: sender.fcmToken,
    //     title: "Request Status Updated",
    //     message: `${receiver.name} has updated the request status to '${status}'.`,
    //     receiverId: sender._id,
    //   };
    //   console.log(notification, "n");
    //   await sendNotification(notification);
    // }

    return res.status(200).json({
      success: true,
      message: `✅ Request '${status}' successfully updated!`,
    });
  } catch (error) {
    console.log(error, "error from update request status");
    return res.status(500).json({
      success: false,
      message: "🚨 Error updating request!",
      error: error.message,
    });
  }
};

const getSendedRequestsMobile = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId, "user id");

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Fetch only sended_requests and populate user details
    const user = await User.findById(userId)
      .select("sended_requests")
      .populate({
        path: "sended_requests.user",
        select:
          "name phone email profilePic address businessCategory businessName businessAddress fcmToken userstatus averageRating ratings providerAverageRating providerRatings userAverageRating userRatings businessDetaile sended_requests",
        options: { lean: true },
      })
      .lean();

    console.log(user, "user from get sended request");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Format response without 'user' wrapper
    const sendedRequests = user.sended_requests.map((req) => ({
      _id: req.user?._id,
      requestId: req.requestId,
      name: req.user?.name,
      phone: req.user?.phone,
      email: req.user?.email,
      profilePic: req.user?.profilePic,
      address: req.user?.address,
      businessCategory: req.user?.businessCategory,
      businessName: req.user?.businessName,
      businessAddress: req.user?.businessAddress,
      fcmToken: req.user?.fcmToken,
      userstatus: req.user?.userstatus,
      averageRating: req.user?.averageRating,
      ratings: req.user?.ratings,
      providerAverageRating: req.user?.providerAverageRating,
      providerRatings: req.user?.providerRatings,
      userAverageRating: req.user?.userAverageRating,
      userRatings: req.user?.userRatings,
      businessDetaile: req.user?.businessDetaile,
      // status: req.user?.sendedRequests.status,
      status: req.status,
      date: req.date,
      providerrating: req.providerrating,
    }));

    // console.log(
    //   // sendedRequests,
    //   "===========================sended reque===============sts==================================="
    // );

    return res.status(200).json({
      success: true,
      message: "Requests retrieved successfully",
      data: sendedRequests,
    });
  } catch (error) {
    console.error("Request retrieval error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while processing requests",
      error: error.message,
    });
  }
};

const getReceivedRequestsMobile = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId, "user id");
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Fetch only received_requests and populate user details
    const user = await User.findById(userId)
      .select("received_requests")
      .populate({
        path: "received_requests.user",
        select:
          "name phone email profilePic address businessCategory businessName businessAddress fcmToken userstatus averageRating ratings providerAverageRating userAverageRating  businessDetaile userRating",
        options: { lean: true },
      })
      .lean();
    console.log(user, "user from get received request");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Format response without 'user' wrapper
    const receivedRequests = user.received_requests.map((req) => ({
      _id: req.user?._id,
      requestId: req.requestId,
      name: req.user?.name,
      phone: req.user?.phone,
      email: req.user?.email,
      profilePic: req.user?.profilePic,
      address: req.user?.address,
      businessCategory: req.user?.businessCategory,
      businessName: req.user?.businessName,
      businessAddress: req.user?.businessAddress,
      fcmToken: req.user?.fcmToken,
      userstatus: req.user?.userstatus,
      averageRating: req.user?.averageRating,
      ratings: req.user?.ratings,
      providerAverageRating: req.user?.providerAverageRating,
      // providerRatings: req.user?.providerRatings,
      userAverageRating: req.user?.userAverageRating,
      // userRatings: req.user?.userRatings,
      businessDetaile: req.user?.businessDetaile,
      received_requests: req.user?.received_requests,
      status: req.status,
      date: req.date,
      userrating: req.userrating,
    }));
    // console.log(receivedRequests, "received requests mobile");

    return res.status(200).json({
      success: true,
      message: "Requests retrieved successfully",
      data: receivedRequests,
    });
  } catch (error) {
    console.error("Request retrieval error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while processing requests",
      error: error.message,
    });
  }
};

const getUsersWithRequestsCounts = async (req, res) => {
  try {
    const { userId } = req.body;

    const updateResult = await User.updateOne(
      { _id: userId }, // Ensure userId is the correct MongoDB ObjectId
      {
        $set: {
          sended_requests: [],
          received_requests: [],
          userAverageRating: 0,
          providerAverageRating: 0,
          providerRatings: [],
          userRatings: [],
        },
      }
    );

    console.log(
      `[SUCCESS] ✅ Reset completed for ${updateResult.modifiedCount} users.`
    );
    return res.status(200).send({
      success: true,
      message: "All users' requests set to null successfully.",
    });
  } catch (error) {
    console.error("🔥 Error updating referral codes:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

module.exports = {
  sentRequest,
  sentRequestMobile,
  deleteRequest,
  updateRequestStatus,
  getSendedRequestsMobile,
  getReceivedRequestsMobile,
  getSentRequests,
  getReceivedRequests,
  getUsersWithRequestsCounts,
  updateRequestStatusMobile,
  getUserRequests,
};
