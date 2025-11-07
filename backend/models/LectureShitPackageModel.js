const mongoose = require("mongoose");

const lectureShitPackagesSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    packages: {
      type: [String],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LectureShit", lectureShitPackagesSchema);
