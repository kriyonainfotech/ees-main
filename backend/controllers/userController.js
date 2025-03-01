const UserModel = require("../model/user");

const updateFcmToken = async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { fcmToken },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "FCM token updated successfully",
    });
  } catch (error) {
    console.error("Error updating FCM token:", error);
    res.status(500).json({
      success: false,
      message: "Error updating FCM token",
    });
  }
};

module.exports = {
  updateFcmToken,
};
