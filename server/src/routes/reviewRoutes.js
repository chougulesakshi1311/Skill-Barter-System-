const express = require("express");
const { body } = require("express-validator");
const { addReview, getUserReviews } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router();

router.post(
  "/:requestId",
  protect,
  [body("revieweeId").notEmpty(), body("rating").isInt({ min: 1, max: 5 }), body("comment").optional().isString()],
  validate,
  addReview
);
router.get("/user/:userId", protect, getUserReviews);

module.exports = router;
