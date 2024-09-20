import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../authUtils";

const PublicRoute = () => {
  return isAuthenticated() ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
