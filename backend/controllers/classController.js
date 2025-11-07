const Class = require("../models/ClassModel");

// Create a new class (Admin only)
exports.createClass = async (req, res) => {
  try {
    const { className, classIdentifier } = req.body;

    const existingClass = await Class.findOne({ classIdentifier });
    if (existingClass) {
      return res.status(400).json({ msg: "Class already exists" });
    }

    const newClass = new Class({ className, classIdentifier });
    await newClass.save();

    res
      .status(201)
      .json({ msg: "Class created successfully", class: newClass });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all classes (Public)
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get a single class by ID (Public)
exports.getClassById = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ msg: "Class not found" });
    }
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Update class (Admin only)
exports.updateClass = async (req, res) => {
  try {
    const { className, classIdentifier, status } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { className, classIdentifier, status },
      { new: true } // Return updated document
    );

    if (!updatedClass) {
      return res.status(404).json({ msg: "Class not found" });
    }

    res.json({ msg: "Class updated successfully", class: updatedClass });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete class (Admin only)
exports.deleteClass = async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ msg: "Class not found" });
    }
    res.json({ msg: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
