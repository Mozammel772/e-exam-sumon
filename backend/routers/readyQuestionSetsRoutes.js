const express = require("express");
const router = express.Router();
const {
  createReadyQuestionSet,
  getAllReadyQuestionSets,
  getReadyQuestionSetById,
  updateReadyQuestionSet,
  deleteReadyQuestionSet,
  getReadyQuestionSetsByEmail,
} = require("../controllers/readyQuestionSetsController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

router.post("/", createReadyQuestionSet);
router.get("/", authMiddleware, adminMiddleware, getAllReadyQuestionSets);
router.get("/by-email", getReadyQuestionSetsByEmail);
router.get("/:id", getReadyQuestionSetById);
router.put("/:id", authMiddleware, adminMiddleware, updateReadyQuestionSet);
router.delete("/:id", authMiddleware, adminMiddleware, deleteReadyQuestionSet);

module.exports = router;
