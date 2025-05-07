import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage.jsx";

import "./index.css";
import Register from "./components/Register.jsx";
import Userdashboadrd from "./components/Userdashboard.jsx";
import PrivateRoute from "./Privateroute.jsx";
import ManagerLogin from "./components/ManagerComponents/ManagerLogin.jsx";
import ManagerRegister from "./components/ManagerComponents/ManagerRegsiter.jsx";
import ManagerDashboard from "./components/ManagerComponents/ManagerDashboard.jsx";
import AdminLogin from "./components/AdminComponents/AdminLogin.jsx";
import AdminDashboard from "./components/AdminComponents/AdminDashboard.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/register" element={<Register />}></Route>

        <Route
          path="/user"
          element={
            <PrivateRoute role={"user"}>
              <Userdashboadrd />{" "}
            </PrivateRoute>
          }
        />
        <Route path="/Manager/Login" element={<ManagerLogin />} />
        <Route path="/Manager/Register" element={<ManagerRegister />} />
        <Route
          path="/Manager/Dashboard"
          element={
            <PrivateRoute role={"manager"}>
              <ManagerDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/Admin/Login" element={<AdminLogin />} />
        <Route
          path="/Admin/Dashboard"
          element={
            <PrivateRoute role={"admin"}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </>
);
