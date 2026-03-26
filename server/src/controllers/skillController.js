const asyncHandler = require("../utils/asyncHandler");
const Skill = require("../models/Skill");

const upsertSkillFromName = async (name) => {
  if (!name) return null;
  return Skill.findOneAndUpdate(
    { name: name.trim().toLowerCase() },
    { $inc: { usageCount: 1 }, $setOnInsert: { tags: [] } },
    { new: true, upsert: true }
  );
};

const suggestSkills = asyncHandler(async (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const skills = await Skill.find({ name: { $regex: q, $options: "i" } })
    .sort({ usageCount: -1 })
    .limit(10);

  res.json({ success: true, skills });
});

const createSkill = asyncHandler(async (req, res) => {
  const { name, tags = [] } = req.body;
  const skill = await Skill.findOneAndUpdate(
    { name: name.trim().toLowerCase() },
    { $set: { tags }, $inc: { usageCount: 1 } },
    { new: true, upsert: true }
  );

  res.status(201).json({ success: true, skill });
});

module.exports = {
  upsertSkillFromName,
  suggestSkills,
  createSkill,
};
