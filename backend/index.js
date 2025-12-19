const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();


// Middleware

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));


app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

app.use((err, req, res, next) => {
  console.error("Full error object:", {
    message: err.message,
    stack: err.stack,
    name: err.name,
    fullError: JSON.stringify(err, Object.getOwnPropertyNames(err)),
  });
  res.status(500).json({ error: "Internal Server Error" });
});

// Add after CORS middleware
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`Response headers for ${req.path}:`, res.getHeaders());
  });
  next();
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Hello from full Express server!");
});

app.use("/api/auth", require("./routers/authRoutes"));
app.use("/api/class", require("./routers/classRoutes"));
app.use("/api/subject", require("./routers/subjectRoutes"));
app.use("/api/chapter", require("./routers/chapterRoutes"));
app.use("/api/exam", require("./routers/examRoutes"));
app.use("/api/subscription", require("./routers/subscriptionRoutes"));
app.use("/api/reports", require("./routers/reportRoutes"));

app.use(
  "/api/question",
  require("./routers/questionCreationSubscriptionRoutes")
);
app.use("/api/make-question", require("./routers/makeQuestionRoutes"));
app.use("/api/exam-sets", require("./routers/examSetRoutes"));
app.use(
  "/api/ready-question-sets",
  require("./routers/readyQuestionSetsRoutes")
);
app.use("/api/lecture-shit-packages", require("./routers/lectureShitRoutes"));
app.use("/api/cq-questions", require("./routers/cqRoutes"));
app.use("/api/topics", require("./routers/topicsRoutes"));

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
