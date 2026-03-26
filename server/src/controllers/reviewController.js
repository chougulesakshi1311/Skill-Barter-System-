const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");
const BarterRequest = require("../models/BarterRequest");
const Review = require("../models/Review");

const addReview = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { revieweeId, rating, comment } = req.body;

  const request = await BarterRequest.findById(requestId);
  if (!request || request.status !== "completed") {
    res.status(400);
    throw new Error("Reviews allowed only for completed requests");
  }

  const participants = [String(request.fromUser), String(request.toUser)];
  if (!participants.includes(String(req.user._id)) || !participants.includes(String(revieweeId))) {
    res.status(403);
    throw new Error("Invalid review participants");
  }

  const review = await Review.create({
    barterRequest: requestId,
    reviewer: req.user._id,
    reviewee: revieweeId,
    rating,
    comment,
  });

  res.status(201).json({ success: true, review });
});

const getUserReviews = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const reviews = await Review.find({ reviewee: userId })
    .populate("reviewer", "name profilePicture")
    .sort({ createdAt: -1 });

  const stats = await Review.aggregate([
    { $match: { reviewee: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$reviewee", avgRating: { $avg: "$rating" }, total: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    reviews,
    averageRating: Number((stats[0]?.avgRating || 0).toFixed(2)),
    totalReviews: stats[0]?.total || 0,
  });
});

module.exports = {
  addReview,
  getUserReviews,
};
