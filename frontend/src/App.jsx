import Navbar from "./components/Navbar";
import { Outlet, useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();
  return (
    <div className="app">
      {location.pathname !== "/login" && <Navbar />}
      <Outlet />
    </div>
  );
};

export default App;
