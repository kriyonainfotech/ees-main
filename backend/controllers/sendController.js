const admin = require("../config/firebase");
const User = require("../model/user");
const axios = require("axios");

// Endpoint to send notifications
// const sendNotification = async ({
//   senderName,
//   fcmToken,
//   title,
//   message,
//   receiverId,
//   type,
// }) => {
//   if (!fcmToken || !title || !message || !senderName || !receiverId) {
//     console.log("Error: Missing required parameters");
//     return { success: false, error: "Missing required fields." };
//   }

//   try {
//     const notificationPayload = {
//       notification: {
//         title: `${senderName} says: ${title}`,
//         body: message,
//       },
//       token: fcmToken,
//     };

//     // Store notification directly in receiver's notifications array without fetching full document
//     await User.updateOne(
//       { _id: receiverId },
//       {
//         $push: {
//           notifications: {
//             type,
//             senderName,
//             title,
//             message,
//             timestamp: new Date(),
//           },
//         },
//       }
//     );

//     console.log(`Notification saved successfully for receiver: ${receiverId}`);

//     // Send the notification using Firebase Cloud Messaging (FCM)
//     const response = await admin.messaging().send(notificationPayload);
//     console.log("FCM notification sent:", response);

//     return { success: true, response };
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     return { success: false, error: "Failed to send notification." };
//   }
// };

const ONE_SIGNAL_APP_ID = "810605bf-f0d6-4214-b944-14307d1a5240";
const ONE_SIGNAL_API_KEY = "os_v2_app_qedalp7q2zbbjokecqyh2gssic72ov26brbu2ymgmn2wcfcwcxzwbmthuip3pcsk4ynubxcw4ymmhc6ecoimq45vkka4yi7ipvbjtsq";

const sendNotification = async ({
  senderName,
  fcmToken, // OneSignal Player ID
  title,
  message,
  receiverId,
  type,
}) => {
  if (!fcmToken || !title || !message || !senderName || !receiverId) {
    console.log(fcmToken, title, message, senderName, receiverId, "❌ Error: Missing required parameters");
    return { success: false, error: "Missing required fields." };
  }

  try {
    // Store notification in the database (MongoDB)
    await User.updateOne(
      { _id: receiverId },
      {
        $push: {
          notifications: {
            type,
            senderName,
            title,
            message,
            timestamp: new Date(),
          },
        },
      }
    );

    console.log(`✅ Notification saved successfully for receiver: ${receiverId}`);

    // Send notification using OneSignal API
    const notificationPayload = {
      app_id: ONE_SIGNAL_APP_ID,
      include_player_ids: [fcmToken], // OneSignal Player ID
      headings: { en: `${title}` },
      contents: { en: message },
      data: { type, senderName, receiverId },
      chrome_web_icon: "https://res.cloudinary.com/dcfm0aowt/image/upload/v1740812199/2000X2000_WITHOUT_EES_lexnov.png", // Web notification icon
      ios_attachments: { "id": "https://res.cloudinary.com/dcfm0aowt/image/upload/v1740812199/2000X2000_WITHOUT_EES_lexnov.png" }, // iOS notification icon
      small_icon: "ees", 
      // android_channel_id: "EES",
      sound: "ees.mp3",
      // large_icon: "https://res.cloudinary.com/dcfm0aowt/image/upload/v1740812199/2000X2000_WITHOUT_EES_lexnov.png", // Android notification icon
    };

    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      notificationPayload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${ONE_SIGNAL_API_KEY}`,
        },
      }
    );

    console.log("📩 OneSignal notification sent:", response.data);
    return { success: true, response: response.data };
  } catch (error) {
    console.error("❌ Error sending OneSignal notification:", error.response?.data || error.message);
    return { success: false, error: "Failed to send notification." };
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // Assume authentication middleware sets `req.user`
    console.log(userId, "userId");

    const user = await User.findById(userId).select("notifications");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Return the user's notifications
    return res.status(200).json({
      success: true,
      notifications: user.notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching notifications.",
      error: error.message,
    });
  }
};

const getNotificationsMobile = async (req, res) => {
  try {
    const { userId } = req.body; // Expecting userId from the request body

    const user = await User.findById(userId).select("notifications");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    console.log(user, "user");
    // Return the user's notifications
    return res.status(200).json({
      success: true,
      notifications: user.notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching notifications.",
      error: error.message,
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.body;

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required.",
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { notifications: { _id: notificationId } } }, // ✅ Removes the matching notification
      { new: true } // Returns the updated user document
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the notification.",
      error: error.message,
    });
  }
};

module.exports = {
  sendNotification,
  getNotifications,
  deleteNotification,
  getNotificationsMobile,
};
