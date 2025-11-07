const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, trim: true },
    class: { type: String, required: true, trim: true },
    chapter: { type: String, required: true, trim: true },
    topicsName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Add index for fast searching on large data
topicSchema.index({ subject: 1, class: 1, chapter: 1, topicsName: 1 });

module.exports = mongoose.model("Topic", topicSchema);
