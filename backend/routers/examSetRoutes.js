// routes/examSetRoutes.js
const express = require("express");
const router = express.Router();
const examSetController = require("../controllers/examSetController");

router.post("/", examSetController.createExamSet);
router.get("/", examSetController.getAllExamSets);
router.get("/:id", examSetController.getExamSetById);
router.get("/user/:email", examSetController.getExamSetsByEmail);
router.get("/:email/:id", examSetController.getSingleExamSet);
router.patch("/update-questions/:id", examSetController.updateQuestion);
router.patch(
  "/demo/update-questions/:id",
  examSetController.demoUpdateQuestion
);
router.delete("/:id", examSetController.deleteExamSet);

module.exports = router;
