import React from "react";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo = [],
  attachmentCount = 0,
  completedTodoCount = 0,
  todoChecklist = [],
  onClick,
}) => {

  // STATUS COLOR
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-600 bg-cyan-100";
      case "Completed":
        return "text-green-600 bg-green-100";
      default:
        return "text-purple-600 bg-purple-100";
    }
  };

  // PRIORITY COLOR
  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "text-emerald-600 bg-emerald-100";
      case "Medium":
        return "text-amber-600 bg-amber-100";
      case "High":
        return "text-rose-600 bg-rose-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
    >

      {/* STATUS + PRIORITY */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusTagColor()}`}>
          {status}
        </span>

        <span className={`text-xs font-medium px-3 py-1 rounded-full ${getPriorityTagColor()}`}>
          {priority}
        </span>
      </div>

      {/* TITLE */}
      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
        {description}
      </p>

      {/* PROGRESS */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 mb-1">
          Task Done: {completedTodoCount} / {todoChecklist.length}
        </p>
        <Progress progress={progress} status={status} />
      </div>

      {/* DATES */}
      <div className="flex justify-between mt-4 text-xs text-gray-500">
        <div>
          <p>Start</p>
          <p className="font-medium text-gray-800">
            {moment(createdAt).format("DD MMM YYYY")}
          </p>
        </div>

        <div className="text-right">
          <p>Due</p>
          <p className="font-medium text-gray-800">
            {moment(dueDate).format("DD MMM YYYY")}
          </p>
        </div>
      </div>

      {/* USERS + ATTACHMENTS */}
      <div className="flex justify-between items-center mt-4">

        <AvatarGroup avatars={assignedTo} />

        {attachmentCount > 0 && (
          <div className="flex items-center gap-1 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            <LuPaperclip />
            {attachmentCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;