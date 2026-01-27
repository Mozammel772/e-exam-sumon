const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// ========================
// CORS Multi-Origin Config
// ========================
const allowedOrigins = [
  "http://localhost:5173",
  "https://api.eexamapp.com",      // optional if Next.js local
  "https://eexamapp.com",       // frontend
  "https://www.eexamapp.com",   // frontend www version
  "https://api.eexamapp.com",   // backend api domain
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from mobile apps / curl / postman (no origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("❌ Blocked by CORS >>>", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies/tokens
};

app.use(cors(corsOptions));

// Explicit headers (important for credentials)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// ========================
// Middlewares
// ========================
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// Debug (optional)
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`Response: ${req.method} ${req.path}`, res.getHeaders());
  });
  next();
});

// ========================
// MongoDB Connection
// ========================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};

connectDB();

// ========================
// Routes
// ========================
app.get("/", (req, res) => {
  res.send("Hello from E-EXAM API Server!");
});

app.use("/api/auth", require("./routers/authRoutes"));
app.use("/api/class", require("./routers/classRoutes"));
app.use("/api/subject", require("./routers/subjectRoutes"));
app.use("/api/chapter", require("./routers/chapterRoutes"));
app.use("/api/exam", require("./routers/examRoutes"));
app.use("/api/subscription", require("./routers/subscriptionRoutes"));
app.use("/api/reports", require("./routers/reportRoutes"));
app.use("/api/question", require("./routers/questionCreationSubscriptionRoutes"));
app.use("/api/make-question", require("./routers/makeQuestionRoutes"));
app.use("/api/exam-sets", require("./routers/examSetRoutes"));
app.use("/api/ready-question-sets", require("./routers/readyQuestionSetsRoutes"));
app.use("/api/lecture-shit-packages", require("./routers/lectureShitRoutes"));
app.use("/api/cq-questions", require("./routers/cqRoutes"));
app.use("/api/topics", require("./routers/topicsRoutes"));
app.use("/api/announcements", require("./routers/announcementRoutes"));
// ========================
// Error Handler
// ========================
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// ========================
// Server
// ========================
const PORT = process.env.PORT || 5555;

app.listen(PORT, () => {
  console.log(`🚀 E-EXAM Backend running on port ${PORT}`);
});
