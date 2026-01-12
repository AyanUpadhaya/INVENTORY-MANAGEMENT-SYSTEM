import { useState } from "react";
import Navbar from "../shared/Navbar";
import Sidebar from "../shared/Sidebar";
import { Outlet } from "react-router-dom";


export function DashboardLayout() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="bg-[#f4f5fe] h-screen w-full overflow-hidden">
      <div className="flex items-start h-full">
        <Sidebar showSidebar={showSidebar}></Sidebar>
        <div className="h-full flex-1 w-full overflow-hidden">
          <Navbar toggleSidebar={() => setShowSidebar((prev) => !prev)} />
          <div className="h-[calc(100%-20px)] overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
