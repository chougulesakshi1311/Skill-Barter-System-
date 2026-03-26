const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    barterRequest: { type: mongoose.Schema.Types.ObjectId, ref: "BarterRequest", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    readAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
