const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema(
  {
    examName: { type: String, required: true },
    examIdentifier: { type: String, unique: true, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", ExamSchema);
