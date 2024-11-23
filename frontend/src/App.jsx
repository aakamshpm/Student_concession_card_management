import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { clearExpiredCredentials } from "./slices/authSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearExpiredCredentials());
  }, [dispatch]);

  return (
    <div className="app">
      <Outlet />
    </div>
  );
};

export default App;
