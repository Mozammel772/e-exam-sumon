const express = require("express");
const {
  register,
  login,
  logout,
  verifyEmail,
  getAllUsers,
  updateUserProfile,
  deleteUser,
  getUserByEmail,
  updateFullUserProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");
const { check } = require("express-validator");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User = require("../models/UserModel");
const generateJWT = require("../utils/generateJWT");

const router = express.Router();

router.post(
  "/register",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  register
);

router.post("/login", login);
router.post("/logout", logout);

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

// router.get("/profile", authMiddleware, async (req, res) => {
//   try {
//     const userData = req.user;

//     res.json({ user: userData });
//   } catch (error) {
//     console.error("Error fetching profile:", error);
//     res.status(500).json({ msg: "Server error" });
//   }
// });
router.get("/profile", async (req, res) => {
  try {
    const userData = req.user;

    res.json({ user: userData });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// For Firebase implementation

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = new User({
        email: payload.email,
        name: payload.name,
        role: "user",
        authProvider: "google",
      });
      await user.save();
    }

    const jwtToken = generateJWT(user);

    res.json({ token: jwtToken, user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

router.get("/profile/:email", getUserByEmail);

router.put("/update-profile", updateUserProfile);

router.put("/user/profile/full-update", authMiddleware, updateFullUserProfile);
router.post("/forgot-password", forgotPassword);

// Admin only route
router.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ msg: "Welcome, Admin!" });
});

// Email verification route
router.get("/verify/:token", verifyEmail);
router.put("/reset-password/:token", resetPassword);

router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
