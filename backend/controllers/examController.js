const Exam = require("../models/ExamModel");

// Create a new exam (Admin Only)
exports.createExam = async (req, res) => {
  try {
    const { examName, examIdentifier, status } = req.body;

    // Check if examIdentifier already exists
    const existingExam = await Exam.findOne({ examIdentifier });
    if (existingExam) {
      return res.status(400).json({ msg: "Exam Identifier must be unique" });
    }

    const exam = new Exam({
      examName,
      examIdentifier,
      status: status ?? true,
    });

    await exam.save();
    res.status(201).json({ msg: "Exam created successfully", exam });
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all exams (Public)
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Update an exam (Admin Only)
exports.updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExam = await Exam.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedExam) return res.status(404).json({ msg: "Exam not found" });

    res.json({ msg: "Exam updated successfully", updatedExam });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete an exam (Admin Only)
exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExam = await Exam.findByIdAndDelete(id);

    if (!deletedExam) return res.status(404).json({ msg: "Exam not found" });

    res.json({ msg: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
