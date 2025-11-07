const express = require("express");
const {
  createQuestion,
  getAllQuestions,
  getUserQuestions,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/makeQuestionController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", createQuestion);
router.get("/", authMiddleware, adminMiddleware, getAllQuestions); // Admin only
router.get("/:email", getUserQuestions); // User-specific questions
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

module.exports = router;
