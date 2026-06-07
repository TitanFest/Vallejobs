import React from "react";
import { getToken } from "../services/authService";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/Login" />;
  }

  return children;
};

export default ProtectedRoute;
