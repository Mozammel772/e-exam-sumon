const express = require("express");
const {
  createCQQuestion,
  getCQQuestions,
  getCQQuestionById,
  updateCQQuestion,
  deleteCQQuestion,
} = require("../controllers/cqQuestionController.js");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// CRUD Routes
router
  .route("/")
  .post(authMiddleware, adminMiddleware, createCQQuestion)
  .get(getCQQuestions);

router
  .route("/:id")
  .get(getCQQuestionById)
  .put(authMiddleware, adminMiddleware, updateCQQuestion)
  .delete(authMiddleware, adminMiddleware, deleteCQQuestion);

module.exports = router;
