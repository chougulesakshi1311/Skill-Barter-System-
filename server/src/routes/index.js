const express = require("express");

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const skillRoutes = require("./skillRoutes");
const matchRoutes = require("./matchRoutes");
const barterRoutes = require("./barterRoutes");
const messageRoutes = require("./messageRoutes");
const reviewRoutes = require("./reviewRoutes");
const notificationRoutes = require("./notificationRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const adminRoutes = require("./adminRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/skills", skillRoutes);
router.use("/match", matchRoutes);
router.use("/barter", barterRoutes);
router.use("/messages", messageRoutes);
router.use("/reviews", reviewRoutes);
router.use("/notifications", notificationRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
