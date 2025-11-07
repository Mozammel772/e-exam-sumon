const express = require("express");
const {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
} = require("../controllers/classController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Public route
router.get("/", getAllClasses);
router.get("/:id", getClassById);

// Admin-only routes
router.post("/", authMiddleware, adminMiddleware, createClass);
router.put("/:id", authMiddleware, adminMiddleware, updateClass);
router.delete("/:id", authMiddleware, adminMiddleware, deleteClass);

module.exports = router;
