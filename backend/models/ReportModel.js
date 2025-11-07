import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    reportDescription: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
