"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutIconSvg } from "../../svgs";
import Link from "next/link";
import LanguageDropdown from "../dropdowns/LanguageDropdown";
import ProfileDropdown from "../dropdowns/ProfileDropdown";
import { setActivePage } from "../../redux/slices/headerSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const activePage = useSelector((state) => state.header.activePage);
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = (page) => {
    dispatch(setActivePage(page));
  };

  return (
    <>
      <header className="bg-main lg:pl-10 lg:justify-center z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-5 lg:px-7">
          <img
            alt="Foodie Finder Logo"
            src="https://firebasestorage.googleapis.com/v0/b/foodie-finder-ee1d8.appspot.com/o/app_logo.png?alt=media&token=8e779e74-bdc7-4dc6-8634-55a30110bc98"
            className="h-10 w-auto mr-16 pr-8"
          />
          <div className="flex lg:hidden items-center">
            <ProfileDropdown />
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
              {[
                { name: "Dashboard", href: "/business" },
                { name: "Manage Bags", href: "/business/manage-bags" },
                { name: "Bookings", href: "/business/bookings" },
                { name: "More", href: "/business/more" },
              ].map(({ name, href }) => (
                <Link
                  key={name}
                  href={href}
                  className={`text-base font-semibold leading-6 transition-all rounded-md ${
                    activePage === name
                      ? "bg-mainLight pr-6 pl-6 pt-3 pb-3 text-white"
                      : "text-white lg:text-textLight hover:underline pt-3"
                  }`}
                  onClick={() => handleLinkClick(name)}
                >
                  {name}
                </Link>
              ))}
              <div className="flex flex-col lg:hidden mt-4 mr-8">
                <LanguageDropdown />
              </div>
            </div>
          </nav>
          <div className="hidden lg:flex items-center gap-x-4">
            <LanguageDropdown />
            <ProfileDropdown />
            <button className="text-sm font-semibold leading-6 text-gray-900">
              {logoutIconSvg}
            </button>
          </div>
        </div>
      </header>
      <style jsx>{`
        @media (max-width: 1024px) {
          nav a {
            color: red;
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

const closeSvg = (
  <svg
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-white"
  >
    <path
      d="M14.2547 12.9612C14.6451 13.3533 14.6451 13.9416 14.2547 14.3337C14.0594 14.5298 13.8642 14.6278 13.5713 14.6278C13.2785 14.6278 13.0832 14.5298 12.888 14.3337L7.71419 9.13764L2.54038 14.3337C2.34515 14.5298 2.14991 14.6278 1.85705 14.6278C1.56419 14.6278 1.36895 14.5298 1.17372 14.3337C0.78324 13.9416 0.78324 13.3533 1.17372 12.9612L6.34753 7.76509L1.17372 2.56901C0.78324 2.17685 0.78324 1.58862 1.17372 1.19646C1.56419 0.804305 2.14991 0.804305 2.54038 1.19646L7.71419 6.39254L12.888 1.19646C13.2785 0.804305 13.8642 0.804305 14.2547 1.19646C14.6451 1.58862 14.6451 2.17685 14.2547 2.56901L9.08086 7.76509L14.2547 12.9612Z"
      fill="white"
    />
  </svg>
);

const hamburgerIcon = (
  <svg
    className="w-6 h-6 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16m-7 6h7"
    />
  </svg>
);
