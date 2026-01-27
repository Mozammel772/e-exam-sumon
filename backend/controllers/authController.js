const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send Verification Email
const sendVerificationEmail = async (user) => {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  user.verificationToken = verificationToken;
  await user.save();

  const verificationUrl = `https://api.eexamapp.com/api/auth/verify/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: user.email,
    subject: "Verify Your Email",
    text: `Click the following link to verify your email: ${verificationUrl}`,
    html: `<p>Click the link below to verify your email:</p>
               <a href="${verificationUrl}">${verificationUrl}</a>`,
  };

  await transporter.sendMail(mailOptions);
};

// User Registration
exports.register = async (req, res) => {
  const { userName, email, password } = req.body;

  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check existing user
    if (await User.findOne({ email })) {
      return res.status(409).json({ msg: "User already exists" });
    }

    // Create and save user
    const user = new User({ userName, email, password });
    await user.save();

    // Send verification email with rollback
    try {
      await sendVerificationEmail(user);
    } catch (emailError) {
      await User.deleteOne({ _id: user._id });
      throw new Error("Verification email failed to send");
    }

    res.status(201).json({
      msg: "Registration successful. Please check your email.",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    const statusCode = error.message.includes("email") ? 502 : 500;
    res.status(statusCode).json({
      msg: error.message,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }
};

// Email Verification
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = "";
    await user.save();

    res.setHeader("Cache-Control", "no-store");
    res
      .status(200)
      .json({ msg: "Email verified successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ msg: "Invalid email or password" });

    if (!user.isVerified)
      return res.status(401).json({ msg: "Please verify your email first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, msg: "Login successful", user });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users, exclude passwords
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Logout User
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logged out successfully" });
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { email, addresses, subscription, payment, userName } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { addresses, subscription, payment, userName } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found with this email" });
    }

    res
      .status(200)
      .json({ msg: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// controller/userController.js

exports.updateFullUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Ensure this comes from authenticated middleware

    // Destructure fields from the request body
    const {
      userName,
      email,
      addresses,
      subscription,
      payment,
      role,
      isVerified,
    } = req.body;

    // Prepare update object
    const updateData = {
      userName,
      email,
      addresses,
      subscription,
      payment,
      role,
      isVerified,
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "✅ Full profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating full user profile:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from request params
    const requesterId = req.user.userId; // ID from JWT token
    const requesterRole = req.user.role; // Role from JWT token

    // Check if the requester is either an admin or the same user
    if (requesterId !== userId && requesterRole !== "admin") {
      return res.status(403).json({ msg: "Unauthorized to delete this user" });
    }

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get User Profile by Email
exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email }).select(
      "-password -verificationToken"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.setHeader("Cache-Control", "no-store"); // Prevent browser caching
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // 3. Set token with expiration (10 minutes)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create reset URL
    const resetUrl = `https://e-question-frontend.vercel.app/reset-password/${resetToken}`;

    // Email content
    const message = `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 10 minutes.</p>
    `;

    // Send email
    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: message,
    });

    res
      .status(200)
      .json({ success: true, message: "Reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;

    // Validate passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    // 2. Find user by plain token and check expiration
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // 3. Update password and clear token
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
