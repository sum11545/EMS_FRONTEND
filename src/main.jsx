import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage.jsx";

import "./index.css";
import Register from "./components/Register.jsx";
import Userdashboadrd from "./components/Userdashboard.jsx";
import PrivateRoute from "./Privateroute.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/user" element={<Userdashboadrd />} />
      </Routes>
    </BrowserRouter>
  </>
);
