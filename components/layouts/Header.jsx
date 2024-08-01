"use client";
import React, { useState } from "react";
import { hamburgerIcon, logoutIconSvg, closeSvg } from "../../svgs";
import Link from "next/link";
import LanguageDropdown from "../dropdowns/LanguageDropdown";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="bg-main">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-5 lg:px-7">
          <img
            alt="Foodie Finder Logo"
            src="https://firebasestorage.googleapis.com/v0/b/foodie-finder-ee1d8.appspot.com/o/app_logo.png?alt=media&token=8e779e74-bdc7-4dc6-8634-55a30110bc98"
            className="h-10 w-auto mr-16 pr-16"
          />
          <div className="flex lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-900 hover:text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? closeSvg : hamburgerIcon}
            </button>
          </div>
          <nav
            className={`${
              isMenuOpen ? "block" : "hidden"
            } absolute top-16 left-0 w-full bg-main font-base shadow-md lg:static lg:block lg:bg-transparent lg:shadow-none`}
          >
            <div className="flex flex-col lg:flex-row lg:gap-x-14 p-6 lg:p-0">
              <Link
                href="/bussiness"
                className="text-base font-semibold leading-6 text-black lg:text-textLight hover:underline transition-all"
              >
                Dashboard
              </Link>
              <Link
                href="#"
                className="text-base font-semibold leading-6 text-black lg:text-textLight hover:underline transition-all"
              >
                Manage Bags
              </Link>
              <Link
                href="#"
                className="text-base font-semibold leading-6 text-black lg:text-textLight hover:underline transition-all"
              >
                Booking
              </Link>
              <Link
                href="#"
                className="text-base font-semibold leading-6 text-black lg:text-textLight hover:underline transition-all"
              >
                More
              </Link>
            </div>
          </nav>
          <div className="hidden lg:flex items-center gap-x-4">
            <LanguageDropdown />
            <div className="h-9 w-8 rounded-sm overflow-hidden">
              <img src="/User.png" alt="User" className="rounded-lg" />
            </div>
            <button className="text-sm font-semibold leading-6 text-gray-900">
              {logoutIconSvg}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
