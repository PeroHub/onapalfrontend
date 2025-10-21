// src/components/PrivateRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext"; // Import useAuth from AuthContext

const PrivateRoute: React.FC<React.PropsWithChildren<object>> = ({
  children,
}) => {
  const auth = useAuth(); // This call should throw if context is null
  const location = useLocation();

  console.log("PrivateRoute: auth object received:", auth); // <-- ADD THIS LINE
  // console.log(auth.token); // <-- This line is causing the error, let's keep it commented for now

  // If auth is null, it means useAuth didn't throw for some reason, or AuthProvider is missing
  if (!auth || !auth.token) {
    console.log("PrivateRoute: Redirecting to login. Auth:", auth);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("PrivateRoute: Token found, rendering children.");
  return children;
};

export default PrivateRoute;
