const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

exports.authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1].trim();
    if (!token) {
      return res.status(401).json({ msg: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expired" });
    }

    return res.status(401).json({ msg: "Invalid token" });
  }
};

exports.adminMiddleware = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied: Admins only" });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error.message);
    return res.status(500).json({ msg: "Server error" });
  }
};
