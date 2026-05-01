import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import { toast } from "react-hot-toast";

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🚀 FETCH TASKS
  const getAllTasks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_ALL_TASKS,
        {
          params: {
            status: filterStatus === "All" ? "" : filterStatus,
          },
        }
      );

      const tasks = response.data?.tasks || [];
      setAllTasks(tasks);

      const statusSummary = response.data?.statusSummary || {};

      // 🔥 FIXED LABELS (important)
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "InProgress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);

    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 REDIRECT TO DETAILS
  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

  useEffect(() => {
    getAllTasks();
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="My Tasks">

      <div className="my-5 px-2">

        {/* 🔥 HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-semibold">
            My Tasks
          </h2>

          {tabs?.length > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>

        {/* 🔄 LOADING */}
        {loading && (
          <p className="text-center mt-10 text-gray-500">
            Loading tasks...
          </p>
        )}

        {/* ❌ EMPTY STATE */}
        {!loading && allTasks.length === 0 && (
          <div className="text-center mt-10 text-gray-500">
            <p>No tasks found 😕</p>
          </div>
        )}

        {/* ✅ TASK GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {allTasks.map((item) => {

            // 🔥 PROGRESS CALCULATION (REAL)
            const totalTodos = item.todoChecklist?.length || 0;
            const completedTodos =
              item.todoChecklist?.filter((t) => t.completed)?.length || 0;

            const progress =
              totalTodos > 0
                ? Math.round((completedTodos / totalTodos) * 100)
                : 0;

            return (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={
                  item.assignedTo?.map((u) => u.profileImageUrl) || []
                }
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={completedTodos}
                todoChecklist={item.todoChecklist || []}
                onClick={() => handleClick(item._id)}
              />
            );
          })}
        </div>

      </div>

    </DashboardLayout>
  );
};

export default MyTasks;