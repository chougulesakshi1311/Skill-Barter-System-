const mongoose = require("mongoose");

const barterRequestSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    offeredSkill: { type: String, required: true },
    requestedSkill: { type: String, required: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "canceled", "completed"],
      default: "pending",
    },
    completedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("BarterRequest", barterRequestSchema);
