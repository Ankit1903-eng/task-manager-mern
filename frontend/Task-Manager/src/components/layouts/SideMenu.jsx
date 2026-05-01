import React, { useContext, useEffect, useState } from "react";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
  }, [user]);

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200 sticky top-[61px] z-20">

      {/* Profile */}
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <img
          src={user?.profileImageUrl || "https://via.placeholder.com/80"}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />

        {user?.role === "admin" && (
          <div className="text-[10px] font-medium text-white bg-blue-600 px-3 py-0.5 rounded mt-1">
            Admin
          </div>
        )}

        <h5 className="text-gray-900 font-semibold mt-3">
          {user?.name}
        </h5>

        <p className="text-xs text-gray-500">
          {user?.email}
        </p>
      </div>

      {/* Menu */}
      {sideMenuData.map((item, index) => (
        <button
          key={index}
          onClick={() => handleClick(item.path)}
          className={`w-full flex items-center gap-4 text-sm py-3 px-6 mb-2 transition-all 
          ${
            activeMenu === item.label
              ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <item.icon className="text-lg" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;