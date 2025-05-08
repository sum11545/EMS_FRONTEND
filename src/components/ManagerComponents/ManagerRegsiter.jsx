import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

const ManagerRegister = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [joindate, setJoindate] = useState("");
  const [department, setDepartment] = useState("");
  // const [basesalary, setBasesalary] = useState("");
  const [address, setaddress] = useState("");
  const [profileimage, setProfileimage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [uploading, setUploading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [passwordError, SetPasswordError] = useState("");
  const [contactError, setContactError] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return toast.error("No image selected");
    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG and JPEG image files are allowed.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData(); // <-- create FormData here
      formData.append("file", file);
      formData.append("upload_preset", "my_preset");
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dgziqwwhn/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data) {
        toast.success("Image uploaad Succesfull");
        setProfileimage(res.data.secure_url);
      }
    } catch (error) {
      toast.error("Upload failed");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post("http://localhost:3000/manager/register", {
        name,
        department,
        email,
        password,
        profilePicture: profileimage,
        contactNo: contact,
      });
      console.log(res);

      if (res.data.message) {
        toast.success(
          "Register Successfull will You get Mail once you verfied  "
        );
        setName("");

        setDepartment("");
        setEmail("");
        setPassword("");

        setProfileimage("");
        setUploading(false);
        setaddress("");
        setContact("");
        setTimeout(() => navigate("/Manager/Login"), 2000);
      }
    } catch (error) {
      console.log("Error", error);
      if (error.response.data.message) {
        // If backend sent a custom error message
        toast.error(error.response.data.message);
      } else {
        // Generic error
        toast.error("Something went wrong. Please try again.");
      }
    }
  };
  const handleName = (e) => {
    const val = e.target.value;
    setName(val);
    const RegEx = /[^a-zA-Z\s]/; // Disallow digits and symbols

    if (RegEx.test(val)) {
      setNameError("Name cannot contain numbers or special characters");
    } else {
      setNameError("");
    }
  };
  // const handleAddress = (e) => {
  //   const val = e.target.value;
  //   setaddress(val);

  //   // Allow: letters, numbers, spaces, commas, periods, hyphens, slashes
  //   const RegEx = /^[a-zA-Z0-9\s,./-]*$/;

  //   if (!RegEx.test(val)) {
  //     setAddressError("Address cannot contain special characters.");
  //   } else {
  //     setAddressError("");
  //   }
  // };
  const handleContact = (e) => {
    const value = e.target.value;

    // Allow only digits
    if (/^\d*$/.test(value)) {
      if (value.length <= 10) {
        setContact(value);
        setContactError("");
      } else {
        setContactError("Contact number should not exceed 10 digits.");
      }
    } else {
      setContactError("Only digits are allowed.");
    }
  };

  const handleCancelUpload = () => {
    setImageFile(null);
    setUploading(false);
    // Reset file input manually
    document.getElementById("imageInput").value = "";
  };

  const handlePassword = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (val.length < 8) {
      SetPasswordError("Password must be at least 8 characters");
    } else {
      SetPasswordError("");
    }
  };
  return (
    <>
      <ToastContainer autoClose={2000} position="top-right" />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
        <form className="w-full max-w-4xl bg-white p-10 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-10">
            Manager Registration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleName}
                  className="form-input"
                />
                {nameError && (
                  <p className="text-red-500 text-sm mt-1">{nameError}</p>
                )}
              </div>
              {/* <div>
                <label className="form-label">Age</label>
                <input
                  type="number"
                  name="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="form-input"
                />
              </div> */}
              {/* <div>
                <label className="form-label">Join Date</label>
                <input
                  type="date"
                  name="joindate"
                  value={joindate}
                  onChange={(e) => setJoindate(e.target.value)}
                  max={today}
                  className="form-input"
                />
              </div> */}
              <div>
                <label className="form-label">Department</label>
                <select
                  name="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="form-input"
                >
                  <option value="">Select Department</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>

              {/* <div>
                  <label className="form-label">Base Salary</label>
                  <input
                    type="number"
                    name="basesalary"
                    value={basesalary}
                    onChange={(e) => setBasesalary(e.target.value)}
                    className="form-input"
                  />
                </div> */}
              {/* <div>
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={address}
                  onChange={handleAddress}
                  className="form-input"
                />
                {addressError && (
                  <p className="text-red-500 text-sm mt-1">{addressError}</p>
                )}
              </div> */}
              <div>
                <label className="form-label">Upload Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="form-input"
                />
                {uploading && (
                  <p className="text-sm text-blue-500 mt-1">
                    Uploading image...
                  </p>
                )}

                {uploading && (
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={handleCancelUpload}
                      className="text-red-500 text-sm underline hover:text-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* <div>
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={address}
                  onChange={(e) => setaddress(e.target.value)}
                  className="form-input"
                />
              </div> */}

              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handlePassword}
                  className="form-input"
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>
              <div>
                <label className="form-label">Contact No</label>
                <input
                  type="text"
                  maxLength={10}
                  name="contact"
                  value={contact}
                  onChange={handleContact}
                  className="form-input"
                />
                {contactError && (
                  <p className="text-red-500 text-sm mt-1">{contactError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              onClick={handleRegister}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Register
            </button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/Manager/Login"
                className="text-blue-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
      <style jsx="true">{`
        .form-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }
        .form-input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          background-color: #f9fafb;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .form-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
          outline: none;
        }
      `}</style>
    </>
  );
};

export default ManagerRegister;
