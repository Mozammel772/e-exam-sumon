const mongoose = require("mongoose");

const examSetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    chapterId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
    examCategory: {
      type: String,
      required: true,
    },
    examType: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    // year: {
    //   type: String,
    //   required: true,
    // },
    questionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ExamSet", examSetSchema);
