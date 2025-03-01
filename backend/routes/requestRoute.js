const express = require("express");
const {
  sentRequest,
  deleteRequest,
  sentRequestMobile,
  getSendedRequestsMobile,
  getReceivedRequestsMobile,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus,
  getUsersWithRequestsCounts,
  updateRequestStatusMobile,
  getUserRequests,
} = require("../controllers/requestController");
const { verifyToken } = require("../middleware/auth");
const userModel = require("../model/user");
const {
  getNotifications,
  deleteNotification,
  getNotificationsMobile,
} = require("../controllers/sendController");
const { fixUserData } = require("../controllers/AuthController2");
const router = express.Router();
router.post("/sentRequest", verifyToken, sentRequest);
router.post("/sentRequestMobile", sentRequestMobile);

router.get("/getUserRequests", verifyToken, getUserRequests);

router.get("/getSentRequests", verifyToken, getSentRequests);
router.get("/getReceivedRequests", verifyToken, getReceivedRequests);

router.post("/updateRequestStatus", verifyToken, updateRequestStatus);
router.post("/updateStatusMobile", updateRequestStatusMobile);

router.get("/getNotifications", verifyToken, getNotifications);
router.post("/getNotificationsMobile", getNotificationsMobile);

router.delete("/deleteNotification", verifyToken, deleteNotification);

router.delete("/deleteRequest", deleteRequest);

router.post("/getSendedRequestsMobile", getSendedRequestsMobile);
router.post("/getReceivedRequestsMobile", getReceivedRequestsMobile);
router.post("/count", getUsersWithRequestsCounts);

router.delete("/deleteSentRequests", async (req, res) => {
  try {
    const { userId } = req.body;

    // Delete all sent requests for the user
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: { received_requests: [] } }, // Empty the array
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "All sent requests have been deleted.",
      sendedRequests: [], // Return empty array
    });
  } catch (error) {
    console.error("Error deleting sent requests:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

module.exports = router;
