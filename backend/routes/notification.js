const express = require("express");
const axios = require("axios");

const router = express.Router();

const ONE_SIGNAL_APP_ID = "810605bf-f0d6-4214-b944-14307d1a5240";
const ONE_SIGNAL_API_KEY = "tt6i3vcswupwut7dek6b6hay6";

router.post("/send-notification", async (req, res) => {
    try {
        const { title, message, userId } = req.body; // You can send to a specific user

        const notificationData = {
            app_id: ONE_SIGNAL_APP_ID,
            contents: { en: message },
            headings: { en: title },
            // included_segments: ["Subscribed Users"], // Sends to all users
            // OR Send to a specific user:
            include_external_user_ids: [userId]
        };

        const response = await axios.post("https://onesignal.com/api/v1/notifications", notificationData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${ONE_SIGNAL_API_KEY}`
            }
        });

        res.json({ success: true, response: response.data });
    } catch (error) {
        console.error("OneSignal Error:", error.response?.data || error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
