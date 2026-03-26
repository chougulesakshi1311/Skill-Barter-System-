const express = require("express");
const { listUsers, blockUnblockUser, getActivities } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/users", listUsers);
router.patch("/users/:id/block", blockUnblockUser);
router.get("/activities", getActivities);

module.exports = router;
