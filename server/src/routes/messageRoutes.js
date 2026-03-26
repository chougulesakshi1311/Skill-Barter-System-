const express = require("express");
const { body } = require("express-validator");
const { getConversation, sendMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/:requestId", protect, getConversation);
router.post(
  "/:requestId",
  protect,
  [body("text").optional().isString(), body("fileUrl").optional().isString()],
  validate,
  sendMessage
);

module.exports = router;
