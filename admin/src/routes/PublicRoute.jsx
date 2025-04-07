import { isAuthenticated } from "../authUtils";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  console.log(isAuthenticated());
  return isAuthenticated() ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
