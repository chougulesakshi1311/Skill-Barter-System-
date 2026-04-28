const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");
const BarterRequest = require("../models/BarterRequest");
const { createNotification } = require("../utils/notify");
const { REQUEST_STATUS } = require("../utils/constants");

const createRequest = asyncHandler(async (req, res) => {
  const { toUser, offeredSkill, requestedSkill, message } = req.body;

  // Convert toUser to ObjectId
  const toUserId = new mongoose.Types.ObjectId(toUser);

  if (String(toUserId) === String(req.user._id)) {
    res.status(400);
    throw new Error("Cannot send a request to yourself");
  }

  // Check if target user exists
  const User = require("../models/User");
  const targetUser = await User.findById(toUserId);
  if (!targetUser) {
    res.status(404);
    throw new Error("Target user not found");
  }

  const request = await BarterRequest.create({
    fromUser: req.user._id,
    toUser: toUserId,
    offeredSkill,
    requestedSkill,
    message,
  });

  await createNotification({
    userId: toUserId,
    type: "request",
    title: "New barter request",
    body: `${req.user.name} sent you a barter request`,
    metadata: { requestId: request._id },
  });

  res.status(201).json({ success: true, request });
});

const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await BarterRequest.find({
    $or: [{ fromUser: req.user._id }, { toUser: req.user._id }],
  })
    .populate("fromUser", "name profilePicture")
    .populate("toUser", "name profilePicture")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: requests.length, requests });
});

const updateRequestStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const request = await BarterRequest.findById(id).populate("fromUser", "name").populate("toUser", "name");
  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  const allowed = [REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.REJECTED, REQUEST_STATUS.COMPLETED];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error("Invalid status update");
  }

  // Only the recipient can accept/reject
  if (status === REQUEST_STATUS.ACCEPTED || status === REQUEST_STATUS.REJECTED) {
    if (String(request.toUser._id) !== String(req.user._id)) {
      res.status(403);
      throw new Error("Only recipient can accept/reject requests");
    }
  }

  // Only participants can complete
  if (status === REQUEST_STATUS.COMPLETED) {
    const isParticipant =
      String(request.toUser._id) === String(req.user._id) ||
      String(request.fromUser._id) === String(req.user._id);
    if (!isParticipant) {
      res.status(403);
      throw new Error("Only participants can complete barter");
    }
    request.completedAt = new Date();
  }

  request.status = status;
  await request.save();

  const target =
    String(req.user._id) === String(request.toUser._id)
      ? request.fromUser._id
      : request.toUser._id;

  await createNotification({
    userId: target,
    type: "request-status",
    title: "Barter request updated",
    body: `Request status changed to ${status}`,
    metadata: { requestId: request._id, status },
  });

  res.json({ success: true, request });
});

const cancelRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const request = await BarterRequest.findById(id).populate("toUser", "name");
  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (String(request.fromUser) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Only sender can cancel request");
  }

  if (request.status !== REQUEST_STATUS.PENDING) {
    res.status(400);
    throw new Error("Only pending requests can be canceled");
  }

  request.status = REQUEST_STATUS.CANCELED;
  await request.save();

  // Notify the recipient
  await createNotification({
    userId: request.toUser._id,
    type: "request-canceled",
    title: "Barter request canceled",
    body: "A barter request has been canceled",
    metadata: { requestId: request._id },
  });

  res.json({ success: true, request });
});

module.exports = {
  createRequest,
  getMyRequests,
  updateRequestStatus,
  cancelRequest,
};
