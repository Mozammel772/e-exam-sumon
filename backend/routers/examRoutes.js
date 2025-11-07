const express = require("express");
const {
  createExam,
  getExams,
  updateExam,
  deleteExam,
} = require("../controllers/examController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Public route
router.get("/", getExams);

// Admin-only routes
router.post("/", authMiddleware, adminMiddleware, createExam);
router.put("/:id", authMiddleware, adminMiddleware, updateExam);
router.delete("/:id", authMiddleware, adminMiddleware, deleteExam);

module.exports = router;
