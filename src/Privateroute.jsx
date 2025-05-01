import React from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to login page if no token (user not logged in)
    return <Navigate to="/" replace />;
  }

  // Render the requested route if logged in
  return <Route {...rest} element={element} />;
};

export default PrivateRoute;
