import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBuilding,
  FaClipboardList,
  FaUserCheck,
  FaThLarge,
  FaSignOutAlt,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import AdminHomepage from "./AdminHomepage";
import AdminVerifyManagers from "./AdminManagerVerfiy";
import AdminManageManager from "./AdminManageManager";
import AdminManageEmployees from "./AdminManageEmploye";
import AdminAttendance from "./AdminAttendance";
import AdminLeave from "./AdminLeave";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(true);
  const [showMangerVerfiy, setShowManagerVerfiy] = useState(false);
  const [showManageManger, setShowManageManager] = useState(false);
  const [showManageEmploye, setShowManageEmployee] = useState(false);
  const [showattendance, setShowAttendance] = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  return (
    <div className="flex min-h-screen">
      <ToastContainer autoClose="2000" position="top-right" />
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
        <nav className="space-y-4">
          <button
            onClick={() => {
              setShowDashboard(true);
              setShowManagerVerfiy(false);
              setShowManageManager(false);
              setShowManageEmployee(false);
              setShowAttendance(false);
              setShowLeave(false);
            }}
          >
            <Link className="flex items-center gap-2 hover:text-yellow-300">
              <FaThLarge /> Dashboard
            </Link>
          </button>
          <button
            onClick={() => {
              setShowDashboard(false);
              setShowManagerVerfiy(true);
              setShowManageManager(false);
              setShowManageEmployee(false);
              setShowAttendance(false);
              setShowLeave(false);
            }}
          >
            <Link className="flex items-center gap-2 hover:text-yellow-300">
              <FaUserCheck /> Verify Managers
            </Link>
          </button>
          <button
            onClick={() => {
              setShowDashboard(false);
              setShowManagerVerfiy(false);
              setShowManageManager(true);
              setShowManageEmployee(false);
              setShowAttendance(false);
              setShowLeave(false);
            }}
          >
            <Link className="flex items-center gap-2 hover:text-yellow-300">
              <FaUsers /> Manage Managers
            </Link>
          </button>
          <button
            onClick={() => {
              setShowDashboard(false);
              setShowManagerVerfiy(false);
              setShowManageManager(false);
              setShowManageEmployee(true);
              setShowAttendance(false);
              setShowLeave(false);
            }}
          >
            {" "}
            <Link className="flex items-center gap-2 hover:text-yellow-300">
              <FaUsers /> Manage Employees
            </Link>
          </button>
          <button
            onClick={() => {
              setShowDashboard(false);
              setShowManagerVerfiy(false);
              setShowManageManager(false);
              setShowManageEmployee(false);
              setShowAttendance(true);
              setShowLeave(false);
            }}
          >
            <Link className="flex items-center gap-2 hover:text-yellow-300">
              <FaClipboardList /> Attendance
            </Link>
          </button>

          <Link
            onClick={() => {
              setShowDashboard(false);
              setShowManagerVerfiy(false);
              setShowManageManager(false);
              setShowManageEmployee(false);
              setShowAttendance(false);
              setShowLeave(true);
            }}
            className="flex items-center gap-2 hover:text-yellow-300"
          >
            <FaClipboardList /> Leaves
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              setShowDashboard(false);
              setShowManagerVerfiy(false);
              setShowManageManager(false);
              setShowManageEmployee(false);
              setShowAttendance(false);
              setShowLeave(false);
              navigate("/Admin/Login");
            }}
            className="flex items-center gap-2 hover:text-yellow-300"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {showDashboard && <AdminHomepage />}
        {showMangerVerfiy && <AdminVerifyManagers />}
        {showManageManger && <AdminManageManager />}
        {showManageEmploye && <AdminManageEmployees />}
        {showattendance && <AdminAttendance />}
        {showLeave && <AdminLeave />}
      </main>
    </div>
  );
};

export default AdminDashboard;
