import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Authentication logic here (you can call your API or handle routing)
    console.log("Login attempt", { email, password });
    try {
      const res = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
      console.log(res);
      if (res.data.status == "success") {
        toast.success("Login Successfull");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        console.log(res.data.user);

        setEmail("");
        setPassword("");
        navigate("/user");
      }
      if (res.response && res.response.data && res.response.data.message) {
        // If backend sent a custom error message
        toast.error(error.response.data.message);
        setEmail("");
        setpassword("");
      } else {
        // Generic error
        toast.error("Something went wrong. Please try again.");
        setEmail("");
        setPassword("");
      }
      if (res.data.message == "Invaild User Or Password") {
        toast.error("Invaild User Or Password");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.log("Error", error);
      if (error.response.data.message) {
        toast.error(error.response.data.message);
        setEmail("");
        setPassword("");
      } else {
        toast.error("Something is worng  ");
      }
    }
  };

  return (
    <>
      <ToastContainer autoClose="2000" position="top-right" />
      <div className="bg-gray-100 min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="bg-blue-600 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-xl font-semibold">EMS</div>
            <div className="space-x-6">
              <button
                onClick={() => navigate("/Manager/Login")}
                className="text-white hover:text-gray-300"
              >
                Manager
              </button>
              <button
                onClick={() => navigate("/Admin/Login")}
                className="text-white hover:text-gray-300"
              >
                Admin
              </button>

              <button
                onClick={() => navigate("/register")}
                className="text-white hover:text-gray-300"
              >
                Register
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-1 items-center justify-center bg-blue-50 py-16">
          <div className="container mx-auto flex justify-between items-center">
            {/* Left - Login Form */}

            {/* Right - Hero Section Text */}
            <div className="w-full md:w-1/2 pl-8">
              <h1 className="text-5xl font-bold text-gray-800 mb-4 animate__animated animate__fadeIn animate__delay-1s">
                Employee Management System
              </h1>
              <p className="text-lg text-gray-600 mb-6 animate__animated animate__fadeIn animate__delay-2s">
                Manage employees efficiently with our simple and easy-to-use EMS
                platform. Track attendance, payroll, and more.
              </p>
              <button
                onClick={() => history.push("/register")}
                className="py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
              >
                Get Started
              </button>
            </div>
            <div className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                Login to Your Account
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-600">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                >
                  Login
                </button>
              </form>
              <p className="text-gray-600 mt-4 text-center">
                Forgot your password?{" "}
                <Link
                  onClick={() => toast("Feature Coming Soon")}
                  className="text-blue-600 hover:underline"
                >
                  Recover it
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
