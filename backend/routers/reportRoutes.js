const express = require("express");
const {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
} = require("../controllers/reportController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", createReport);
router.get("/", authMiddleware, adminMiddleware, getAllReports);
router.get("/:id", getReportById);
router.put("/:id", updateReport);
router.delete("/:id", deleteReport);

module.exports = router;
