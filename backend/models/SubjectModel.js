const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    subjectName: { type: String, required: true },
    groupName: { type: String, required: true },
    subjectClassName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);
