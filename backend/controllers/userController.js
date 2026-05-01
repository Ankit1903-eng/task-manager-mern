const User = require("../models/User");
const Task = require("../models/Task");

// ✅ GET ALL TEAM MEMBERS WITH TASK COUNTS
const getUsers = async (req, res) => {
  try {
    // 👉 सिर्फ members (admin नहीं)
    const users = await User.find({ role: "member" }).select("-password");

    // 👉 aggregation (FAST + optimized)
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const [pendingTasks, inProgressTasks, completedTasks] =
          await Promise.all([
            Task.countDocuments({
              assignedTo: user._id,
              status: "Pending",
            }),
            Task.countDocuments({
              assignedTo: user._id,
              status: "In Progress",
            }),
            Task.countDocuments({
              assignedTo: user._id,
              status: "Completed",
            }),
          ]);

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          profileImageUrl: user.profileImageUrl || null,
          role: user.role,

          // ✅ Task Stats
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    res.status(200).json(usersWithTaskCounts);
  } catch (error) {
    console.error("❌ Error in getUsers:", error.message);
    res.status(500).json({
      message: "Server error while fetching users",
      error: error.message,
    });
  }
};

// ✅ GET SINGLE USER
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error in getUserById:", error.message);
    res.status(500).json({
      message: "Server error while fetching user",
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
};