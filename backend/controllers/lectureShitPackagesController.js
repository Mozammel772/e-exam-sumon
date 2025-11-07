const LectureShit = require("../models/LectureShitPackageModel");

// CREATE
exports.createALectureShitPackage = async (req, res) => {
  try {
    const newSet = new LectureShit(req.body);
    const saved = await newSet.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ ALL
exports.getAllLectureShitPackages = async (req, res) => {
  try {
    const sets = await LectureShit.find();
    res.json(sets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ONE
exports.getLectureShitById = async (req, res) => {
  try {
    const set = await LectureShit.findById(req.params.id);
    if (!set) return res.status(404).json({ message: "Not found" });
    res.json(set);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateLectureShit = async (req, res) => {
  try {
    const updated = await LectureShit.findByIdAndUpdate(
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
exports.deleteALectureShit = async (req, res) => {
  try {
    const deleted = await LectureShit.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all ready question sets by user email
exports.getLectureShitByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email query parameter is required" });
    }

    const lectureShit = await LectureShit.find({ email });
    res.status(200).json(lectureShit);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch data", error: error.message });
  }
};
