import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManagerVerifyUser = () => {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("managerToken");
        const res = await axios.post(
          "https://ems-backend-0xxx.onrender.com/manager/unverfiedUserList",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data) {
          setAllUsers(res.data.unverifiedUsers);
        }
      } catch (err) {
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleVerify = async (userid) => {
    try {
      const token = localStorage.getItem("managerToken");
      const res = await axios.post(
        "https://ems-backend-0xxx.onrender.com/manager/verfiyuser",
        { userID: userid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("User verified");
      setAllUsers((prev) => prev.filter((u) => u._id !== userid));
    } catch (err) {
      console.log(err);
      toast.error("Verification failed");
    }
  };

  const handleCancel = (userId) => {
    toast.info("Verification cancelled");
    setAllUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Unverified Users</h2>
      {allUsers.length === 0 ? (
        <p className="text-gray-600">No unverified users.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-md rounded-lg p-6 border"
            >
              <p className="text-lg font-semibold">{user.name}</p>
              <p>ID: {user._id}</p>
              <p>Email: {user.email}</p>
              <p>Department: {user.department}</p>
              <p>Address: {user.address}</p>
              <p>Join Date: {new Date(user.joindate).toLocaleDateString()}</p>
              <p>Salary: ₹{user.basesalary}</p>
              <p>
                ProfilePic:{" "}
                <img src={user.profileimage} width={80} height={80} alt="" />
              </p>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleVerify(user._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleCancel(user._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerVerifyUser;
