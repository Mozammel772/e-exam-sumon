const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

router.post("/", subscriptionController.createSubscription);
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  subscriptionController.getAllSubscriptions
);
router.get("/user/:email", subscriptionController.getUserSubscriptionAndInfo);
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  subscriptionController.getSubscriptionById
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  subscriptionController.updateSubscription
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  subscriptionController.deleteSubscription
);
router.patch(
  "/:subscriptionId/approve-payment/:paymentId",
  authMiddleware,
  subscriptionController.approveSinglePayment
);
module.exports = router;
