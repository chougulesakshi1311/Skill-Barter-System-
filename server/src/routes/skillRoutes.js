const express = require("express");
const { body } = require("express-validator");
const { suggestSkills, createSkill } = require("../controllers/skillController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/suggest", protect, suggestSkills);
router.post(
  "/",
  protect,
  [body("name").notEmpty(), body("tags").optional().isArray()],
  validate,
  createSkill
);

module.exports = router;
