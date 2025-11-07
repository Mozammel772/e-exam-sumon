const express = require("express");
const {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllSubjects);
router.get("/:id", getSubjectById);

// Admin-only routes
router.post("/", authMiddleware, adminMiddleware, createSubject);
router.put("/:id", authMiddleware, adminMiddleware, updateSubject);
router.delete("/:id", authMiddleware, adminMiddleware, deleteSubject);

module.exports = router;
