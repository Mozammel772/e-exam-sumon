const Announcement = require("../models/AnnouncementModal.js");

// Get all announcements
const createAnnouncement = async (req, res) => {
  try {
    const { message } = req.body;

    const newAnnouncement = new Announcement({ message });
    await newAnnouncement.save();

    res.status(201).json({
      msg: "Announcement created successfully",
      announcement: newAnnouncement,
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get announcement by ID
const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement)
      return res.status(404).json({ msg: "Announcement not found" });

    res.status(200).json(announcement);
  } catch (error) {
    console.error("Error fetching announcement:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update announcement
const updateAnnouncement = async (req, res) => {
  try {
    const { message } = req.body;
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { message },
      { new: true }
    );

    if (!updatedAnnouncement)
      return res.status(404).json({ msg: "Announcement not found" });

    res
      .status(200)
      .json({ msg: "Announcement updated", announcement: updatedAnnouncement });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ msg: "Announcement not found" });

    res.status(200).json({ msg: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
};
