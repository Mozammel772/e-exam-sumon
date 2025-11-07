const express = require("express");
const router = express.Router();
const {
  createALectureShitPackage,
  getAllLectureShitPackages,
  getLectureShitById,
  updateLectureShit,
  deleteALectureShit,
  getLectureShitByEmail,
} = require("../controllers/lectureShitPackagesController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

router.post("/", createALectureShitPackage);
router.get("/", authMiddleware, adminMiddleware, getAllLectureShitPackages);
router.get("/by-email", getLectureShitByEmail);
router.get("/:id", getLectureShitById);
router.put("/:id", authMiddleware, adminMiddleware, updateLectureShit);
router.delete("/:id", authMiddleware, adminMiddleware, deleteALectureShit);

module.exports = router;
