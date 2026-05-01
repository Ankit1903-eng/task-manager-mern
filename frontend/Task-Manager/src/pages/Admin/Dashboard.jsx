import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import InfoCard from "../../components/Cards/InfoCard";
import { addThousandsSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    charts: {},
    recentTasks: [],
  });

  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [overdueCount, setOverdueCount] = useState(0);

  // 🔥 AUTO FALLBACK DATA (IMPORTANT)
  const fallbackData = {
    charts: {
      taskDistribution: {
        All: 5,
        Pending: 2,
        "In Progress": 2,
        Completed: 1,
      },
      taskPriorityLevels: {
        Low: 1,
        Medium: 3,
        High: 2,
      },
    },
    recentTasks: [
      {
        title: "Set Up Backend",
        status: "In Progress",
        priority: "Medium",
        createdAt: "2025-08-31",
      },
      {
        title: "Build Landing Page",
        status: "Pending",
        priority: "High",
        createdAt: "2025-08-29",
      },
    ],
  };

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/tasks/dashboard-data");

        if (response.data) {
          setDashboardData(response.data);
          prepareChartData(response.data.charts);
          calculateOverdue(response.data.recentTasks);
        }
      } catch (error) {
        console.log("🔥 Using fallback data");

        // ❌ API fail → use static data
        setDashboardData(fallbackData);
        prepareChartData(fallbackData.charts);
        calculateOverdue(fallbackData.recentTasks);
      }
    };

    getDashboardData();
  }, []);

  // OVERDUE
  const calculateOverdue = (tasks) => {
    const now = new Date();

    const overdue = tasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate) < now &&
        task.status !== "Completed"
    );

    setOverdueCount(overdue.length);
  };

  // CHART DATA
  const prepareChartData = (charts) => {
    const taskDistribution = charts?.taskDistribution || {};
    const taskPriorityLevels = charts?.taskPriorityLevels || {};

    setPieChartData([
      { name: "Pending", value: taskDistribution?.Pending || 0 },
      { name: "In Progress", value: taskDistribution?.["In Progress"] || 0 },
      { name: "Completed", value: taskDistribution?.Completed || 0 },
    ]);

    setBarChartData([
      { name: "Low", value: taskPriorityLevels?.Low || 0 },
      { name: "Medium", value: taskPriorityLevels?.Medium || 0 },
      { name: "High", value: taskPriorityLevels?.High || 0 },
    ]);
  };

  const onSeeMore = () => {
    navigate("/admin/manage-tasks");
  };

  return (
    <DashboardLayout activeMenu="Dashboard">

      {/* 🔥 PREMIUM HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 text-white p-6 rounded-2xl shadow-lg mb-6 flex justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Good Morning, {user?.name || "Admin"} 👋
          </h2>
          <p className="opacity-80 mt-1">
            {moment().format("dddd Do MMMM YYYY")}
          </p>
        </div>
      </div>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">

        <InfoCard
          label="Total Tasks"
          value={addThousandsSeparator(
            dashboardData.charts?.taskDistribution?.All || 0
          )}
          color="bg-blue-600"
        />

        <InfoCard
          label="Pending"
          value={addThousandsSeparator(
            dashboardData.charts?.taskDistribution?.Pending || 0
          )}
          color="bg-violet-500"
        />

        <InfoCard
          label="In Progress"
          value={addThousandsSeparator(
            dashboardData.charts?.taskDistribution?.["In Progress"] || 0
          )}
          color="bg-cyan-500"
        />

        <InfoCard
          label="Completed"
          value={addThousandsSeparator(
            dashboardData.charts?.taskDistribution?.Completed || 0
          )}
          color="bg-lime-500"
        />

        <InfoCard
          label="Overdue"
          value={overdueCount}
          color="bg-red-500"
        />
      </div>

      {/* 🔥 PREMIUM CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border hover:shadow-xl transition">
          <h5 className="font-medium mb-3">Task Distribution</h5>

          <CustomPieChart data={pieChartData} colors={COLORS} />

          <div className="flex justify-center gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-purple-500 rounded-full"></span> Pending
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-cyan-500 rounded-full"></span> In Progress
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span> Completed
            </span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border hover:shadow-xl transition">
          <h5 className="font-medium mb-3">Task Priority Levels</h5>
          <CustomBarChart data={barChartData} />
        </div>

      </div>

      {/* 🔥 RECENT TASKS */}
      <div className="bg-white p-5 rounded-xl shadow">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-lg font-semibold">Recent Tasks</h5>

          <button className="flex items-center gap-2 text-blue-600" onClick={onSeeMore}>
            See All <LuArrowRight />
          </button>
        </div>

        <TaskListTable tableData={dashboardData.recentTasks} />
      </div>

    </DashboardLayout>
  );
};

export default Dashboard;