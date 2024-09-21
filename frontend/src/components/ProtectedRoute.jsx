import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../authUtils";
import Navbar from "./Navbar";

const ProtectedRoute = () => {
  return isAuthenticated() ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
