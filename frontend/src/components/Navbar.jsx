import { useState } from "react";
import { Link } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { CgUser } from "react-icons/cg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex justify-between mt-5 text-lg">
      <div className="navbar-right">
        <ul className="flex gap-6">
          <li className="text-lg cursor-pointer hover:scale-105 transform transition-transform duration-300">
            Home
          </li>
          <li className="text-lg cursor-pointer hover:scale-105 transform transition-transform duration-300">
            Apply
          </li>
          <li className="text-lg cursor-pointer hover:scale-105 transform transition-transform duration-300">
            Renew
          </li>
          <li className="text-lg cursor-pointer hover:scale-105 transform transition-transform duration-300">
            Status
          </li>
        </ul>
      </div>
      <div className="navbar-left relative flex flex-col items-end">
        <div className="flex justify-center items-center gap-1">
          <CgUser size="25" />
          <p className="text-lg text-primary-color">Student Name</p>
          <IoMdArrowDropdown
            size="20"
            className={`cursor-pointer transform transition-transform duration-[350ms] ${
              isOpen ? "rotate-180" : ""
            }`}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        <div
          className={`absolute mt-8 border border-[#F7F8FC] rounded-md shadow-lg bg-[#FA7436] transform transition-all duration-300 ease-out ${
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <ul className="list-none p-2 text-base">
            <li className="text-lg cursor-pointer p-2 text-white rounded hover:text-slate-900 transition-colors duration-200">
              Profile
            </li>
            <li className="text-lg cursor-pointer p-2 text-white rounded hover:text-slate-900 transition-colors duration-200">
              Logout
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;