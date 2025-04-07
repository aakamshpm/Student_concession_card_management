import { useState } from "react";
import { Link } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { CgUser } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/studentsApiSlice";
import { clearCredentials } from "../slices/authSlice";
import { FiLogOut, FiUser, FiX, FiCheck } from "react-icons/fi";
import NavLink from "./NavLink";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [logout] = useLogoutMutation();
  const { studentInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navItems = [
    {
      path: "/",
      label: "Home",
    },
    {
      path: "/verify",
      label: "Verify",
    },
    {
      path: "/apply",
      label: "Apply",
    },
    {
      path: "/status",
      label: "Status",
    },
    {
      path: "/guidelines",
      label: "Guidelines",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      navigate("/login");
    } catch (error) {
      console.error(error?.data?.message || error?.message);
    } finally {
      setShowLogoutConfirmation(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
              >
                <FiX className="mr-2" />
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="flex justify-between items-center py-4 px-6 bg-white shadow-sm">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <NavLink to={item.path} key={item.path}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-primary-color/10 flex items-center justify-center">
              <CgUser className="text-primary-color" />
            </div>
            <span className="font-medium text-primary-color">
              {studentInfo.firstName}
            </span>
            <IoMdArrowDropdown
              className={`text-gray-500 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-40 border border-gray-100">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FiUser className="mr-3" />
                Profile
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowLogoutConfirmation(true);
                }}
                className="w-full text-left flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FiLogOut className="mr-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
