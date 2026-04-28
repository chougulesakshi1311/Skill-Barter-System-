const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const { buildPairMatches, buildChainMatches } = require("../utils/matchingEngine");

const getMatches = asyncHandler(async (req, res) => {
  const users = await User.find({ isBlocked: false }).select(
    "_id name profilePicture bio location skillsOffered skillsWanted lastActiveAt"
  );

  const currentUser = users.find((u) => String(u._id) === String(req.user._id));
  if (!currentUser) {
    res.status(404);
    throw new Error("User not found for matching");
  }

  const pairMatches = buildPairMatches(currentUser, users).slice(0, 20);
  const chainMatches = buildChainMatches(currentUser, users, 4);

  res.json({
    success: true,
    pairMatches: pairMatches.map((m) => ({
      user: m.user,
      matchPercentage: m.score,
    })),
    chainMatches: chainMatches.map((chain) => ({
      matchPercentage: chain.averageScore,
      users: chain.users,
      userIds: chain.path,
    })),
  });
});

module.exports = {
  getMatches,
};
