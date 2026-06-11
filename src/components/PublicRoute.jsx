import React from "react";
import { getToken } from "../services/authService";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = getToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
