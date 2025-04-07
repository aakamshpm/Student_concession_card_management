import { Link, useLocation } from "react-router-dom";

const NavLink = ({ to, children }) => {
  const location = useLocation();

  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative px-2 py-1 text-gray-600 hover:text-primary-color transition-colors font-medium
          ${
            isActive
              ? "text-primary-color after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary-color after:rounded-full"
              : ""
          }
          hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:h-[2px] hover:after:w-full hover:after:bg-primary-color hover:after:rounded-full hover:after:transition-all hover:after:duration-300`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
