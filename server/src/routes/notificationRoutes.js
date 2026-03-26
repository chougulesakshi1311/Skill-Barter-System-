const express = require("express");
const { getMyNotifications, markRead } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMyNotifications);
router.patch("/:id/read", protect, markRead);

module.exports = router;
