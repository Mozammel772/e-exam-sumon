const express = require("express");
const {
  createSubscription,
  getSubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription,
} = require("../controllers/questionCreationSubscription");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", createSubscription);


router.get("/", authMiddleware, adminMiddleware, getSubscriptions);
router.get("/:id", authMiddleware, adminMiddleware, getSubscription);
router.put("/:id", authMiddleware, adminMiddleware, updateSubscription);
router.delete("/:id", authMiddleware, adminMiddleware, deleteSubscription);

module.exports = router;
