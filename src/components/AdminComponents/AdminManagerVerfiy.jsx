import React, { useEffect, useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";

const AdminVerifyManagers = () => {
  const [managers, setManagers] = useState([]);

  const fetchUnverifiedManagers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        "https://ems-backend-0xxx.onrender.com/admin/unverfiedManager",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setManagers(res.data);
    } catch (err) {
      toast.error("Failed to load managers");
    }
  };

  const handleVerify = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `https://ems-backend-0xxx.onrender.com/admin/verfiyManager`,
        { managerId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Manager Verified!");
      fetchUnverifiedManagers();
    } catch (err) {
      toast.error("Verification failed");
    }
  };
  const handelReject = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `https://ems-backend-0xxx.onrender.com/admin/rejectManager`,
        { managerId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Manager Rejected!");
      fetchUnverifiedManagers();
    } catch (err) {
      console.log(err);
      toast.error("Rejection failed");
    }
  };

  useEffect(() => {
    fetchUnverifiedManagers();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Unverified Managers</h2>
      {managers.length === 0 ? (
        <p className="text-gray-600">No unverified managers found.</p>
      ) : (
        <div className="space-y-4">
          {managers.map((m) => (
            <div
              key={m._id}
              className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{m.name}</h3>
                <p>Email: {m.email}</p>
                <p>Department: {m.department}</p>
                <img src={m.profilePicture} width={120} height={120} alt="" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleVerify(m._id)}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Verify
                </button>
                <button
                  onClick={() => handelReject(m._id)}
                  className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVerifyManagers;
