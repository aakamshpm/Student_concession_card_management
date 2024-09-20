import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

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
