const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const BarterRequest = require("../models/BarterRequest");

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("name email role isBlocked createdAt lastActiveAt").sort({ createdAt: -1 });
  res.json({ success: true, users });
});

const blockUnblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isBlocked } = req.body;

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.isBlocked = Boolean(isBlocked);
  await user.save();

  res.json({ success: true, user });
});

const getActivities = asyncHandler(async (req, res) => {
  const requests = await BarterRequest.find()
    .populate("fromUser", "name")
    .populate("toUser", "name")
    .sort({ updatedAt: -1 })
    .limit(200);

  res.json({ success: true, activities: requests });
});

module.exports = {
  listUsers,
  blockUnblockUser,
  getActivities,
};
