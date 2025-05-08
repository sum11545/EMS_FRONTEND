import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const ManagerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/manager/login", {
        email,
        password,
      });
      await localStorage.setItem("managerToken", res.data.token);
      await localStorage.setItem(
        "managerProfile",
        JSON.stringify(res.data.user)
      );
      console.log(res.data.user);

      navigate("/manager/Dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <ToastContainer autoClose="2000" position="top-right" />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Manager Login</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
          <button
            className="mt-3 text-center"
            onClick={() => {
              navigate("/Manager/Register");
            }}
          >
            <p>
              Need a account{" "}
              <span className="text-blue-400">Register Here</span>{" "}
            </p>
          </button>
          <br />
          <button
            onClick={() => toast("Feature Coming Soon")}
            className="hover:text-blue-400"
          >
            {" "}
            <p>Forget Password</p>
          </button>
          <button
            onClick={() => navigate("/")}
            className="  bg-gray-300 px-1 py-1 rounded hover:bg-gray-400 transition"
          >
            Go Back
          </button>
        </form>
      </div>
    </>
  );
};

export default ManagerLogin;
