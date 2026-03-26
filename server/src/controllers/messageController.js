const asyncHandler = require("../utils/asyncHandler");
const Message = require("../models/Message");
const BarterRequest = require("../models/BarterRequest");
const { createNotification } = require("../utils/notify");
const { getSocket } = require("../utils/socket");

const getConversation = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const request = await BarterRequest.findById(requestId);
  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  const allowed =
    String(request.fromUser) === String(req.user._id) ||
    String(request.toUser) === String(req.user._id);

  if (!allowed || request.status !== "accepted") {
    res.status(403);
    throw new Error("Chat only available for accepted request participants");
  }

  const messages = await Message.find({ barterRequest: requestId })
    .populate("sender", "name profilePicture")
    .populate("receiver", "name profilePicture")
    .sort({ createdAt: 1 });

  res.json({ success: true, messages });
});

const sendMessage = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { text, fileUrl } = req.body;

  const request = await BarterRequest.findById(requestId);
  if (!request || request.status !== "accepted") {
    res.status(400);
    throw new Error("Message can only be sent on accepted requests");
  }

  const isFrom = String(request.fromUser) === String(req.user._id);
  const isTo = String(request.toUser) === String(req.user._id);

  if (!isFrom && !isTo) {
    res.status(403);
    throw new Error("Not a participant");
  }

  const receiver = isFrom ? request.toUser : request.fromUser;

  const message = await Message.create({
    barterRequest: requestId,
    sender: req.user._id,
    receiver,
    text,
    fileUrl,
  });

  const populated = await message.populate("sender receiver", "name profilePicture");

  await createNotification({
    userId: receiver,
    type: "message",
    title: "New message",
    body: text ? text.slice(0, 80) : "Sent an attachment",
    metadata: { requestId },
  });

  const io = getSocket();
  if (io) {
    io.to(String(requestId)).emit("chat:message", populated);
  }

  res.status(201).json({ success: true, message: populated });
});

module.exports = {
  getConversation,
  sendMessage,
};
