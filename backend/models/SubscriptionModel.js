const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    packages: [{ type: String, required: true }],
    price: { type: String, required: true },
    isPremium: { type: Boolean, default: false },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true },
    isApproved: { type: Boolean, required: false },
    subscriptionValidity: {
      type: Date,
      default: () => {
        const now = new Date();
        now.setFullYear(now.getFullYear() + 1);
        return now;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", SubscriptionSchema);
