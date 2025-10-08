"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutVendor } from "../../redux/slices/vendorSlice";
import { logoutIconSvg } from "../../svgs";
import { toast } from "sonner";

const ProfileDropdown = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logo, setLogo] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    router.replace("/business/profile");
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    toast.success("Signed Out Successfully!");
    dispatch(logoutVendor());
    router.push("/");
    localStorage.clear();
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const vendorLogo = localStorage.getItem("logo");
      if (vendorLogo) {
        setLogo(vendorLogo);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative inline-block text-left profile-dropdown">
      <button
        onClick={toggleDropdown}
        className="flex items-center h-9 w-9 sm:h-10 sm:w-10 lg:h-10 lg:w-10 rounded-full focus:outline-none hover:ring-2 hover:ring-white/20 transition-all"
      >
        <img
          alt="User"
          src={logo || "/User.png"}
          className="rounded-[6px] object-cover w-full h-full rounded-full hover:cursor-pointer focus:outline-none"
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          <button
            onClick={handleProfileClick}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200 text-red-500"
          >
            <div className="w-4 h-4 mr-3">
              {logoutIconSvg}
            </div>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
