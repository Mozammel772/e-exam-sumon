const express = require("express");
const {
  createChapter,
  getChapters,
  updateChapter,
  deleteChapter,
  addQuestion,
  deleteQuestion,
  getQuestions,
  getChapterById,
  getChaptersById,
  updateQuestion,
  addCQQuestion,
  getAQuestion,
  getAllChapters,
  addShortQuestion,
} = require("../controllers/chapterController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Public route
router.get("/", getChapters);

router.get("/all", getAllChapters);
// Define the GET API route
router.get("/questions", getChaptersById);

// Admin-only routes
router.post("/", authMiddleware, adminMiddleware, createChapter);
router.get("/:id", getChapterById);
router.put("/:id", authMiddleware, adminMiddleware, updateChapter);

router.delete("/:id", authMiddleware, adminMiddleware, deleteChapter);
router.post("/:id/question", authMiddleware, adminMiddleware, addQuestion);
router.post("/:id/cq-question", authMiddleware, adminMiddleware, addCQQuestion);
router.post(
  "/:id/short-question",
  authMiddleware,
  adminMiddleware,
  addShortQuestion
);
router.get("/:chapterId/:questionId", getAQuestion);
router.delete(
  "/:chapterId/question/:questionId",
  authMiddleware,
  adminMiddleware,
  deleteQuestion
);
router.put(
  "/:chapterId/question/:questionId",
  authMiddleware,
  adminMiddleware,
  updateQuestion
);

module.exports = router;
