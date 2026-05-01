import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Navbar */}
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">

          {/* Sidebar */}
          <div className="hidden lg:block">
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {children}
          </div>

        </div>
      )}
    </div>
  );
};

export default DashboardLayout;