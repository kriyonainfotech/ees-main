// routes/remarkRoutes.js
const express = require("express");
const router = express.Router();
const remarkController = require("../controllers/remarkController");
const { verifyToken } = require("../middleware/auth");

router.post("/create", remarkController.addRemark);
router.get("/user/:userId", remarkController.getRemarks);
router.put("/update-status/:remarkId", remarkController.updateRemarkStatus);
router.delete("/delete/:remarkId", remarkController.deleteRemark);

module.exports = router;
