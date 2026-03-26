const asyncHandler = require("../utils/asyncHandler");
const BarterRequest = require("../models/BarterRequest");
const Notification = require("../models/Notification");
const User = require("../models/User");

const getUserDashboard = asyncHandler(async (req, res) => {
  const activeRequests = await BarterRequest.countDocuments({
    $or: [{ fromUser: req.user._id }, { toUser: req.user._id }],
    status: { $in: ["pending", "accepted"] },
  });

  const completedBarters = await BarterRequest.countDocuments({
    $or: [{ fromUser: req.user._id }, { toUser: req.user._id }],
    status: "completed",
  });

  const matchesFound = await User.countDocuments({
    _id: { $ne: req.user._id },
    "skillsOffered.name": { $in: req.user.skillsWanted.map((s) => s.name) },
  });

  const unreadNotifications = await Notification.countDocuments({ user: req.user._id, isRead: false });

  res.json({
    success: true,
    metrics: {
      activeRequests,
      completedBarters,
      matchesFound,
      unreadNotifications,
    },
  });
});

const getAdminDashboard = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeBarters = await BarterRequest.countDocuments({ status: { $in: ["pending", "accepted"] } });
  const completedBarters = await BarterRequest.countDocuments({ status: "completed" });
  const blockedUsers = await User.countDocuments({ isBlocked: true });

  res.json({
    success: true,
    metrics: {
      totalUsers,
      activeBarters,
      completedBarters,
      blockedUsers,
    },
  });
});

module.exports = {
  getUserDashboard,
  getAdminDashboard,
};
