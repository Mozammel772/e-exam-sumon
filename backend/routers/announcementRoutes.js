// At the top
const express = require("express");
const {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createAnnouncement);
router.get("/", getAllAnnouncements);
router.get("/:id", authMiddleware, adminMiddleware, getAnnouncementById);
router.put("/:id", authMiddleware, adminMiddleware, updateAnnouncement);
router.delete("/:id", authMiddleware, adminMiddleware, deleteAnnouncement);

// 👇 CommonJS export
module.exports = router;
