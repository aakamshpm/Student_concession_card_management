import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiBarChart2,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
// import { useLogoutMutation } from "../slices/adminApiSlice";
// import { clearCredentials } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    // try {
    //   await logout().unwrap();
    //   dispatch(clearCredentials());
    //   navigate('/login');
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const navItems = [
    {
      path: "/",
      icon: <FiHome size={20} />,
      label: "Dashboard",
    },
    { path: "/students", icon: <FiUsers size={20} />, label: "Students" },
    {
      path: "/verifications",
      icon: <FiCheckCircle size={20} />,
      label: "Verifications",
    },
    {
      path: "/applications",
      icon: <FiFileText size={20} />,
      label: "Applications",
    },

    {
      path: "/reports",
      icon: <FiBarChart2 size={20} />,
      label: "Reports",
    },
    { path: "/profile", icon: <FiUser size={20} />, label: "Profile" },
    {
      path: "/settings",
      icon: <FiSettings size={20} />,
      label: "Settings",
    },
  ];

  return (
    <div className="h-screen w-64 bg-white shadow-lg flex flex-col">
      {/* Logo/School Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl text-center font-semibold text-primary-color font-['Volkhov']">
          Student Concession <span className="font-bold">Admin</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                location.pathname === item.path
                  ? "bg-primary-color/10 text-primary-color"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <FiLogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
