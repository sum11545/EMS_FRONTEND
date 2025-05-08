import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminLeave = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    startdate: "",
    enddate: "",
  });

  const resetFilters = () => {
    setFilters({
      name: "",
      status: "",
      startdate: "",
      enddate: "",
    });
    setFilteredData(allData); // Reset to show all data
  };

  const token = localStorage.getItem("adminToken");

  const fetchAllLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllData(res.data.data);
      setFilteredData(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch leave data");
    }
  };

  useEffect(() => {
    fetchAllLeaves();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    let result = [...allData];

    if (filters.name) {
      result = result.filter((r) =>
        r.empolyeeId?.name?.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.status) {
      result = result.filter(
        (r) => r.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.startdate) {
      result = result.filter(
        (r) => new Date(r.startdate) >= new Date(filters.startdate)
      );
    }

    if (filters.enddate) {
      result = result.filter(
        (r) => new Date(r.enddate) <= new Date(filters.enddate)
      );
    }

    setFilteredData(result);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-700">
        All Leave Requests
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          name="name"
          placeholder="Search by Name"
          value={filters.name}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="startdate"
          value={filters.startdate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="enddate"
          value={filters.enddate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={applyFilters}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Apply Filters
        </button>
        <button
          onClick={resetFilters}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Department</th>
              <th className="py-2 px-4">Start Date</th>
              <th className="py-2 px-4">End Date</th>
              <th className="py-2 px-4">Reason</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Applied On</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No leave requests found
                </td>
              </tr>
            ) : (
              filteredData.map((leave) => (
                <tr key={leave._id} className="border-t">
                  <td className="py-2 px-4">{leave.empolyeeId?.name}</td>
                  <td className="py-2 px-4">{leave.empolyeeId?.email}</td>
                  <td className="py-2 px-4">{leave.empolyeeId?.department}</td>
                  <td className="py-2 px-4">
                    {new Date(leave.startdate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(leave.enddate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">{leave.reason}</td>
                  <td className="py-2 px-4 capitalize">{leave.status}</td>
                  <td className="py-2 px-4">
                    {new Date(leave.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLeave;
