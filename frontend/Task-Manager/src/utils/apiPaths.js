// ✅ BASE URL (LOCAL BACKEND)
export const BASE_URL = "https://task-manager-mern-2mqy.onrender.com/api";

// ✅ ALL API ENDPOINTS
export const API_PATHS = {
  // 🔐 AUTH ROUTES
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    GET_PROFILE: "/auth/profile",
    UPDATE_PROFILE: "/auth/update-profile",
  },

  // 👤 USER ROUTES
  USERS: {
    GET_ALL_USERS: "/users",
    GET_USER_BY_ID: (id) => `/users/${id}`,
  },

  // 📋 TASK ROUTES
  TASKS: {
    CREATE_TASK: "/tasks",
    GET_ALL_TASKS: "/tasks",

    // 🔥 ADD THIS (IMPORTANT FIX)
    GET_DASHBOARD_DATA: "/tasks/dashboard-data",

    GET_TASK_BY_ID: (id) => `/tasks/${id}`,
    UPDATE_TASK: (id) => `/tasks/${id}`,
    DELETE_TASK: (id) => `/tasks/${id}`,
    UPDATE_TASK_STATUS: (id) => `/tasks/${id}/status`,
  },
};