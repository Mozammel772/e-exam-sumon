const mongoose = require("mongoose");

const cqQuestionSchema = new mongoose.Schema(
  {
    mainQuestion: {
      type: String,
      required: ["Main question is required"],
      trim: true,
    },
    question1: {
      question: {
        type: String,
        required: ["Question 1 is required"],
        trim: true,
      },
      answer: {
        type: String,
        required: ["Answer 1 is required"],
        trim: true,
      },
    },
    question2: {
      question: {
        type: String,
        required: ["Question 2 is required"],
        trim: true,
      },
      answer: {
        type: String,
        required: ["Answer 2 is required"],
        trim: true,
      },
    },
    question3: {
      question: {
        type: String,
        required: ["Question 3 is required"],
        trim: true,
      },
      answer: {
        type: String,
        required: ["Answer 3 is required"],
        trim: true,
      },
    },
    question4: {
      question: {
        type: String,
        required: ["Question 4 is required"],
        trim: true,
      },
      answer: {
        type: String,
        required: ["Answer 4 is required"],
        trim: true,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("CQQuestion", cqQuestionSchema);
