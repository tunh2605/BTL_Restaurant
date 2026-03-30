import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavBar from "../../components/admin/AdminNavBar";
import AdminSideBar from "../../components/admin/AdminSideBar";

const Layout = () => {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <AdminSideBar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminNavBar />
          <div className="flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
