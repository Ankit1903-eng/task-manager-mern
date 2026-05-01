const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getDashboardData,
} = require("../controllers/taskController");

const { protect } = require("../middlewares/authMiddleware");

// 🔥 STEP 1: THIS LINE ADD (MOST IMPORTANT)
router.get("/dashboard-data", protect, getDashboardData);

// STEP 2: बाकी routes
router.get("/", protect, getTasks);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.patch("/:id/status", protect, updateTaskStatus);

// STEP 3: LAST
router.get("/:id", protect, getTaskById);

module.exports = router;