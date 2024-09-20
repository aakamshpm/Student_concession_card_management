import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../pages/authUtils";

const PublicRoute = () => {
  return isAuthenticated() ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
