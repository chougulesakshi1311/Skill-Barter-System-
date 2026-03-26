const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const Review = require("../models/Review");

const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -resetPasswordToken -resetPasswordExpires");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const ratingAgg = await Review.aggregate([
    { $match: { reviewee: user._id } },
    {
      $group: {
        _id: "$reviewee",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const stats = ratingAgg[0] || { avgRating: 0, totalReviews: 0 };
  res.json({
    success: true,
    user,
    rating: {
      avgRating: Number((stats.avgRating || 0).toFixed(2)),
      totalReviews: stats.totalReviews || 0,
    },
  });
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const updates = [
    "name",
    "bio",
    "location",
    "profilePicture",
    "skillsOffered",
    "skillsWanted",
    "availabilitySlots",
  ];

  updates.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.user[field] = req.body[field];
    }
  });

  await req.user.save();
  res.json({ success: true, user: req.user });
});

const searchUsers = asyncHandler(async (req, res) => {
  const { skill, location, level, topRated, recentlyActive } = req.query;
  const query = { isBlocked: false };

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (skill) {
    query.$or = [
      { "skillsOffered.name": { $regex: skill, $options: "i" } },
      { "skillsWanted.name": { $regex: skill, $options: "i" } },
      { "skillsOffered.tags": { $in: [new RegExp(skill, "i")] } },
    ];
  }

  if (level) {
    query["skillsOffered.level"] = level;
  }

  let users = await User.find(query).select("-password -resetPasswordToken -resetPasswordExpires");

  if (recentlyActive === "true") {
    users = users.sort((a, b) => new Date(b.lastActiveAt) - new Date(a.lastActiveAt));
  }

  if (topRated === "true") {
    const userIds = users.map((u) => u._id);
    const reviews = await Review.aggregate([
      { $match: { reviewee: { $in: userIds } } },
      { $group: { _id: "$reviewee", avg: { $avg: "$rating" } } },
    ]);
    const scoreMap = new Map(reviews.map((r) => [String(r._id), r.avg]));
    users = users.sort((a, b) => (scoreMap.get(String(b._id)) || 0) - (scoreMap.get(String(a._id)) || 0));
  }

  res.json({ success: true, count: users.length, users });
});

const toggleFavorite = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  const index = req.user.favorites.findIndex((id) => String(id) === String(targetId));

  if (index >= 0) {
    req.user.favorites.splice(index, 1);
  } else {
    req.user.favorites.push(targetId);
  }

  await req.user.save();
  res.json({ success: true, favorites: req.user.favorites });
});

const getRecommendations = asyncHandler(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id }, isBlocked: false }).select(
    "name profilePicture location skillsOffered skillsWanted"
  );

  const wanted = req.user.skillsWanted.map((s) => s.name.toLowerCase());

  const ranked = users
    .map((user) => {
      const offered = user.skillsOffered.map((s) => s.name.toLowerCase());
      const overlap = offered.filter((s) => wanted.includes(s)).length;
      const score = overlap / Math.max(wanted.length || 1, 1);
      return { user, score: Math.round(score * 100) };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  res.json({ success: true, recommendations: ranked });
});

module.exports = {
  getPublicProfile,
  updateMyProfile,
  searchUsers,
  toggleFavorite,
  getRecommendations,
};
