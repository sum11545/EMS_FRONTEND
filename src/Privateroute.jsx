import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const PrivateRoute = ({ children, role }) => {
  let token = null;

  if (role === "user") token = localStorage.getItem("token");
  if (role === "manager") token = localStorage.getItem("managerToken");
  if (role === "admin") token = localStorage.getItem("adminToken");

  if (!token) {
    if (role === "user") {
      toast.warning("Please login first!");
      return <Navigate to="/" />;
    }
    if (role === "manager") {
      toast.warning("Please login first!");
      return <Navigate to="/Manager/Login" />;
    }
    if (role === "admin") {
      toast.warning("Please login first!");
      return <Navigate to="/Admin/Login" />;
    }
  }

  return children;
};

export default PrivateRoute;
