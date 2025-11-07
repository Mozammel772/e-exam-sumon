const ReadyQuestionSet = require("../models/ReadyQuestionSetsModel");

// CREATE
exports.createReadyQuestionSet = async (req, res) => {
  try {
    const newSet = new ReadyQuestionSet(req.body);
    const saved = await newSet.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ ALL
exports.getAllReadyQuestionSets = async (req, res) => {
  try {
    const sets = await ReadyQuestionSet.find();
    res.json(sets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ONE
exports.getReadyQuestionSetById = async (req, res) => {
  try {
    const set = await ReadyQuestionSet.findById(req.params.id);
    if (!set) return res.status(404).json({ message: "Not found" });
    res.json(set);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateReadyQuestionSet = async (req, res) => {
  try {
    const updated = await ReadyQuestionSet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
exports.deleteReadyQuestionSet = async (req, res) => {
  try {
    const deleted = await ReadyQuestionSet.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all ready question sets by user email
exports.getReadyQuestionSetsByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email query parameter is required" });
    }

    const readyQuestionSets = await ReadyQuestionSet.find({ email });
    res.status(200).json(readyQuestionSets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch data", error: error.message });
  }
};
