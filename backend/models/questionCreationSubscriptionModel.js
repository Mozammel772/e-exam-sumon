const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    className: { type: String, required: true },
    subjects: [{ type: String, required: true }],
    price: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true },
    validity: { type: Date, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    allQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "QuestionCreationSubscription",
  subscriptionSchema
);
