import { React, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const ManagerApproveLeave = ({ allLeave }) => {
  const [leaves, setLeaves] = useState([]);
  useEffect(() => {
    if (allLeave && allLeave.length > 0) {
      const pending = allLeave.filter((leave) => leave.status === "Pending");
      setLeaves(pending);
    }
  }, [allLeave]);

  const handleApproveLeave = async (leaveId) => {
    try {
      const token = localStorage.getItem("managerToken");

      const res = await axios.post(
        "http://localhost:3000/manager/approveLeave",
        { leaveId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data) {
        toast.success("Leave approved successfully");
        setLeaves((prev) => prev.filter((l) => l._id !== leaveId));
      }
    } catch (error) {
      console.log("Error", error);
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleRejectLeave = async (leaveId) => {
    try {
      const token = localStorage.getItem("managerToken");
      const remark = prompt("Please enter a remark for rejection:");
      if (!remark) return;

      const res = await axios.post(
        "http://localhost:3000/manager/rejectLeave",
        { leaveId, remark: remark },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data) {
        toast.success("Rejected successfully");
        setLeaves((prev) => prev.filter((l) => l._id !== leaveId));
      }
    } catch (error) {
      console.log("Error", error);
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Pending Leave Requests</h2>

      {leaves.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {leaves.map((leave) => (
            <div
              key={leave._id}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-2"
            >
              <p>
                <strong>Employee ID:</strong> {leave.empolyeeId}
              </p>
              <p>
                <strong>Reason:</strong> {leave.reason}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(leave.startdate).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {new Date(leave.enddate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {leave.status}
              </p>
              <p>
                <strong>Total Days:</strong> {leave.totaldays}
              </p>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => {
                    handleApproveLeave(leave._id);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    handleRejectLeave(leave._id);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No pending leave requests.</p>
      )}
    </div>
  );
};

export default ManagerApproveLeave;
