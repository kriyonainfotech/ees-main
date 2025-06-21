const User = require("../model/user"); // Update the path as needed
const mongoose = require("mongoose");
const { sendNotification } = require("./sendController");
const Request = require("../model/request");

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

    // old logic ----------------------------------------------------------------------------------
    // Fetch sender and receiver details
    // const sender = await User.findById(senderId).select(
    //   "_id name sended_requests"
    // );
    // const receiver = await User.findById(receiverId).select(
    //   "_id name received_requests fcmToken"
    // );

    // if (!sender || !receiver) {
    //   return res.status(404).send({
    //     success: false,
    //     message: "Sender or receiver not found.",
    //   });
    // }

    // console.log("📌 Sender:", sender);
    // console.log("📌 Receiver:", receiver);

    // // Ensure sender & receiver requests arrays exist
    // sender.sended_requests = sender.sended_requests || [];
    // receiver.received_requests = receiver.received_requests || [];

    // // ✅ Check if a pending request already exists (using requestId)
    // const existingSentRequest = sender.sended_requests.find(
    //   (req) =>
    //     req.user &&
    //     req.user.toString() === receiverId &&
    //     req.status === "pending"
    // );

    // if (existingSentRequest) {
    //   console.log("❌ Already sent request.");
    //   return res.status(400).send({
    //     success: false,
    //     message: "Already sent request.",
    //   });
    // }

    // console.log("✅ No existing request found. Proceeding to send request...");
    // // ✅ Generate a common requestId
    // const requestId = new mongoose.Types.ObjectId();
    // console.log(requestId, "requestId");

    // if (requestId) {
    //   sender.sended_requests.push({
    //     requestId: requestId, // Convert to string
    //     user: receiverId,
    //     status: "pending",
    //     date: new Date(),
    //   });

    //   receiver.received_requests.push({
    //     requestId: requestId,
    //     user: senderId,
    //     status: "pending",
    //     date: new Date(),
    //   });
    // } else {
    //   console.error("❌ requestId is undefined!");
    //   return res.status(500).send({
    //     success: false,
    //     message: "Error generating request ID.",
    //   });
    // }

    // // ✅ Save both users
    // await sender.save();
    // await receiver.save();

    // new logic----------------------------------------------------------------------------------
    const existingRequest = await Request.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });
    if (existingRequest) {
      return res
        .status(400)
        .send({ success: false, message: "Already sent request." });
    }
    // Create new Request document
    const newRequest = await Request.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
      date: new Date(),
    });

    // Fetch sender and receiver details for notification
    const sender = await User.findById(senderId).select("_id name");
    const receiver = await User.findById(receiverId).select(
      "_id name fcmToken"
    );

    console.log("📌 Sending notification...");
    const Notification = {
      type: "new_work",
      senderName: sender.name,
      fcmToken: receiver.fcmToken,
      title: "🚀 New Work Request!",
      message: `🔔 ${sender.name} has sent you a work request! 📩`,
      receiverId: receiver._id,
    };
    console.log("🔵 Notification:", Notification);
    await sendNotification(Notification);

    return res.status(200).send({
      success: true,
      message: "Request sent successfully.",
      sender: { _id: sender._id, name: sender.name },
      receiver: { _id: receiver._id, name: receiver.name },
      requestId: newRequest._id,
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

// const getUserRequests = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const user = await User.findById(userId)
//       .select("sended_requests received_requests")
//       .populate("sended_requests.user", "name email")
//       .populate("received_requests.user", "name email");

//     if (!user)
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });

//     res.json({
//       success: true,
//       requests: user,
//     });
//   } catch (error) {
//     console.error("Error fetching user requests:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

const getUserRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🔍 Fetching all requests for user:", userId);

    // 🔄 Fetch sent and received requests
    const [sended, received] = await Promise.all([
      Request.find({ sender: userId })
        .populate("receiver", "name email")
        .sort({ createdAt: -1 }),

      Request.find({ receiver: userId })
        .populate("sender", "name email")
        .sort({ createdAt: -1 }),
    ]);

    console.log(`📨 Sent: ${sended.length}, 📥 Received: ${received.length}`);

    res.json({
      success: true,
      sended,
      received,
    });
  } catch (error) {
    console.error("🔥 Error in getUserRequests:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Function to send FCM Notification
const sentRequestMobile = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body; // 🔹 Extract senderId directly from request

    console.log("🔍 Fetching sender and receiver details...", req.body);

    if (!senderId || !receiverId) {
      console.warn("⚠️ [WARN] Missing senderId or receiverId in request.");
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

    // Fetch sender and receiver details - old logic -------------------------------------------------------------------
    // const sender = await User.findById(senderId).select(
    //   "_id name sended_requests"
    // );
    // const receiver = await User.findById(receiverId).select(
    //   "_id name received_requests fcmToken"
    // );

    // if (!sender || !receiver) {
    //   return res.status(404).send({
    //     success: false,
    //     message: "Sender or receiver not found.",
    //   });
    // }

    // console.log("📌 Sender:", sender);
    // console.log("📌 Receiver:", receiver);

    // sender.sended_requests = sender.sended_requests || [];
    // receiver.received_requests = receiver.received_requests || [];

    // // ✅ Check if a pending request already exists
    // const existingSentRequest = sender.sended_requests.find(
    //   (req) => req.user.toString() === receiverId && req.status === "pending"
    // );

    // if (existingSentRequest) {
    //   console.log("❌ Already sent request.");
    //   return res.status(400).send({
    //     success: false,
    //     message: "Already sent request.",
    //   });
    // }

    // console.log("✅ No existing request found. Proceeding to send request...");

    // // ✅ Generate a common requestId
    // const requestId = new mongoose.Types.ObjectId();
    // console.log(requestId, "requestId");

    // if (requestId) {
    //   sender.sended_requests.push({
    //     requestId: requestId, // Convert to string
    //     user: receiverId,
    //     status: "pending",
    //     date: new Date(),
    //   });

    //   receiver.received_requests.push({
    //     requestId: requestId,
    //     user: senderId,
    //     status: "pending",
    //     date: new Date(),
    //   });
    // } else {
    //   console.log("❌ requestId is undefined!");
    //   return res.status(500).send({
    //     success: false,
    //     message: "Error generating request ID.",
    //   });
    // }

    // await sender.save();
    // await receiver.save();

    console.log("🔍 Checking for existing request...");

    const existingRequest = await Request.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    console.log("✅ Existing request check complete.");
    if (existingRequest) {
      return res
        .status(400)
        .send({ success: false, message: "Already sent request." });
    }
    console.log("🛠 Creating new request...");

    // Create new Request document
    const newRequest = await Request.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
      date: new Date(),
    });
    console.log("✅ New request created:", newRequest);

    // Fetch sender and receiver details for notification
    const sender = await User.findById(senderId).select("_id name");
    const receiver = await User.findById(receiverId).select(
      "_id name fcmToken"
    );

    console.log("📌 Sending notification...", receiver);
    const Notification = {
      type: "new_work",
      senderName: sender.name,
      fcmToken: receiver.fcmToken,
      title: "🚀 New Work Request!",
      message: `🔔 ${sender.name} has sent you a work request! 📩`,
      receiverId: receiver._id, // Include receiver's ID to store the notification
    };
    try {
      console.log("🔵 Notification:", Notification);
      await sendNotification(Notification);
    } catch (notifyErr) {
      console.error("❌ Error sending notification:", notifyErr);
    }

    // console.log("🔵 Notification:", Notification);
    // await sendNotification(Notification);

    return res.status(200).send({
      success: true,
      message: "Request sent successfully.",
      sender: { _id: sender._id, name: sender.name },
      receiver: { _id: receiver._id, name: receiver.name },
      requestId: newRequest._id,
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

    //old logic------------------------------------------------------------------------------------------
    // const user = await User.findById(userId)
    //   .select("sended_requests")
    //   .populate({
    //     path: "sended_requests.user",
    //     select:
    //       "name phone email profilePic address businessCategory businessName businessAddress fcmToken userstatus averageRating ratings providerAverageRating providerRatings userAverageRating userRatings businessDetaile",
    //     options: { lean: true },
    //   })
    //   .lean();
    // if (!user) {
    //   console.warn(`❌ [WARN] User with ID ${userId} not found.`);
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "🙅‍♂️ User not found." });
    // }

    // const sendedRequests =
    //   user.sended_requests?.map((req) => ({
    //     requestId: req.requestId, // ✅ Include requestId
    //     receiverId: req.user?._id,
    //     name: req.user?.name,
    //     phone: req.user?.phone,
    //     email: req.user?.email,
    //     profilePic: req.user?.profilePic,
    //     businessCategory: req.user?.businessCategory,
    //     businessName: req.user?.businessName,
    //     businessAddress: req.user?.businessAddress,
    //     sended_requests: req.user?.sended_requests,
    //     status: req.status,
    //     date: req.date,
    //     givenByreceiverRating: req.givenByreceiverRating,
    //     providerrating: req.providerrating,
    //   })) || [];

    //new logic------------------------------------------------------------------------------------------
    // Fetch Requests where user is the sender
    const sentRequests = await Request.find({ sender: userId })
      .populate({
        path: "receiver",
        select:
          "name phone email profilePic address businessCategory businessName businessAddress fcmToken userstatus averageRating ratings providerAverageRating providerRatings userAverageRating userRatings businessDetaile",
        options: { lean: true },
      })
      .lean();

    const formattedRequests = sentRequests.map((req) => ({
      requestId: req._id,
      receiverId: req.receiver?._id,
      name: req.receiver?.name,
      phone: req.receiver?.phone,
      email: req.receiver?.email,
      profilePic: req.receiver?.profilePic,
      businessCategory: req.receiver?.businessCategory,
      businessName: req.receiver?.businessName,
      businessAddress: req.receiver?.businessAddress,
      status: req.status,
      date: req.date,
      userRatingbyprovider: req.userRatingbyprovider, // from Request model
      providerRatingbySender: req.providerRatingbySender, // from Request model
    }));

    console.log(
      `✅ [SUCCESS] Retrieved ${formattedRequests.length} sent requests.`
    );

    return res.status(200).json({
      success: true,
      message: "📩 Sent requests retrieved successfully!",
      sendedRequests: formattedRequests,
      // user,
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

    // old logic------------------------------------------------------------------------------------------------
    // const user = await User.findById(userId)
    //   .select("received_requests")
    //   .populate({
    //     path: "received_requests.user",
    //     select:
    //       "name phone email profilePic address businessCategory businessName businessAddress fcmToken userstatus providerAverageRating userAverageRating  businessDetaile userRating",
    //     options: { lean: true },
    //   })
    //   .lean();
    // // console.log(user, "user");
    // if (!user) {
    //   console.warn(`❌ [WARN] User with ID ${userId} not found.`);
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "🙅‍♂️ User not found." });
    // }

    // const receivedRequests =
    //   user.received_requests?.map((req) => ({
    //     requestId: req.requestId, // ✅ Include requestId
    //     senderId: req.user?._id,
    //     name: req.user?.name,
    //     phone: req.user?.phone,
    //     email: req.user?.email,
    //     profilePic: req.user?.profilePic,
    //     address: req.user?.address,
    //     businessCategory: req.user?.businessCategory,
    //     businessName: req.user?.businessName,
    //     businessAddress: req.user?.businessAddress,
    //     fcmToken: req.user?.fcmToken,
    //     userstatus: req.user?.userstatus,
    //     providerAverageRating: req.user?.providerAverageRating,
    //     userAverageRating: req.user?.userAverageRating,
    //     businessDetaile: req.user?.businessDetaile,
    //     received_requests: req.user?.received_requests,
    //     status: req.status,
    //     date: req.date,
    //     givenBysenderRating: req.givenBysenderRating,
    //     userrating: req.userrating,
    //   })) || [];

    // Find Requests where the user is the receiver

    // new logic---------------------------------------------------------------------------------------------------
    const receivedRequestsData = await Request.find({ receiver: userId })
      .populate({
        path: "sender",
        select:
          "name phone email profilePic address businessCategory businessName businessAddress fcmToken userstatus providerAverageRating userAverageRating businessDetaile userRating",
        options: { lean: true },
      })
      .lean();

    // Map to a clean response format
    const receivedRequests = receivedRequestsData.map((req) => ({
      requestId: req._id,
      senderId: req.sender?._id,
      name: req.sender?.name,
      phone: req.sender?.phone,
      email: req.sender?.email,
      profilePic: req.sender?.profilePic,
      address: req.sender?.address,
      businessCategory: req.sender?.businessCategory,
      businessName: req.sender?.businessName,
      businessAddress: req.sender?.businessAddress,
      fcmToken: req.sender?.fcmToken,
      userstatus: req.sender?.userstatus,
      providerAverageRating: req.sender?.providerAverageRating,
      userAverageRating: req.sender?.userAverageRating,
      businessDetaile: req.sender?.businessDetaile,
      status: req.status,
      date: req.date,
      userRatingbyprovider: req.userRatingbyprovider, // from Request model
      providerRatingbySender: req.providerRatingbySender, // from Request model
    }));

    console.log("");
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
      return res.status(400).json({
        success: false,
        message: "Invalid request or user ID.",
      });
    }

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    // Check if user is either sender or receiver
    if (
      request.sender.toString() !== userId &&
      request.receiver.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this request.",
      });
    }

    await Request.deleteOne({ _id: requestId });
    console.log("Request deleted successfully.")

    return res.status(200).json({
      success: true,
      message: "Request deleted successfully.",
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
    const userId = req.user?.id;

    console.log(
      `📩 User(${userId}) updating request(${requestId}) to: ${status}`
    );

    if (!userId || !requestId || !status) {
      return res.status(400).json({
        success: false,
        message: "User ID, request ID, or status is missing!",
      });
    }

    console.log(
      `User(${userId}) updating request(${requestId}) to status: ${status}`
    );
    // old logic -------------------------------------------------------------------------------------------------------
    // const user = await User.findOne({
    //   $or: [
    //     { _id: userId, "sended_requests.requestId": requestId },
    //     { _id: userId, "received_requests.requestId": requestId },
    //   ],
    // });

    // if (!user) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "❌ Request not found!" });
    // }

    // if (!user || !user.sended_requests || !user.received_requests) {
    //   console.error("User or request lists are undefined");
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Invalid user data" });
    // }

    // const isSender = user.sended_requests.some(
    //   (r) => r.requestId && r.requestId.toString() === requestId
    // );
    // console.log(isSender, "is sender");

    // const isReceiver = user.received_requests.some(
    //   (r) => r.requestId && r.requestId.toString() === requestId
    // );

    // console.log(isReceiver, "is receiver");

    // if (!isSender && !isReceiver) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "❌ Request not found in user data!",
    //   });
    // }

    // // 🚫 Prevent changing to the same status
    // const requestField = isSender ? "sended_requests" : "received_requests";
    // console.log(
    //   requestField,
    //   "request field============================================"
    // );
    // const request = user[requestField].find(
    //   (r) => r.requestId.toString() === requestId
    // );

    // if (request.status === status) {
    //   return res.status(400).json({
    //     success: false,
    //     message: `⚠️ Request is already '${status}'!`,
    //   });
    // }

    // console.log(
    //   request,
    //   "request--------------------------------------------------------"
    // );

    // let updateQueries = [];

    // if (status === "cancelled") {
    //   updateQueries = [
    //     User.updateOne(
    //       { _id: request.user, "received_requests.requestId": requestId },
    //       { $set: { "received_requests.$.status": status } }
    //     ),
    //     User.updateOne(
    //       { "sended_requests.requestId": requestId },
    //       { $set: { "sended_requests.$.status": status } }
    //     ),
    //   ];
    // } else if (status === "rejected" || status === "accepted") {
    //   updateQueries = [
    //     // ✅ Update receiver's received_requests (user is rejecting the request)
    //     User.updateOne(
    //       { _id: userId, "received_requests.requestId": requestId },
    //       { $set: { "received_requests.$.status": status } }
    //     ),
    //     // ✅ Update sender's sended_requests (their request is being rejected)
    //     User.updateOne(
    //       { _id: request.user, "sended_requests.requestId": requestId },
    //       { $set: { "sended_requests.$.status": status } }
    //     ),
    //   ];
    // } else if (status === "completed") {
    //   // ✅ Update only the user making the request when completed
    //   updateQueries = [
    //     User.updateOne(
    //       { _id: userId, [`${requestField}.requestId`]: requestId },
    //       { $set: { [`${requestField}.$.status`]: status } }
    //     ),
    //   ];
    // }

    // console.log(
    //   updateQueries,
    //   "uq---------------------------------------------------------------------"
    // );
    // // Run updates in parallel and wait for both to complete
    // const [userUpdate, otherUserUpdate] = await Promise.all(updateQueries);

    // // If both updates failed, return error
    // if (!userUpdate.modifiedCount && !otherUserUpdate.modifiedCount) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "❌ Request update failed!" });
    // }

    // const sender = await User.findById(request.user).lean();
    // const receiver = await User.findById(userId).lean();

    // console.log({ sender, receiver }, "User Data");

    // if (!sender || !receiver) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "User not found!" });
    // }

    // new logic -------------------------------------------------------------------------------------------------------
    // Find the request document
    const request = await Request.findById(requestId);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found!" });
    }

    // Check if the logged-in user is sender or receiver
    const isSender = request.sender.toString() === userId;
    const isReceiver = request.receiver.toString() === userId;

    if (!isSender && !isReceiver) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this request.",
      });
    }

    // Prevent changing to the same status
    if (request.status === status) {
      return res.status(400).json({
        success: false,
        message: `Request is already '${status}'!`,
      });
    }

    if (status === "completed") {
      // Both sender and receiver can mark completed independently
      if (isSender) request.completedBySender = true;
      if (isReceiver) request.completedByReceiver = true;

      if (request.completedBySender && request.completedByReceiver) {
        request.status = "completed";
      }

      await request.save();
      return request;
    }

    // Only receiver can reject or accept
    if (status === "rejected" || status === "accepted") {
      if (!isReceiver) {
        throw new Error("Only receiver can reject/accept the request");
      }
      request.status = status; // set status to either 'rejected' or 'accepted'
      await request.save();
      return request;
    }

    // Only sender can cancel
    if (status === "cancelled") {
      if (!isSender) {
        throw new Error("Only sender can cancel the request");
      }
      request.status = "cancelled";
      await request.save();
      return request;
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

// const updateRequestStatusMobile = async (req, res) => {
//   try {
//     const { userId, requestId, status } = req.body; // 🔹 Extract userId from request body

//     console.log(
//       `📩 User(${userId}) updating request(${requestId}) to: ${status}`
//     );

//     if (!userId || !requestId || !status) {
//       return res.status(400).json({
//         success: false,
//         message: "User ID, request ID, or status is missing!",
//       });
//     }

//     console.log(
//       `User(${userId}) updating request(${requestId}) to status: ${status}`
//     );

//     const request = await Request.findById(requestId);
//     if (!request) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Request not found!" });
//     }

//     // Check if the logged-in user is sender or receiver
//     const isSender = request.sender.toString() === userId;
//     const isReceiver = request.receiver.toString() === userId;

//     if (!isSender && !isReceiver) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not authorized to update this request.",
//       });
//     }

//     // Prevent changing to the same status
//     if (request.status === status) {
//       return res.status(400).json({
//         success: false,
//         message: `Request is already '${status}'!`,
//       });
//     }

//     if (status === "completed") {
//       // Both sender and receiver can mark completed independently
//       if (isSender) request.completedBySender = true;
//       if (isReceiver) request.completedByReceiver = true;

//       if (request.completedBySender && request.completedByReceiver) {
//         request.status = "completed";
//       }

//       await request.save();
//       return request;
//     }

//     // Only receiver can reject or accept
//     if (status === "rejected" || status === "accepted") {
//       if (!isReceiver) {
//         throw new Error("Only receiver can reject/accept the request");
//       }
//       request.status = status; // set status to either 'rejected' or 'accepted'
//       await request.save();
//       return request;
//     }

//     // Only sender can cancel
//     if (status === "cancelled") {
//       if (!isSender) {
//         throw new Error("Only sender can cancel the request");
//       }
//       request.status = "cancelled";
//       await request.save();
//       return request;
//     }

//     console.log("Status Updated successfully !!")
//     return res.status(200).json({
//       success: true,
//       message: `✅ Request '${status}' successfully updated!`,
//     });
//   } catch (error) {
//     console.log(error, "error from update request status");
//     return res.status(500).json({
//       success: false,
//       message: "🚨 Error updating request!",
//       error: error.message,
//     });
//   }
// };

const updateRequestStatusMobile = async (req, res) => {
  try {
    const { userId, requestId, status } = req.body;

    console.log(`📩 Incoming Request Update ➜ User(${userId}) | Request(${requestId}) | New Status: ${status}`);

    // 🔍 Basic input validation
    if (!userId || !requestId || !status) {
      console.warn(`⚠️ Missing fields ➜ userId: ${userId}, requestId: ${requestId}, status: ${status}`);
      return res.status(400).json({
        success: false,
        message: "User ID, request ID, or status is missing!",
      });
    }

    // 🔍 Fetch the request
    const request = await Request.findById(requestId);
    if (!request) {
      console.warn(`❌ Request(${requestId}) not found!`);
      return res.status(404).json({
        success: false,
        message: "Request not found!",
      });
    }

    const isSender = request.sender.toString() === userId;
    const isReceiver = request.receiver.toString() === userId;

    console.log(`👥 Role Check ➜ isSender: ${isSender}, isReceiver: ${isReceiver}`);

    // 🔐 Authorization check
    if (!isSender && !isReceiver) {
      console.warn(`⛔ Unauthorized user(${userId}) tried to update request(${requestId})`);
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this request.",
      });
    }

    // 🔁 Avoid duplicate updates
    if (request.status === status) {
      console.info(`🔄 No update needed ➜ Status already '${status}'`);
      return res.status(400).json({
        success: false,
        message: `Request is already '${status}'!`,
      });
    }

    // ✅ Handle 'completed' update
    if (status === "completed") {
      if (isSender) request.completedBySender = true;
      if (isReceiver) request.completedByReceiver = true;

      console.log(`✅ Marking 'completed' ➜ Sender Done: ${request.completedBySender}, Receiver Done: ${request.completedByReceiver}`);

      if (request.completedBySender && request.completedByReceiver) {
        request.status = "rated";
        console.log(`🎉 Request(${requestId}) fully completed.`);
      }

      await request.save();
      console.log(`💾 Request(${requestId}) saved after completion update`);
      return res.status(200).json({
        success: true,
        message: `✅ Request marked as 'completed'`,
      });
    }

    // 🔁 Handle 'rejected' or 'accepted'
    if (status === "rejected" || status === "accepted") {
      if (!isReceiver) {
        console.warn(`⛔ Unauthorized reject/accept ➜ Only receiver can perform this`);
        return res.status(403).json({
          success: false,
          message: "Only receiver can reject/accept the request.",
        });
      }

      request.status = status;
      await request.save();
      console.log(`✅ Request(${requestId}) updated to '${status}' by Receiver(${userId})`);
      return res.status(200).json({
        success: true,
        message: `✅ Request '${status}' successfully updated!`,
      });
    }

    // 🔁 Handle 'cancelled'
    if (status === "cancelled") {
      if (!isSender) {
        console.warn(`⛔ Unauthorized cancel ➜ Only sender can cancel`);
        return res.status(403).json({
          success: false,
          message: "Only sender can cancel the request.",
        });
      }

      request.status = "cancelled";
      await request.save();
      console.log(`✅ Request(${requestId}) cancelled by Sender(${userId})`);
      return res.status(200).json({
        success: true,
        message: `✅ Request 'cancelled' successfully.`,
      });
    }

    console.warn(`⚠️ Unknown status value received: '${status}'`);
    return res.status(400).json({
      success: false,
      message: `Invalid status value: '${status}'`,
    });

  } catch (error) {
    console.error(`🚨 Error updating request(${req.body?.requestId}):`, error);
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
      console.warn("⚠️ [WARN] Missing userId in request.");
      return res
        .status(400)
        .json({ success: false, message: "🔒 User authentication required." });
    }

    console.log(`🔎 [INFO] Fetching sent requests for userId: ${userId}`);

    // Fetch only sended_requests and populate user details old logc -------------------------------------------------------------------------------------------------------------------
    // const user = await User.findById(userId)
    //   .select("sended_requests")
    //   .populate({
    //     path: "sended_requests.user",
    //     select:
    //       "name phone email profilePic address businessCategory businessName businessAddress fcmToken userstatus averageRating ratings providerAverageRating providerRatings userAverageRating userRatings businessDetaile sended_requests",
    //     options: { lean: true },
    //   })
    //   .lean();

    // console.log(user, "user from get sended request");

    // if (!user) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "User not found",
    //   });
    // }

    // // Format response without 'user' wrapper
    // const sendedRequests = user.sended_requests.map((req) => ({
    //   _id: req.user?._id,
    //   requestId: req.requestId,
    //   name: req.user?.name,
    //   phone: req.user?.phone,
    //   email: req.user?.email,
    //   profilePic: req.user?.profilePic,
    //   address: req.user?.address,
    //   businessCategory: req.user?.businessCategory,
    //   businessName: req.user?.businessName,
    //   businessAddress: req.user?.businessAddress,
    //   fcmToken: req.user?.fcmToken,
    //   userstatus: req.user?.userstatus,
    //   averageRating: req.user?.averageRating,
    //   ratings: req.user?.ratings,
    //   providerAverageRating: req.user?.providerAverageRating,
    //   providerRatings: req.user?.providerRatings,
    //   userAverageRating: req.user?.userAverageRating,
    //   userRatings: req.user?.userRatings,
    //   businessDetaile: req.user?.businessDetaile,
    //   // status: req.user?.sendedRequests.status,
    //   status: req.status,
    //   date: req.date,
    //   providerrating: req.providerrating,
    // }));

    // console.log(
    //   // sendedRequests,
    //   "===========================sended reque===============sts==================================="
    // );

    //new logic------------------------------------------------------------------------------------------
    // Fetch Requests where user is the sender
    const sentRequests = await Request.find({ sender: userId })
      .populate({
        path: "receiver",
        select:
          "name phone email profilePic address businessCategory businessName businessAddress fcmToken userstatus averageRating ratings providerAverageRating providerRatings userAverageRating userRatings businessDetaile",
        options: { lean: true },
      })
      .lean();

    const formattedRequests = sentRequests.map((req) => ({
      requestId: req._id,
      receiverId: req.receiver?._id,
      name: req.receiver?.name,
      phone: req.receiver?.phone,
      email: req.receiver?.email,
      profilePic: req.receiver?.profilePic,
      businessCategory: req.receiver?.businessCategory,
      businessName: req.receiver?.businessName,
      businessAddress: req.receiver?.businessAddress,
      status: req.status,
      date: req.date,
      userRatingbyprovider: req.userRatingbyprovider, // from Request model
      providerRatingbySender: req.providerRatingbySender, // from Request model
    }));

    console.log(
      `✅ [SUCCESS] Retrieved ${formattedRequests.length} sent requests.`
    );

    return res.status(200).json({
      success: true,
      message: "Requests retrieved successfully",
      data: formattedRequests,
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
      console.warn("⚠️ [WARN] Missing userId in request.");
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    console.log(`🔎 [INFO] Fetching received requests for userId: ${userId}`);

    // Fetch only received_requests and populate user details
    // const user = await User.findById(userId)
    //   .select("received_requests")
    //   .populate({
    //     path: "received_requests.user",
    //     select:
    //       "name phone email profilePic address businessCategory businessName businessAddress fcmToken userstatus averageRating ratings providerAverageRating userAverageRating  businessDetaile userRating",
    //     options: { lean: true },
    //   })
    //   .lean();
    // console.log(user, "user from get received request");
    // if (!user) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "User not found",
    //   });
    // }
    // // Format response without 'user' wrapper
    // const receivedRequests = user.received_requests.map((req) => ({
    //   _id: req.user?._id,
    //   requestId: req.requestId,
    //   name: req.user?.name,
    //   phone: req.user?.phone,
    //   email: req.user?.email,
    //   profilePic: req.user?.profilePic,
    //   address: req.user?.address,
    //   businessCategory: req.user?.businessCategory,
    //   businessName: req.user?.businessName,
    //   businessAddress: req.user?.businessAddress,
    //   fcmToken: req.user?.fcmToken,
    //   userstatus: req.user?.userstatus,
    //   averageRating: req.user?.averageRating,
    //   ratings: req.user?.ratings,
    //   providerAverageRating: req.user?.providerAverageRating,
    //   // providerRatings: req.user?.providerRatings,
    //   userAverageRating: req.user?.userAverageRating,
    //   // userRatings: req.user?.userRatings,
    //   businessDetaile: req.user?.businessDetaile,
    //   received_requests: req.user?.received_requests,
    //   status: req.status,
    //   date: req.date,
    //   userrating: req.userrating,
    // }));
    // // console.log(receivedRequests, "received requests mobile");

    const receivedRequestsData = await Request.find({ receiver: userId })
      .populate({
        path: "sender",
        select:
          "name phone email profilePic address businessCategory businessName businessAddress fcmToken userstatus providerAverageRating userAverageRating businessDetaile userRating",
        options: { lean: true },
      })
      .lean();

    // Map to a clean response format
    const receivedRequests = receivedRequestsData.map((req) => ({
      requestId: req._id,
      senderId: req.sender?._id,
      name: req.sender?.name,
      phone: req.sender?.phone,
      email: req.sender?.email,
      profilePic: req.sender?.profilePic,
      address: req.sender?.address,
      businessCategory: req.sender?.businessCategory,
      businessName: req.sender?.businessName,
      businessAddress: req.sender?.businessAddress,
      fcmToken: req.sender?.fcmToken,
      userstatus: req.sender?.userstatus,
      providerAverageRating: req.sender?.providerAverageRating,
      userAverageRating: req.sender?.userAverageRating,
      businessDetaile: req.sender?.businessDetaile,
      status: req.status,
      date: req.date,
      userRatingbyprovider: req.userRatingbyprovider, // from Request model
      providerRatingbySender: req.providerRatingbySender, // from Request model
    }));

    return res.status(200).json({
      success: true,
      message: "📥 Received requests retrieved successfully!",
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
          notifications: [],
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
  getUserRequests,
  getSentRequests,
  getReceivedRequests,
  getUsersWithRequestsCounts,
  getSendedRequestsMobile,
  getReceivedRequestsMobile,
  updateRequestStatusMobile,
};
