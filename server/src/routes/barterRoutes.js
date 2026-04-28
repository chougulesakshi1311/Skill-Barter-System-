const express = require("express");
const { body } = require("express-validator");
const {
  createRequest,
  getMyRequests,
  updateRequestStatus,
  cancelRequest,
} = require("../controllers/barterController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router();
const mongoose = require("mongoose");

router.post(
  "/",
  protect,
  [
    body("toUser")
      .notEmpty().withMessage("Target user is required")
      .custom(val => mongoose.Types.ObjectId.isValid(val)).withMessage("Invalid user ID format"),
    body("offeredSkill").notEmpty().withMessage("Offered skill is required"),
    body("requestedSkill").notEmpty().withMessage("Requested skill is required"),
  ],
  validate,
  createRequest
);
router.get("/", protect, getMyRequests);
router.patch(
  "/:id/status",
  protect,
  [body("status").isIn(["accepted", "rejected", "completed"])],
  validate,
  updateRequestStatus
);
router.patch("/:id/cancel", protect, cancelRequest);

module.exports = router;
