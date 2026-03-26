const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Expert"],
      default: "Beginner",
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBlocked: { type: Boolean, default: false },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    skillsOffered: [skillSchema],
    skillsWanted: [skillSchema],
    availabilitySlots: [
      {
        day: String,
        startTime: String,
        endTime: String,
      },
    ],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.pre("save", async function save() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateResetToken = function generateResetToken() {
  const raw = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(raw).digest("hex");
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  return raw;
};

module.exports = mongoose.model("User", userSchema);
