import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import { useState } from "react";

function ProtectedRoute({ children }) {
  // Check if user is authenticated
  const [isAuthorized] = useState(() => {
    // Retrieve the token from the browser's localStorage
    const token = localStorage.getItem(ACCESS_TOKEN);
    // For debugging purposes
    console.log(
      "ProtectedRoute - Checking token:",
      token ? "Token exists" : "No token",
    );
    return !!token; // Convert to boolean
  });

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
