const express = require("express");
const { body } = require("express-validator");
const {
  getPublicProfile,
  updateMyProfile,
  searchUsers,
  toggleFavorite,
  getRecommendations,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/search", protect, searchUsers);
router.get("/recommendations", protect, getRecommendations);
router.get("/:id", protect, getPublicProfile);
router.patch(
  "/me",
  protect,
  [
    body("name").optional().isString(),
    body("bio").optional().isString(),
    body("skillsOffered").optional().isArray(),
    body("skillsWanted").optional().isArray(),
  ],
  validate,
  updateMyProfile
);
router.post("/:id/favorite", protect, toggleFavorite);

module.exports = router;
