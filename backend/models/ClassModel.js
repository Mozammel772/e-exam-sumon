const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    className: { type: String, required: true, unique: true },
    classIdentifier: { type: String, required: true, unique: true },
    status: { type: Boolean, default: true }, // Default to true
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("Class", classSchema);
