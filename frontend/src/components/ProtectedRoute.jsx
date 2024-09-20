import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../authUtils";

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
