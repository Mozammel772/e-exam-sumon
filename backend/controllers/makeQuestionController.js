const Question = require("../models/MakeQuestionModel");
const Subscription = require("../models/questionCreationSubscriptionModel");
const user = require("../models/UserModel");
const ChapterModel = require("../models/ChapterModel");
const mongoose = require("mongoose");

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    const { email, className, subject, questionTitle, examName, examType } =
      req.body;

    // Validate required fields (removed allQuestionsId from validation)
    if (
      !email ||
      !className ||
      !subject ||
      !questionTitle ||
      !examName ||
      !examType
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Check user's subscription
    const userInfo = await user.findOne({ email });
    if (!userInfo || !userInfo.subscription) {
      return res
        .status(403)
        .json({ message: "No active subscription found for this subject." });
    }

    // Create new Question with empty allQuestionsId
    const newQuestion = new Question({
      email,
      className,
      subject,
      allQuestionsId: [],
      questionTitle,
      examName,
      examType,
    });

    const savedQuestion = await newQuestion.save();

    // Prepare questionSet with empty allQuestionsId
    const questionSet = {
      email,
      className,
      subject,
      allQuestionsId: [],
      questionTitle,
      examName,
      examType,
      questionId: savedQuestion._id,
      createdAt: new Date(),
    };

    // Update QuestionMake document
    let questionMake = await Question.findOne({ email });
    if (questionMake) {
      questionMake.questions.push(questionSet);
    } else {
      questionMake = new Question({
        email,
        questions: [questionSet],
      });
    }

    await questionMake.save();

    res.status(201).json({
      message: "Question created successfully",
      questionId: savedQuestion._id,
      questionMake,
    });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    // Fetch all base questions with lean for performance
    const questions = await Question.find().lean();

    // Extract all unique question IDs from allQuestionsId fields
    const allQuestionIds = questions.flatMap((q) => q.allQuestionsId);
    const uniqueIds = [...new Set(allQuestionIds)];

    // Early return if no questions found
    if (!questions.length) {
      return res.status(200).json({ questions: [] });
    }

    // If there are question IDs to look up
    let questionDetailsMap = new Map();
    if (uniqueIds.length > 0) {
      // Convert to strings for efficient lookup
      const uniqueIdStrings = new Set(
        uniqueIds
          .filter((id) => id) // Remove null or undefined
          .map((id) => id.toString()) // Convert to string
      );

      // Fetch all relevant chapters in a single query
      const chapters = await ChapterModel.find({
        "questions._id": { $in: uniqueIds },
      })
        .select("questions")
        .lean();

      // Extract and transform question data
      const allDetailedQuestions = chapters.flatMap((chapter) =>
        chapter.questions.filter((q) => uniqueIdStrings.has(q._id.toString()))
      );

      // Create mapping of question details
      questionDetailsMap = new Map(
        allDetailedQuestions.map((q) => [
          q._id.toString(),
          {
            _id: q._id,
            type: q.type,
            questionName: q.questionName,
            options: [q.option1, q.option2, q.option3, q.option4],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            boardExamInfo: q.boardExamInfo,
            schoolExamInfo: q.schoolExamInfo,
          },
        ])
      );
    }

    // Enrich questions with details in optimal O(n) time
    const enrichedQuestions = questions.map((question) => ({
      ...question,
      allQuestionsDetails: question.allQuestionsId
        ?.map((id) => questionDetailsMap.get(id.toString()))
        .filter((q) => q), // Remove any undefined entries
    }));

    res.status(200).json({ questions: enrichedQuestions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }
};

// Get user's purchased questions
exports.getUserQuestions = async (req, res) => {
  try {
    const { email } = req.params;

    // Check if the user exists (optional)
    const existingUser = await user.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find all questions created by this user
    const questions = await Question.find({ email });

    res.status(200).json({ questions });
  } catch (error) {
    console.error("Error fetching user questions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a question (Admin only)
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the existing question
    const existingQuestion = await Question.findById(id);
    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    // 2. Check user subscription status
    const userInfo = await user.findOne({ email: existingQuestion.email });
    if (!userInfo?.subscription) {
      return res.status(403).json({
        message: "Active subscription required to update questions",
      });
    }

    // 3. Process allQuestionsId updates for each question entry
    let totalDuplicates = 0;
    let totalNewIds = 0;
    let allDuplicateIds = [];

    const incomingIds = Array.isArray(req.body.allQuestionsId)
      ? req.body.allQuestionsId.map((id) => id.toString())
      : [];

    existingQuestion.questions.forEach((q, index) => {
      const existingIds = Array.isArray(q.allQuestionsId)
        ? q.allQuestionsId.map((id) => id.toString())
        : [];

      let newIds = [];
      let duplicates = [];

      incomingIds.forEach((id) => {
        if (existingIds.includes(id)) {
          duplicates.push(id);
        } else {
          newIds.push(id);
        }
      });

      // Merge new IDs into the array
      existingQuestion.questions[index].allQuestionsId = [
        ...existingIds.map((id) => new mongoose.Types.ObjectId(id)),
        ...newIds.map((id) => new mongoose.Types.ObjectId(id)),
      ];

      totalNewIds += newIds.length;
      totalDuplicates += duplicates.length;
      allDuplicateIds.push(...duplicates);
    });

    // 4. Remove from body to prevent accidental overwrite
    delete req.body.allQuestionsId;

    // 5. Update other fields
    Object.keys(req.body).forEach((key) => {
      existingQuestion[key] = req.body[key];
    });

    // 6. Save the updated document
    const updatedQuestion = await existingQuestion.save();

    // 7. Send response
    const response = {
      message: "Question updated successfully",
      question: updatedQuestion,
      addedCount: totalNewIds,
      duplicateCount: totalDuplicates,
    };

    if (totalDuplicates > 0) {
      response.duplicateIds = allDuplicateIds;
      response.message += ` ${totalDuplicates} duplicate IDs ignored.`;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete a question (Admin only)
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user?._id;
    const userRole = req.user?.role;

    // Fetch the question first to check ownership
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Authorization check: Admin or owner
    if (userRole !== "admin" && question.user?.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this question" });
    }

    // Proceed to delete
    await Question.findByIdAndDelete(id);

    // Clean up subscriptions
    await Subscription.updateMany(
      { allQuestions: id },
      { $pull: { allQuestions: id } }
    );

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
