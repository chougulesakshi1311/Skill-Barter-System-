const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  [body("name").notEmpty(), body("email").isEmail(), body("password").isLength({ min: 6 })],
  validate,
  register
);

router.post(
  "/login",
  authLimiter,
  [body("email").isEmail(), body("password").notEmpty()],
  validate,
  login
);

router.get("/me", protect, getMe);
router.post("/forgot-password", authLimiter, [body("email").isEmail()], validate, forgotPassword);
router.post(
  "/reset-password/:token",
  [body("password").isLength({ min: 6 })],
  validate,
  resetPassword
);

module.exports = router;
