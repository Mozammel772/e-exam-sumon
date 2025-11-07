const Report = require("../models/ReportModel");

// CREATE
exports.createReport = async (req, res) => {
  try {
    const report = await Report.create(req.body);
    res
      .status(201)
      .json({ success: true, data: report, message: "Report generated." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// READ ALL
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ SINGLE
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }
    res.status(200).json({ success: true, message: "Report deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
