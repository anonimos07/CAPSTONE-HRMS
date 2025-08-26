import { Outlet, Navigate } from "react-router-dom";
import Unauthorized from "../ErrorPages/Unauthorized";

/**
 * @param {Object} props - Component props
 * @param {string[]} props.allowedRoles - Roles permitted to access this route (e.g., ["ADMIN", "HR", "EMPLOYEE"])
 */
const ProtectedRoute = ({ allowedRoles }) => {
  // Try to get role from both possible storage locations
  const userData = localStorage.getItem("user");
  const userRole = localStorage.getItem("userRole");
  
  let role = null;

  // First try to get role from "user" JSON object
  if (userData) {
    try {
      const user = JSON.parse(userData);
      role = user.role;
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }

  // If not found, try to get role from "userRole" directly
  if (!role && userRole) {
    role = userRole;
  }

  if (!role) {
    return <Navigate to="/unauthorized" replace />;
  }

  const hasAccess = allowedRoles.includes(role);

  return hasAccess ? <Outlet /> : <Unauthorized />;
};

export default ProtectedRoute;