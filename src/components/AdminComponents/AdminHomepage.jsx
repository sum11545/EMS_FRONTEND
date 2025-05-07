import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaUserTie,
  FaBuilding,
  FaClipboardList,
  FaCalendarCheck,
} from "react-icons/fa";

const AdminHomepage = () => {
  const [stats, setStats] = useState({
    employees: 0,
    managers: 0,
    departments: 0,
    leaves: 0,
    attendance: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(
          "https://ems-backend-0xxx.onrender.com/admin/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(res);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  const cardStyle = "bg-white shadow-lg rounded-xl p-6 flex items-center gap-4";

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cardStyle}>
          <FaUsers className="text-blue-500 text-3xl" />
          <div>
            <p className="text-sm text-gray-500">Total Employees</p>
            <h2 className="text-xl font-semibold">{stats.totalEmployees}</h2>
          </div>
        </div>
        <div className={cardStyle}>
          <FaUserTie className="text-green-500 text-3xl" />
          <div>
            <p className="text-sm text-gray-500">Total Managers</p>
            <h2 className="text-xl font-semibold">{stats.totalManagers}</h2>
          </div>
        </div>
        <div className={cardStyle}>
          <FaBuilding className="text-yellow-500 text-3xl" />
          <div>
            <p className="text-sm text-gray-500">Departments</p>
            <h2 className="text-xl font-semibold">{stats.totalDepartments}</h2>
          </div>
        </div>
        <div className={cardStyle}>
          <FaClipboardList className="text-red-500 text-3xl" />
          <div>
            <p className="text-sm text-gray-500">Leave Requests</p>
            <h2 className="text-xl font-semibold">{stats.totalLeaves}</h2>
          </div>
        </div>
        <div className={cardStyle}>
          <FaCalendarCheck className="text-purple-500 text-3xl" />
          <div>
            <p className="text-sm text-gray-500">Attendance Logs</p>
            <h2 className="text-xl font-semibold">
              {stats.totalAttendanceLogs}
            </h2>
          </div>
        </div>
        <div className={cardStyle}>
          <FaUsers className="text-purple-500 text-3xl" />
          <div>
            <p className="text-sm text-gray-500">Total Pending Manager</p>
            <h2 className="text-xl font-semibold">{stats.pendingManagers}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomepage;
