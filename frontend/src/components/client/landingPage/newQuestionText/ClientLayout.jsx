import React from "react";
import { Outlet } from "react-router";
import ClientSidebar from "../../components/client/clientSidebar/ClientSidebar";
import ClientNavbar from "../../components/client/clientNavbar/ClientNavbar";
import { useLocation } from "react-router";
import Dashboard from "../../components/client/dashboard/Dashboard";

export default function ClientLayout() {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <ClientSidebar />

      {/* Main Content */}
      <div className=" flex-1">
        {/* Navbar */}
        <ClientNavbar />

        {/* Page Content */}
        <main className="">
          {location.pathname === "/user/dashboard" && <Dashboard />}
        </main>
      </div>
    </div>
  );
}
