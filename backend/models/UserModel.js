const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    subscription: { type: Boolean, default: false },
    payment: { type: Object, default: false },
    isVerified: { type: Boolean, default: true },
    verificationToken: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    addresses: {
      divisions: { type: String, default: "" },
      districts: { type: String, default: "" },
      upazillas: { type: String, default: "" },
      organizations: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
  next();
});

UserSchema.index({ email: 1 });

module.exports = mongoose.model("User", UserSchema);
