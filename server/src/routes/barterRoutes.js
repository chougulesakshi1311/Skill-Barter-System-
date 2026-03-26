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

router.post(
  "/",
  protect,
  [body("toUser").notEmpty(), body("offeredSkill").notEmpty(), body("requestedSkill").notEmpty()],
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
