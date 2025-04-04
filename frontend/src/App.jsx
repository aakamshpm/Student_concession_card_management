import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { clearExpiredCredentials } from "./slices/authSlice";
import { useLogoutMutation } from "./slices/studentsApiSlice";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const result = dispatch(clearExpiredCredentials());
    if (result.payload) {
      navigate("/login");
      logout();
    }
  }, [dispatch]);

  return (
    <div className="app">
      <Outlet />
    </div>
  );
};

export default App;
