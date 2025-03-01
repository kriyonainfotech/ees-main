const express = require("express");
const router = express.Router();
const { updateFcmToken } = require("../controllers/userController");

router.post("/update-fcm-token", updateFcmToken);

module.exports = router;
