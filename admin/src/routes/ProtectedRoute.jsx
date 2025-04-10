import { isAuthenticated } from "../authUtils";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const ProtectedRoute = () => {
  return isAuthenticated() ? (
    <div className="flex w-full">
      <Sidebar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
