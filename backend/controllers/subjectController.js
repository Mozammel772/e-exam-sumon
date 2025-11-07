const Subject = require("../models/SubjectModel");
const Class = require("../models/ClassModel");
const Chapter = require("../models/ChapterModel");
const mongoose = require("mongoose");

// Create a new subject (Admin only)
exports.createSubject = async (req, res) => {
  try {
    const { subjectName, subjectClassName, groupName } = req.body;

    // Check if the class exists
    const existingClass = await Class.findById(subjectClassName);
    if (!existingClass) {
      return res.status(400).json({ msg: "Class does not exist" });
    }

    const newSubject = new Subject({
      subjectName,
      subjectClassName,
      groupName,
    });
    await newSubject.save();

    res
      .status(201)
      .json({ msg: "Subject created successfully", subject: newSubject });
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    // Get all subjects with their class names only
    const subjects = await Subject.find().populate(
      "subjectClassName",
      "className"
    );

    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get a single subject by ID (Public)
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params?.id).populate(
      "subjectClassName",
      "className"
    );

    if (!subject) {
      return res.status(404).json({ msg: "Subject not found" });
    }

    // ✅ Get all chapters related to this subject
    const chapters = await Chapter.find({ subjectName: subject?._id });

    res.json({
      ...subject._doc, // spread the subject object
      chapters, // attach the chapters list
    });
  } catch (error) {
    console.error("Error fetching subject:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update a subject (Admin only)
exports.updateSubject = async (req, res) => {
  try {
    const { subjectName, subjectClassName, groupName, status } = req.body;

    if (subjectClassName) {
      const existingClass = await Class.findById(subjectClassName);
      if (!existingClass) {
        return res.status(400).json({ msg: "Class does not exist" });
      }
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      { subjectName, subjectClassName, status, groupName },
      { new: true }
    );

    if (!updatedSubject) {
      return res.status(404).json({ msg: "Subject not found" });
    }

    res.json({ msg: "Subject updated successfully", subject: updatedSubject });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete a subject (Admin only)
exports.deleteSubject = async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    if (!deletedSubject) {
      return res.status(404).json({ msg: "Subject not found" });
    }
    res.json({ msg: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
