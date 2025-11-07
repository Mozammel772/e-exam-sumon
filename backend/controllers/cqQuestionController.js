const CQQuestion = require("../models/CqQuestionModel");

// Create new CQ Question
exports.createCQQuestion = async (req, res) => {
  try {
    const cqQuestion = await CQQuestion.create(req.body);
    res.status(201).json({
      success: true,
      data: cqQuestion,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// Get all CQ Questions
exports.getCQQuestions = async (req, res) => {
  try {
    const questions = await CQQuestion.find();
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Get single CQ Question
exports.getCQQuestionById = async (req, res) => {
  try {
    const question = await CQQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Update CQ Question
exports.updateCQQuestion = async (req, res) => {
  try {
    const question = await CQQuestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// Delete CQ Question
exports.deleteCQQuestion = async (req, res) => {
  try {
    const question = await CQQuestion.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
