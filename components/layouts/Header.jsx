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
            className="h-10 w-auto mr-16 pr-8"
          />
          <div className="flex lg:hidden">
            <div className="mr-2 pr-0 h-9 w-8 overflow-hidden">
              <img src="/User.png" alt="User" className="rounded-lg" />
            </div>
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
            } absolute top-16 left-0 w-full h-full bg-main font-base shadow-md transition-transform transform ${
              isMenuOpen ? "translate-y-0" : "-translate-y-full"
            } lg:static lg:block lg:bg-transparent lg:shadow-none lg:translate-y-0`}
            style={{ zIndex: 1000 }}
          >
            <div className="flex flex-col lg:flex-row lg:gap-x-14 p-6 lg:p-0">
              <Link
                href="/bussiness"
                className="text-base font-semibold leading-6 text-white lg:text-textLight hover:underline transition-all"
              >
                Dashboard
              </Link>
              <Link
                href="#"
                className="text-base font-semibold leading-6 text-white lg:text-textLight hover:underline transition-all"
              >
                Manage Bags
              </Link>
              <Link
                href="#"
                className="text-base font-semibold leading-6 text-white lg:text-textLight hover:underline transition-all"
              >
                Booking
              </Link>
              <Link
                href="#"
                className="text-base font-semibold leading-6 text-white lg:text-textLight hover:underline transition-all"
              >
                More
              </Link>
              <div className="flex flex-col lg:hidden mt-4 mr-8">
                <LanguageDropdown />
              </div>
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
      <style jsx>{`
        @media (max-width: 1024px) {
          nav a {
            color: white;
          }
          nav {
            height: 100vh;
          }
          nav div {
            height: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
