const crypto = require("crypto");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const { generateToken } = require("../utils/token");
const { sendResetPasswordEmail } = require("../utils/mailer");

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  bio: user.bio,
  location: user.location,
  profilePicture: user.profilePicture,
  skillsOffered: user.skillsOffered,
  skillsWanted: user.skillsWanted,
  favorites: user.favorites,
  availabilitySlots: user.availabilitySlots,
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("Email already in use");
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({ success: true, token, user: sanitizeUser(user) });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  if (user.isBlocked) {
    res.status(403);
    throw new Error("Your account is blocked");
  }

  const ok = await user.comparePassword(password);
  if (!ok) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id);
  res.json({ success: true, token, user: sanitizeUser(user) });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: sanitizeUser(req.user) });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select("+resetPasswordToken +resetPasswordExpires");
  if (!user) {
    return res.json({ success: true, message: "If email exists, reset instructions were sent" });
  }

  const resetToken = user.generateResetToken();
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendResetPasswordEmail({ to: user.email, resetUrl });

  return res.json({ success: true, message: "Reset email sent" });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpires");

  if (!user) {
    res.status(400);
    throw new Error("Token is invalid or expired");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
});

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
};
