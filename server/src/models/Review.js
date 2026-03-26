const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    barterRequest: { type: mongoose.Schema.Types.ObjectId, ref: "BarterRequest", required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

reviewSchema.index({ barterRequest: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
