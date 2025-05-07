import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagerAttendanceOverview = () => {
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [attendanceData, setAttendanceData] = useState([]);

  const fetchAttendance = async (selectedDate) => {
    try {
      const token = localStorage.getItem("managerToken");
      const res = await axios.post(
        `https://ems-backend-0xxx.onrender.com/manager/attendanceOverview`,
        {
          date: selectedDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      setAttendanceData(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch attendance", err);
    }
  };

  useEffect(() => {
    fetchAttendance(date);
  }, [date]);

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Attendance Overview</h2>

        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <label className="text-sm font-medium text-gray-600">
            Select Date:
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 border">Employee Name</th>
                <th className="p-3 border">Check In</th>
                <th className="p-3 border">Check Out</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Hours Worked</th>
                <th className="p-3 border">Overtime</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    No records found.
                  </td>
                </tr>
              ) : (
                attendanceData.map((record) => (
                  <tr key={record._id} className="text-center">
                    <td className="p-3 border">{record.employeeId?.name}</td>
                    <td className="p-3 border">{record.checkInTime || "-"}</td>
                    <td className="p-3 border">{record.checkOutTime || "-"}</td>
                    <td
                      className={`p-3 border ${
                        record.status === "Present"
                          ? "text-green-600"
                          : record.status === "Half Day"
                          ? "text-yellow-500"
                          : "text-red-600"
                      }`}
                    >
                      {record.status}
                    </td>
                    <td className="p-3 border">
                      {record.totalHoursWorked
                        ? `${record.totalHoursWorked} hrs`
                        : "-"}
                    </td>
                    <td className="p-3 border">{record.overtime || 0} hrs</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerAttendanceOverview;
