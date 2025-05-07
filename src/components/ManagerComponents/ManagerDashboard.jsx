import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ManagerProfile from "./ManagerProfile";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import ManagerApproveLeave from "./ManagerApproveLeave";
import ManagerVerfiyUser from "./ManagerVerfiyUser";
import ManagerChat from "./ManagerChat";
import ManagerRating from "./ManagerRating";
import ManagerAttendanceOverview from "./ManagerAttendanceOverview";
import ManagerAssingTask from "./ManagerAssingTask";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [manager, setManagerProfile] = useState({});
  const [showmanagerPofile, setShowManagerProfile] = useState(false);
  const [empCount, setEmpCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [mainDashboard, setMainDashboard] = useState(true);
  const [showApproveLeave, setShowApproveLeave] = useState(false);
  const [approveLeave, setApproveLeave] = useState([]);
  const [showVerfiyUser, setShowVerfiyUser] = useState(false);
  const [showManagerChat, setShowManagerChat] = useState(false);
  const [showPerformance, setShowPerformacne] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showAssingTask, setShowAssingTask] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("managerToken");
    const managerProfile = localStorage.getItem("managerProfile");
    console.log(managerProfile);

    if (managerProfile) {
      const parsedProfile = JSON.parse(managerProfile);
      console.log(parsedProfile);

      setManagerProfile(parsedProfile);
    } else {
      toast.error("No User Found");
      navigate("/Manager/Login"); // if no user found, redirect to login
    }
  }, []);
  useEffect(() => {
    const countFetcher = async () => {
      const token = localStorage.getItem("managerToken");
      console.log(token);
      try {
        const res = await axios.post(
          "https://ems-backend-0xxx.onrender.com/manager/empCount",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // if you have token based login
            },
          }
        );
        if (res.data) {
          setEmpCount(res.data.count);
        }
      } catch (error) {
        console.log("Error", error);
      }
    };
    countFetcher();
  }, []);
  useEffect(() => {
    const countFetcher = async () => {
      const token = localStorage.getItem("managerToken");
      console.log(token);
      try {
        const res = await axios.post(
          "https://ems-backend-0xxx.onrender.com/manager/leaveCount",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // if you have token based login
            },
          }
        );
        console.log(res.data.leaves);

        if (res.data) {
          setLeaveCount(res.data.count);
          setApproveLeave(res.data.leaves);
        }
      } catch (error) {
        console.log("Error", error);
      }
    };
    countFetcher();
  }, []);

  const handleLogout = () => {
    setManagerProfile("");
    localStorage.removeItem("managerToken"); // remove token

    navigate("/Manager/Login");
  };

  return (
    <div className="flex h-screen">
      <ToastContainer autoClose="2000" position="top-right" />
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Manager Panel</h2>

        <ul className="flex flex-col h-full space-y-4">
          <div className="space-y-4">
            <li>
              <button
                onClick={() => {
                  setShowManagerProfile(false);
                  setShowApproveLeave(false);
                  setMainDashboard(true);
                  setShowVerfiyUser(false);
                  setShowManagerChat(false);
                  setShowPerformacne(false);
                  setShowAttendance(false);
                  setShowAssingTask(false);
                }}
              >
                <Link className="hover:text-blue-400">Home Page</Link>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowManagerProfile(true);
                  setShowApproveLeave(false);
                  setMainDashboard(false);
                  setShowVerfiyUser(false);
                  setShowManagerChat(false);
                  setShowPerformacne(false);
                  setShowAttendance(false);
                  setShowAssingTask(false);
                }}
              >
                <Link className="hover:text-blue-400">View Profile</Link>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowManagerProfile(false);
                  setShowApproveLeave(true);
                  setMainDashboard(false);
                  setShowVerfiyUser(false);
                  setShowManagerChat(false);
                  setShowPerformacne(false);
                  setShowAttendance(false);
                  setShowAssingTask(false);
                }}
              >
                <Link className="hover:text-blue-400">Approve Leave</Link>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowManagerProfile(false);
                  setShowApproveLeave(false);
                  setMainDashboard(false);
                  setShowVerfiyUser(false);
                  setShowManagerChat(false);
                  setShowPerformacne(false);
                  setShowAttendance(false);
                  setShowAssingTask(true);
                }}
              >
                <Link className="hover:text-blue-400">Assign Task</Link>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowManagerProfile(false);
                  setShowApproveLeave(false);
                  setMainDashboard(false);
                  setShowVerfiyUser(true);
                  setShowManagerChat(false);
                  setShowPerformacne(false);
                  setShowAttendance(false);
                  setShowAssingTask(false);
                }}
              >
                <Link className="hover:text-blue-400">Verify User</Link>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowManagerProfile(false);
                  setShowApproveLeave(false);
                  setMainDashboard(false);
                  setShowVerfiyUser(false);
                  setShowManagerChat(false);
                  setShowPerformacne(true);
                  setShowAttendance(false);
                  setShowAssingTask(false);
                }}
              >
                <Link className="hover:text-blue-400">Performance Rating</Link>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowManagerProfile(false);
                  setShowApproveLeave(false);
                  setMainDashboard(false);
                  setShowVerfiyUser(false);
                  setShowManagerChat(true);
                  setShowPerformacne(false);
                  setShowAttendance(false);
                  setShowAssingTask(false);
                }}
              >
                <Link className="hover:text-blue-400">Chat With Team</Link>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowManagerProfile(false);
                  setShowApproveLeave(false);
                  setMainDashboard(false);
                  setShowVerfiyUser(false);
                  setShowManagerChat(false);
                  setShowPerformacne(false);
                  setShowAttendance(true);
                  setShowAssingTask(false);
                }}
              >
                <Link className="hover:text-blue-400">Attendance Overview</Link>
              </button>
            </li>
          </div>

          <li className="mt-auto">
            <button onClick={handleLogout}>
              <Link className="hover:text-blue-400">Logout</Link>
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="h-16 bg-white shadow flex items-center justify-end px-6">
          <div className="flex items-center space-x-3">
            {/* <span className="font-medium text-gray-700">Manager</span> */}
            <img
              src={manager.profilePicture} // You can replace with dynamic profile image
              width={40}
              height={40}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        {mainDashboard && (
          <main className="p-6 bg-gray-100 flex-1 overflow-auto">
            <h1 className="text-2xl font-semibold mb-4">
              Welcome to the Manager Dashboard {manager.name}
            </h1>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 shadow rounded-lg">
                <h2 className="text-lg font-medium">Total Employees</h2>
                <p className="text-3xl font-bold mt-2">{empCount}</p>{" "}
                {/* Replace with dynamic count */}
              </div>

              {/* Add more cards or widgets here */}
              <div className="bg-white p-4 shadow rounded-lg">
                <h2 className="text-lg font-medium">Pending Leaves</h2>
                <p className="text-3xl font-bold mt-2">{leaveCount}</p>
              </div>
            </div>
          </main>
        )}
        {showmanagerPofile && <ManagerProfile />}
        {showApproveLeave && <ManagerApproveLeave allLeave={approveLeave} />}
        {showVerfiyUser && <ManagerVerfiyUser />}
        {showManagerChat && <ManagerChat department={manager.department} />}
        {showPerformance && <ManagerRating allUsers={manager.empId} />}
        {showAttendance && <ManagerAttendanceOverview />}
        {showAssingTask && <ManagerAssingTask />}
      </div>
    </div>
  );
};

export default ManagerDashboard;
