const ExamSet = require("../models/ExamSet");
const User = require("../models/UserModel");
const mongoose = require("mongoose");

// CREATE
exports.createExamSet = async (req, res) => {
  try {
    const examSet = new ExamSet({
      ...req.body,
      questionIds: [],
    });
    const saved = await examSet.save();
    res.status(201).json(saved);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating exam set", error: error.message });
  }
};

// READ ALL

exports.getAllExamSets = async (req, res) => {
  try {
    const sets = await ExamSet.find()
      .populate("chapterId")
      .populate("questionIds");
    res.status(200).json(sets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching exam sets", error: error.message });
  }
};

// READ ONE
exports.getExamSetById = async (req, res) => {
  try {
    // Get exam set
    const set = await ExamSet.findById(req.params.id).populate({
      path: "chapterId",
      populate: {
        path: "questions",
        model: "Question",
      },
    });

    if (!set) {
      return res.status(404).json({ message: "Exam set not found" });
    }

    // Flatten all questions from all chapters
    const allChapterQuestions = set.chapterId.flatMap(
      (chapter) => chapter.questions
    );

    // Match only the questions listed in questionIds
    const matchedQuestions = allChapterQuestions.filter((q) =>
      set.questionIds.some((id) => id.equals(q._id))
    );

    // Optional: attach the matched questions to the response
    res.status(200).json({
      ...set.toObject(),
      matchedQuestions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching exam set",
      error: error.message,
    });
  }
};

// UPDATE (only questionIds and validation on subscription + duplicates)
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the existing question
    const existingQuestion = await ExamSet.findById(id);
    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    // 2. Check user subscription status
    const userInfo = await User.findOne({ email: existingQuestion.email });
    if (!userInfo?.subscription) {
      return res.status(403).json({
        message: "Active subscription required to update questions",
      });
    }

    // 3. Handle questionIds replacement
    let duplicates = [];
    let newIds = [];

    if (req.body.questionIds) {
      // Convert to array and remove duplicates from incoming data
      const incomingIds = [...new Set(req.body.questionIds)];

      // Check against existing IDs
      duplicates = incomingIds.filter((id) =>
        existingQuestion.questionIds.includes(id)
      );

      // Completely replace the array with new IDs
      existingQuestion.questionIds = incomingIds;

      // Track actually new IDs
      newIds = incomingIds.filter(
        (id) => !existingQuestion.questionIds.includes(id)
      );

      delete req.body.questionIds;
    }

    // 4. Update other fields
    Object.keys(req.body).forEach((key) => {
      existingQuestion[key] = req.body[key];
    });

    // 5. Save changes
    const updatedQuestion = await existingQuestion.save();

    // 6. Prepare response
    const response = {
      message: "Question IDs updated successfully",
      examSet: updatedQuestion,
      addedCount: newIds.length,
      duplicateCount: duplicates.length,
    };

    if (duplicates.length > 0) {
      response.duplicateIds = duplicates;
      response.message += ` ${duplicates.length} duplicates in request were merged.`;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// No subscription validation
exports.demoUpdateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the existing question
    const existingQuestion = await ExamSet.findById(id);
    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    // 2. Handle questionIds replacement
    let duplicates = [];
    let newIds = [];

    if (req.body.questionIds) {
      const incomingIds = [...new Set(req.body.questionIds)];

      duplicates = incomingIds.filter((id) =>
        existingQuestion.questionIds.includes(id)
      );

      existingQuestion.questionIds = incomingIds;

      newIds = incomingIds.filter(
        (id) => !existingQuestion.questionIds.includes(id)
      );

      delete req.body.questionIds;
    }

    // 3. Update other fields
    Object.keys(req.body).forEach((key) => {
      existingQuestion[key] = req.body[key];
    });

    // 4. Save changes
    const updatedQuestion = await existingQuestion.save();

    // 5. Prepare response
    const response = {
      message: "Question IDs updated successfully",
      examSet: updatedQuestion,
      addedCount: newIds.length,
      duplicateCount: duplicates.length,
    };

    if (duplicates.length > 0) {
      response.duplicateIds = duplicates;
      response.message += ` ${duplicates.length} duplicates in request were merged.`;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE
exports.deleteExamSet = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ExamSet.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Exam set not found" });
    res.status(200).json({ message: "Exam set deleted", deleted });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting exam set", error: error.message });
  }
};

// Get all exam sets for a specific user using email
exports.getExamSetsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const examSets = await ExamSet.find({ email }).populate({
      path: "chapterId",
      select: "chapterName", // Only fetch chapterName field
    });

    if (!examSets || examSets.length === 0) {
      return res.status(404).json({
        message: "No exam sets found for this user.",
      });
    }

    res.status(200).json({
      message: "Exam sets retrieved successfully",
      count: examSets.length,
      examSets,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching exam sets by email",
      error: error.message,
    });
  }
};

exports.getSingleExamSet = async (req, res) => {
  const { email, id } = req.params;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // if (!user.subscription) {
    //   return res.status(403).json({
    //     message: "Active subscription required to access this exam set",
    //   });
    // }

    // 2. Find the exam set
    const examSet = await ExamSet.findOne({ _id: id, email });

    if (!examSet) {
      return res.status(404).json({ message: "Exam set not found" });
    }

    // 3. Return both examSet and basic user profile info
    res.status(200).json({
      examSet,
      userProfile: {
        userName: user.userName,
        email: user.email,
        role: user.role,
        addresses: user.addresses,
        isVerified: user.isVerified,
        subscription: user.subscription,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
