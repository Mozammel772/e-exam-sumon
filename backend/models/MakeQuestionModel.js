const mongoose = require("mongoose");

const questionSetSchema = new mongoose.Schema({
  email: String,
  className: String,
  subject: String,
  allQuestionsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "questionCreationSubscription",
    },
  ],
  questionTitle: String,
  examName: String,
  examType: String,
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  createdAt: { type: Date, default: Date.now },
});

const questionMakeSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    questions: [questionSetSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuestionMake", questionMakeSchema);
