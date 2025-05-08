import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminAttendance = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    department: "",
    employeeName: "",
  });

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      department: "",
      employeeName: "",
    });
    setFilteredData(allData); // Restore full data
  };

  const token = localStorage.getItem("adminToken");

  const manualDepartments = ["HR", "Engineering", "Sales", "Finance"];

  const fetchAllAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/allAttendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllData(res.data.data);
      setFilteredData(res.data.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch attendance");
    }
  };

  useEffect(() => {
    fetchAllAttendance();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    let result = [...allData];

    if (filters.startDate) {
      result = result.filter(
        (r) => new Date(r.startdate) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      result = result.filter(
        (r) => new Date(r.startdate) <= new Date(filters.endDate)
      );
    }

    if (filters.department) {
      result = result.filter(
        (r) =>
          r.employeeId?.department?.toLowerCase() ===
          filters.department.toLowerCase()
      );
    }

    if (filters.employeeName) {
      result = result.filter((r) =>
        r.employeeId?.name
          ?.toLowerCase()
          .includes(filters.employeeName.toLowerCase())
      );
    }

    setFilteredData(result);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">
        Attendance Records
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="border rounded p-2"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="border rounded p-2"
        />
        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="border rounded p-2"
        >
          <option value="">All Departments</option>
          {manualDepartments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="employeeName"
          value={filters.employeeName}
          onChange={handleFilterChange}
          placeholder="Search by name"
          className="border rounded p-2"
        />
        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
        <button
          onClick={resetFilters}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Reset Filters
        </button>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Department</th>
              <th className="py-2 px-4 text-left">Check-In</th>
              <th className="py-2 px-4 text-left">Check-Out</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No records found
                </td>
              </tr>
            ) : (
              filteredData.map((record) => (
                <tr key={record._id} className="border-t">
                  <td className="py-2 px-4">
                    {new Date(record.startdate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">{record.employeeId?.name}</td>
                  <td className="py-2 px-4">{record.employeeId?.email}</td>
                  <td className="py-2 px-4">{record.employeeId?.department}</td>
                  <td className="py-2 px-4">{record.checkInTime || "-"}</td>
                  <td className="py-2 px-4">{record.checkOutTime || "-"}</td>
                  <td className="py-2 px-4">{record.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAttendance;
