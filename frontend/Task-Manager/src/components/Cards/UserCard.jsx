import React from "react";

const UserCard = ({ user }) => {
  // ✅ initials generate करने के लिए
  const getInitials = (name) => {
    if (!name) return "UN";

    const words = name.split(" ");
    return words.length > 1
      ? words[0][0] + words[1][0]
      : words[0][0];
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition">

      {/* PROFILE / INITIALS */}
      <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">
        {getInitials(user?.name)}
      </div>

      {/* USER INFO */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">
          {user?.name || "Unknown User"}
        </h3>

        <p className="text-sm text-gray-500">
          {user?.email || "No email"}
        </p>

        {/* TASK STATS */}
        <div className="flex gap-4 mt-2 text-sm">

          <span className="text-purple-600 font-medium">
            {user?.pendingTasks || 0} Pending
          </span>

          <span className="text-blue-600 font-medium">
            {user?.inProgressTasks || 0} In Progress
          </span>

          <span className="text-green-600 font-medium">
            {user?.completedTasks || 0} Completed
          </span>

        </div>
      </div>

    </div>
  );
};

export default UserCard;