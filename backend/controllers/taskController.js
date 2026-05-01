const Task = require("../models/Task");
const mongoose = require("mongoose");


// ================== CREATE TASK ==================
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      todoChecklist,
    } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      todoChecklist,
      status: "Pending",
      createdBy: req.user._id,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({
      message: "Error creating task",
      error: error.message,
    });
  }
};


// ================== GET ALL TASKS ==================
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};
    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email profileImageUrl")
      .sort({ createdAt: -1 });

    res.json({
      tasks,
      statusSummary: {
        all: tasks.length,
        pendingTasks: tasks.filter(t => t.status === "Pending").length,
        inProgressTasks: tasks.filter(t => t.status === "In Progress").length,
        completedTasks: tasks.filter(t => t.status === "Completed").length,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};


// ================== GET SINGLE TASK ==================
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔥 FIX: prevent "dashboard" crash
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Task ID",
      });
    }

    const task = await Task.findById(id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching task",
      error: error.message,
    });
  }
};


// ================== UPDATE TASK ==================
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Task ID" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: "Error updating task",
      error: error.message,
    });
  }
};


// ================== DELETE TASK ==================
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Task ID" });
    }

    await Task.findByIdAndDelete(id);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting task",
      error: error.message,
    });
  }
};


// ================== UPDATE STATUS ==================
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Task ID" });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: "Error updating status",
      error: error.message,
    });
  }
};


// ================== DASHBOARD DATA ==================
const getDashboardData = async (req, res) => {
  console.log("🔥 DASHBOARD API HIT");

  try {
    const tasks = await Task.find();

    // STATUS COUNTS
    const totalTasks = tasks.length;
    const pending = tasks.filter(t => t.status === "Pending").length;
    const inProgress = tasks.filter(t => t.status === "In Progress").length;
    const completed = tasks.filter(t => t.status === "Completed").length;

    // PRIORITY COUNTS
    const low = tasks.filter(t => t.priority === "Low").length;
    const medium = tasks.filter(t => t.priority === "Medium").length;
    const high = tasks.filter(t => t.priority === "High").length;

    // RECENT TASKS
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("assignedTo", "name");

    res.json({
      charts: {
        taskDistribution: {
          All: totalTasks,
          Pending: pending,
          "In Progress": inProgress,
          Completed: completed,
        },
        taskPriorityLevels: {
          Low: low,
          Medium: medium,
          High: high,
        },
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ================== EXPORT ==================
module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getDashboardData,
};