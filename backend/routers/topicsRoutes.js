const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topicsController");

router.post("/", topicController.createTopic);
router.get("/", topicController.getTopics);
router.get("/:id", topicController.getTopicById);
router.put("/:id", topicController.updateTopic);
router.delete("/:id", topicController.deleteTopic);

module.exports = router;
