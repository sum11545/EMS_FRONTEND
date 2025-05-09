import React, { useEffect, useState } from "react";
import { Bell, LogOut } from "lucide-react"; // install lucide-react for icons
import { data, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  FaUser,
  FaClock,
  FaMoneyBill,
  FaCalendarAlt,
  FaSignOutAlt,
  FaComments,
  FaTasks,
} from "react-icons/fa";

import axios from "axios";
import EmployeeChat from "./EmployeeChat";
import EmpolyeeTask from "./EmpolyeeTask";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [showProfile, setShowProfile] = useState(true);
  const [attendance, setAttendance] = useState(false);
  const [salary, setSalaary] = useState(false);
  const [deadline, setDeadline] = useState(false);
  const [tasks, setTasks] = useState([""]);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allTask, setAllTasks] = useState([]);
  const [employee, setEmployee] = useState("");
  const [month, setMonth] = useState("");
  const [attendanceRecord, setAttendanceRecord] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [applyLeave, setApplyLeave] = useState(false);
  const [reason, setReason] = useState("");
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [showLeave, setShowLeave] = useState(false);
  const [showLeaveRecord, setShowLeaveRecord] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showAssingTask, setShowAssingTask] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      navigate("/"); // if no user found, redirect to login
    }
  }, []);
  useEffect(() => {
    if (month) {
      filterAttendance();
      setAttendanceRecord(true); // mark that we now have a record request
    }
  }, [month]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/getLeaveInfo", {
          headers: {
            Authorization: `Bearer ${token}`, // if you have token based login
          },
        });
        console.log(res);

        setShowLeaveRecord(res.data.data);
      } catch (error) {
        console.log("Error", error);
        toast.error("Something Went Wrong");
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    // Clear token or whatever logout logic
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };
  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem("token");
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0"); // adds leading 0 if needed
      const minutes = now.getMinutes().toString().padStart(2, "0");

      const currentTime = `${hours}:${minutes}`; // Example: "09:30"
      console.log(currentTime);

      const res = await axios.post(
        "http://localhost:3000/attendance/Checkin",
        {
          checkIn: currentTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // if you have token based login
          },
        }
      );

      console.log(res.data);
      toast.success(res.data.message || "Check-in successful!");
      setEmployee(res.data.data);
    } catch (error) {
      toast.error("Error in Attendance ");
      console.error("Check-in failed", error);
      if (error.response.data.message) {
        // Backend responded with error message
        toast.error(error.response.data.message);
      } else {
        // Network error or other
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };
  const handleCheckOut = async () => {
    try {
      const token = localStorage.getItem("token");
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      console.log(formattedTime);

      const response = await axios.post(
        "http://localhost:3000/attendance/Checkout",
        {
          checkOut: formattedTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      toast.success(response.data.message || "Check-out successful!");
    } catch (error) {
      console.error(
        "Check-out failed:",
        error?.response?.data?.message || error.message
      );

      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };
  const handleSalary = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/salary",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);

      if (res) {
        setSalaary(res.data.data);
      }
    } catch (error) {
      console.log("Error is ", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/setdeadline",
        {
          task: tasks,
          title: title,
          startdate: startDate,
          enddate: endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // correct placement here
          },
        }
      );
      if (res.data) {
        toast.success("Deadline Added");
        setTasks([]);
        setTitle("");
        setEndDate("");
        setStartDate("");
      } // check response if you want
    } catch (error) {
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
      console.log("Error submitting task:", error);
    }
  };

  const addTaskField = () => {
    setTasks([...tasks, ""]);
  };

  const handleTaskChange = (index, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = value;
    setTasks(updatedTasks);
  };
  const deleteTaskField = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };
  const HandelGetTask = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/viewdeadline", {
        headers: {
          Authorization: `Bearer ${token}`, // correct placement here
        },
      });
      console.log(res);
      if (res.data && res.data.data.length > 0) {
        toast.success("Tasks fetched successfully");
        setAllTasks(res.data.data); // 👈 Store array of tasks
      } else {
        toast.info("No tasks available");
        setAllTasks([]);
      }
    } catch (error) {
      console.log("Error", error);
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };
  const getAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/getAttendance", {
        headers: {
          Authorization: `Bearer ${token}`, // correct placement here
        },
      });
      console.log(res);

      setAttendanceList(res.data.data);
    } catch (error) {
      console.log("Error", error);
    }
  };
  const filterAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/filterAttendance",
        {
          month: month,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // correct placement here
          },
        }
      );
      console.log(res);

      setAttendanceList(res.data.data);
      setAttendanceRecord(true);
    } catch (error) {
      console.log("Error", error);

      if (error.response.data.message) {
        toast.error(error.response.data.message);
      }
      setAttendanceList([]);
      setAttendanceRecord(false);
    }
  };
  const handleLeave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/applyLeave",
        {
          reason: reason,
          startdate: leaveStart,
          enddate: leaveEnd,
          type: leaveType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // correct placement here
          },
        }
      );
      console.log(res);

      if (res.data) {
        toast.success("Leave Apply Successfull");
        setReason("");
        setLeaveStart("");
        setLeaveEnd("");
        setLeaveType("");
      }
    } catch (error) {
      console.log("Error", error);

      if (error.response.data.message) {
        toast.error(error.response.data.message);
      }
    }
  };
  const fetchNotificationCount = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:3000/notificationCount", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUnreadCount(res.data.data.count);
    setNotifications(res.data.data.notifications);

    console.log(res);
  };

  const markNotificationsAsRead = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "http://localhost:3000/notificationMarked",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUnreadCount(0);
    setNotifications([]);
    setShowDropdown(true);
    fetchNotificationCount(); // refresh list
  };
  useEffect(() => {
    fetchNotificationCount();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchNotificationCount();
  }, []);

  const handleBellClick = async () => {
    if (showDropdown) {
      setShowDropdown(false);
    } else {
      await markNotificationsAsRead();
      setShowDropdown(true);
    }
  };

  return (
    <>
      <ToastContainer autoClose="2000" position="top-right" />
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white flex flex-col">
          <nav className="flex-1 px-4 py-6 space-y-4">
            <button
              onClick={() => [
                setAttendance(false),
                setSalaary(false),
                setDeadline(false),
                setShowProfile(true),
                setApplyLeave(false),
                setAttendanceRecord(false),
                setShowLeave(false),
                setShowChat(false),
                setShowAssingTask(false),
              ]}
              className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded"
            >
              <FaUser />
              Profile
            </button>

            <button
              onClick={() => {
                setAttendance(true);
                setShowProfile(false);
                setDeadline(false);
                getAttendance();
                setSalaary(false);
                setAttendanceRecord(true);
                setApplyLeave(false);
                setShowLeave(false);
                setShowChat(false);
                setShowAssingTask(false);
              }}
              className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded"
            >
              <FaClock />
              Attendance
            </button>

            <button
              onClick={() => [
                setSalaary(true),
                setAttendance(false),
                setShowProfile(false),
                handleSalary(),
                setApplyLeave(false),
                setDeadline(false),
                setAttendanceRecord(false),
                setShowLeave(false),
                setShowChat(false),
                setShowAssingTask(false),
              ]}
              className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded"
            >
              <FaMoneyBill />
              View Salary
            </button>

            <button
              onClick={() => [
                setDeadline(true),
                setAttendance(false),
                setSalaary(false),
                setShowProfile(false),
                setAttendanceRecord(false),
                setApplyLeave(false),
                setShowLeave(false),
                setShowChat(false),
                setShowAssingTask(false),
              ]}
              className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded"
            >
              <FaCalendarAlt />
              Set Deadline
            </button>

            <button
              onClick={() => {
                setShowProfile(false);
                setApplyLeave(true);
                setAttendance(false);
                setSalaary(false);
                setDeadline(false);
                setAttendanceRecord(false);
                setShowLeave(true);
                setShowChat(false);
                setShowAssingTask(false);
              }}
              className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded"
            >
              <FaCalendarAlt />
              Apply Leave
            </button>

            <button
              onClick={() => {
                setShowChat(true);
                setShowProfile(false);
                setApplyLeave(false);
                setAttendance(false);
                setSalaary(false);
                setDeadline(false);
                setAttendanceRecord(false);
                setShowLeave(false);
                setShowAssingTask(false);
              }}
              className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded"
            >
              <FaComments />
              Team Chat
            </button>

            <button
              onClick={() => {
                setShowChat(false);
                setShowProfile(false);
                setApplyLeave(false);
                setAttendance(false);
                setSalaary(false);
                setDeadline(false);
                setAttendanceRecord(false);
                setShowLeave(false);
                setShowAssingTask(true);
              }}
              className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded"
            >
              <FaTasks />
              View Task
            </button>
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 p-4 bg-red-500 hover:bg-red-600"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navbar */}
          <header className="flex justify-between items-center bg-white p-4 shadow">
            <h1 className="text-2xl font-bold text-blue-700">
              Employee Portal
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell
                  size={24}
                  className="text-gray-700 cursor-pointer"
                  onClick={handleBellClick}
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg border rounded-lg z-50">
                    <ul className="max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((note, i) => (
                          <li
                            key={i}
                            className="p-2 border-b text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {note.message}
                          </li>
                        ))
                      ) : (
                        <li className="p-2 text-sm text-gray-500">
                          No notifications available.
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <img
                src={user.profileimage}
                width={40}
                height={40}
                alt="Profile"
                className="rounded-full cursor-pointer"
              />
            </div>
          </header>

          {/* Main Area */}
          <main className="p-8 bg-gray-100 flex-1">
            <h2 className="text-xl font-semibold mb-4">
              Welcome back, {user.name}!
            </h2>

            {showProfile && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Profile Information</h3>
                  <button
                    onClick={() => toast("feature will be coming Soon")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                </div>

                <div className="space-y-2">
                  <img
                    src={user.profileimage}
                    width={300}
                    height={300}
                    alt=""
                  />
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Department:</strong> {user.department}
                  </p>
                  <p>
                    <strong>Join Date:</strong> {user.joindate}
                  </p>
                  <p>
                    <strong>Address:</strong> {user.address}
                  </p>
                  <p>
                    <strong>Age:</strong> {user.age}
                  </p>

                  {/* Add more fields if needed */}
                </div>
              </div>
            )}

            {attendance && (
              <div className="flex gap-6 mb-8">
                <button
                  onClick={handleCheckIn}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
                >
                  Check In
                </button>
                <button
                  onClick={handleCheckOut}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
                >
                  Check Out
                </button>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Month</option>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {attendanceRecord && attendanceList.length > 0 && (
              <div className="mt-6 w-full overflow-x-auto">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Attendance Records
                </h2>
                <table className="min-w-full bg-white rounded-lg shadow-lg">
                  <thead>
                    <tr className="bg-blue-100 text-blue-800 font-semibold text-sm">
                      <th className="py-3 px-6 text-left">Date</th>
                      <th className="py-3 px-6 text-left">Status</th>
                      <th className="py-3 px-6 text-left">Hours Worked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList.map((attendance) => (
                      <tr
                        key={attendance._id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="py-3 px-6">
                          {new Date(attendance.startdate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6 capitalize">
                          {attendance.status}
                        </td>
                        <td className="py-3 px-6">
                          {attendance.totalHoursWorked
                            ? attendance.totalHoursWorked.toFixed(2)
                            : "0"}{" "}
                          hrs
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {attendanceRecord && attendanceList.length === 0 && (
              <p className="text-center text-gray-600">
                No attendance records found.
              </p>
            )}

            {salary && (
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4 mt-6">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  Salary Information
                </h2>
                <div className="text-gray-700">
                  <p>
                    <span className="font-bold">Base Salary:</span> ₹
                    {salary.baseSalary}
                  </p>
                  <p>
                    <span className="font-bold">Total Payable:</span> ₹
                    {salary.totalPayable}
                  </p>
                  <p>
                    <span className="font-bold">Days Present:</span>{" "}
                    {salary.daysPresent} days
                  </p>
                  <p>
                    <span className="font-bold">Leave Days:</span>{" "}
                    {salary.leaveDays} days
                  </p>
                  <p>
                    <span className="font-bold">Overtime Hours:</span>{" "}
                    {salary.overtimeHours} hrs
                  </p>
                  <p>
                    <span className="font-bold">Month:</span> {salary.month}
                  </p>
                </div>
              </div>
            )}

            {deadline && (
              <>
                <div className="bg-white p-8 rounded-xl shadow-lg mt-6 space-y-6">
                  <h2 className="text-2xl font-bold text-blue-700">
                    Assign New Task
                  </h2>

                  {/* Title Input */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Task Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter task title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Dynamic Task Inputs */}
                  <div className="space-y-4">
                    {tasks.map((task, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-full">
                          <label className="block text-gray-700 font-medium mb-1">
                            Sub Task {index + 1}
                          </label>
                          <input
                            type="text"
                            value={task}
                            onChange={(e) =>
                              handleTaskChange(index, e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        </div>
                        <button
                          onClick={() => deleteTaskField(index)}
                          className="text-red-600 hover:text-red-800 text-2xl mt-6"
                          title="Delete Task"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addTaskField}
                      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                    >
                      + Add Sub Task
                    </button>
                  </div>

                  {/* Start & End Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-right">
                    <button
                      onClick={handleSubmit}
                      className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
                    >
                      Submit Task
                    </button>
                  </div>
                </div>

                {/* Get Task Button */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={HandelGetTask}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition"
                  >
                    View All Tasks
                  </button>
                </div>

                {/* Task Display */}
                <div className="space-y-6 mt-6">
                  {allTask.map((task) => (
                    <div
                      key={task._id}
                      className="p-6 bg-white rounded-xl shadow-md space-y-2"
                    >
                      <h3 className="text-xl font-semibold text-gray-800">
                        {task.title}
                      </h3>

                      <ul className="list-disc list-inside text-gray-600">
                        {Array.isArray(task.task) && task.task.length > 0 ? (
                          task.task.map((sub, idx) => <li key={idx}>{sub}</li>)
                        ) : (
                          <li>No subtasks listed</li>
                        )}
                      </ul>

                      <p className="text-sm text-gray-500">
                        Status:{" "}
                        <span
                          className={
                            task.iscomplete
                              ? "text-green-600"
                              : "text-red-600 font-medium"
                          }
                        >
                          {task.iscomplete ? "Completed" : "Pending"}
                        </span>
                      </p>

                      {!task.iscomplete && (
                        <button
                          onClick={() => handleComplete(task._id)}
                          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-4 rounded transition"
                        >
                          Mark as Complete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {applyLeave && (
              <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6 mt-8">
                <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
                  Apply for Leave
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Reason */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="reason"
                      className="text-gray-700 font-semibold mb-1"
                    >
                      Reason
                    </label>
                    <textarea
                      id="reason"
                      rows="3"
                      placeholder="Enter your reason"
                      className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Leave Type */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="leaveType"
                      className="text-gray-700 font-semibold mb-1"
                    >
                      Leave Type
                    </label>
                    <select
                      id="leaveType"
                      className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                    >
                      <option value="">-- Select Leave Type --</option>
                      <option value="Casual">Casual</option>
                      <option value="Sick">Sick</option>
                      <option value="Earned">Earned Leave</option>
                      <option value="Maternity">Maternity Leave</option>
                    </select>
                  </div>

                  {/* Start Date */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="startDate"
                      className="text-gray-700 font-semibold mb-1"
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      value={leaveStart}
                      onChange={(e) => setLeaveStart(e.target.value)}
                      className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>

                  {/* End Date */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="endDate"
                      className="text-gray-700 font-semibold mb-1"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={leaveEnd}
                      onChange={(e) => setLeaveEnd(e.target.value)}
                      className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleLeave}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition"
                  >
                    Submit Leave Request
                  </button>
                </div>
              </div>
            )}

            {showLeave && (
              <>
                <h3>Previous Leaves:</h3>
                <div className="p-4 bg-gray-100 rounded-md shadow-md">
                  {showLeaveRecord.length > 0 ? (
                    showLeaveRecord.map((leave, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 mb-4 rounded border border-gray-200 shadow-sm"
                      >
                        <p>
                          <strong>Reason:</strong> {leave.reason}
                        </p>
                        <p>
                          <strong>Start Date:</strong> {leave.startdate}
                        </p>
                        <p>
                          <strong>End Date:</strong> {leave.enddate}
                        </p>
                        <p>
                          <strong>Total Days:</strong> {leave.totaldays}
                        </p>
                        <p>
                          <strong>Type:</strong> {leave.type}
                        </p>
                        <p>
                          <strong>Status:</strong> {leave.status}
                        </p>
                        <p>
                          <strong>Remark:</strong> {leave.remark}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No leave records found.</p>
                  )}
                </div>
              </>
            )}
            {showChat && (
              <EmployeeChat department={user.department} username={user.name} />
            )}
            {showAssingTask && <EmpolyeeTask />}

            {/* Put dynamic component here like Profile / Attendance / etc */}
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
