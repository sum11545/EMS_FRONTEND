import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ManagerProfile = () => {
  const [managerProfile, setManagerProfile] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("managerToken");
    const managerProfile = localStorage.getItem("managerProfile");

    if (managerProfile) {
      try {
        const parsedProfile = JSON.parse(managerProfile);
        setManagerProfile(parsedProfile);
      } catch (err) {
        toast.error("Failed to parse profile");
      }
    } else {
      toast.error("No User Found");
      navigate("/Manager/Login");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ToastContainer autoClose="2000" position="top-right" />
      {/* Top Edit Button */}
      <div className="flex justify-end mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => toast.info("Edit feature coming soon")}
        >
          Edit Profile
        </button>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center space-y-4">
        <img
          src={managerProfile.profilePicture}
          alt="Profile"
          className="w-44 h-44 rounded-full object-cover shadow-md"
        />
        <h2 className="text-3xl font-bold text-gray-800">
          {managerProfile.name}
        </h2>
        <p className="text-lg text-gray-700">
          <strong>Department:</strong> {managerProfile.department}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Email:</strong> {managerProfile.email}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Contact No:</strong> {managerProfile.contactNo}
        </p>
      </div>

      {/* Back to Dashboard */}
    </div>
  );
};

export default ManagerProfile;
