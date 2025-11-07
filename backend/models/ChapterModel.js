const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  type: { type: String, enum: ["MCQ", "CQ", "short"] },
  topic: { type: String },
  questionName: { type: String },
  option1: { type: String },
  option2: { type: String },
  option3: { type: String },
  option4: { type: String },
  // boardExamInfo: { type: String },
  boardExamList: [{ type: String }],
  schoolExamInfo: { type: String },
  correctAnswer: { type: String },
  explanation: { type: String },
  searchType: [{ type: String }],
  questionLevel: { type: String },

  // ✅ CQ-only structure
  cqDetails: {
    mainQuestion: { type: String },
    question1: { type: String },
    answer1: { type: String },
    question2: { type: String },
    answer2: { type: String },
    question3: { type: String },
    answer3: { type: String },
    question4: { type: String },
    answer4: { type: String },
    topic: { type: String },
  },
  shortQusDetails: {
    shortQuestion: { type: String },
    shortQuestionAnswer: { type: String },
    boardExamList: [{ type: String }],
    shortQuestionTopic: { type: String },
    shortQuestionSearchType: [{ type: String }],
  },
});

QuestionSchema.index({ type: 1 });
QuestionSchema.index({ topic: 1 });
QuestionSchema.index({ searchType: 1 });

const ChapterSchema = new mongoose.Schema(
  {
    chapterName: { type: String, required: true },
    subjectName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    subjectClassName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    questions: [QuestionSchema],
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);
ChapterSchema.index({ _id: 1 });
ChapterSchema.index({ subjectName: 1 });
ChapterSchema.index({ subjectClassName: 1 });

module.exports = mongoose.model("Chapter", ChapterSchema);
