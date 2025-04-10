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
import { clearCredentials } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useLogoutAdminMutation } from "../slices/adminApiSlice";
import { useState } from "react";

const Sidebar = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutAdminMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
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
      path: "/approved-applications",
      icon: <FiBarChart2 size={20} />,
      label: "Approved Cards",
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
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <FiLogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              {/* Warning Icon */}
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Confirmation Message */}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to log out of your admin account?
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
