const Topic = require("../models/topicsModel");

// Create a new topic
exports.createTopic = async (req, res) => {
  try {
    const topic = await Topic.create(req.body);
    res.status(201).json(topic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all topics (with optional search)
exports.getTopics = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? {
          $or: [
            { subject: new RegExp(search, "i") },
            { class: new RegExp(search, "i") },
            { chapter: new RegExp(search, "i") },
            { topicsName: new RegExp(search, "i") },
          ],
        }
      : {};

    const topics = await Topic.find(query).sort({ createdAt: -1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single topic by ID
exports.getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update topic
exports.updateTopic = async (req, res) => {
  try {
    const updatedTopic = await Topic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTopic)
      return res.status(404).json({ message: "Topic not found" });
    res.json(updatedTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete topic
exports.deleteTopic = async (req, res) => {
  try {
    const deleted = await Topic.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Topic not found" });
    res.json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
