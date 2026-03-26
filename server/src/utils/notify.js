const Notification = require("../models/Notification");
const { getSocket } = require("./socket");

const createNotification = async ({ userId, type, title, body, metadata = {} }) => {
  const notification = await Notification.create({
    user: userId,
    type,
    title,
    body,
    metadata,
  });

  const io = getSocket();
  if (io) {
    io.to(String(userId)).emit("notification:new", notification);
  }

  return notification;
};

module.exports = {
  createNotification,
};
