"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutIconSvg } from "../../svgs";
import Link from "next/link";
import LanguageDropdown from "../dropdowns/LanguageDropdown";
import ProfileDropdown from "../dropdowns/ProfileDropdown";
import { setActivePage } from "../../redux/slices/headerSlice";
import { appLogoUrl } from "../../lib/constant_data";
import { menuItemsData } from "../../lib/business_menu";
import { logoutUser } from "../../redux/slices/loggedInUserSlice";
import { useRouter } from "next/navigation";
import { auth } from "../../app/firebase/config";

const BussinessHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activePage = useSelector((state) => state.header.activePage);
  const dispatch = useDispatch();
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = (page) => {
    dispatch(setActivePage(page));
  };

  const handleLogout = async () => {
    await auth.signOut();
    dispatch(logoutUser());
    router.push("/");
  };

  return (
    <>
      <header className="bg-main xl:px-[6%] justify-around">
        <div className="mx-auto flex p-2 items-center justify-between py-5">
          <img alt="Foodie Finder Logo" src={appLogoUrl} />
          <div className="flex lg:hidden gap-3 items-center">
            {/* <ProfileDropdown /> */}
            <button
              onClick={toggleMenu}
              className="text-gray-900 hover:text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? closeSvg : hamburgerIcon}
            </button>
            <button
              className="text-sm font-semibold leading-6 text-gray-900 p-3 transition-colors duration-200 ease-in-out hover:bg-mainLight hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-mainLight focus:ring-offset-2 rounded-lg"
              title="Logout"
              onClick={handleLogout}
            >
              {logoutIconSvg}
            </button>
          </div>
          <nav
            className={`${
              isMenuOpen ? "block" : "hidden"
            } absolute top-16 left-0 mt-3 lg:mt-0 w-full h-full bg-main font-base shadow-md transition-transform transform ${
              isMenuOpen ? "translate-y-0" : "-translate-y-full"
            } lg:static lg:block lg:bg-transparent lg:shadow-none lg:translate-y-0 xl:ml-[6%] lg:ml-[3%]`}
            style={{ zIndex: isSmallDevice ? 1000 : 0 }}
          >
            <div className="flex flex-col items-start lg:flex-row p-6 lg:p-0 gap-[2.2%]">
              {menuItemsData.map(({ name, href }) => (
                <Link
                  key={name}
                  href={href}
                  className={`lg:text-[12px] xl:text-[16px] font-semibold leading-6 transition-all rounded-md flex items-center justify-start lg:justify-center px-[3%] py-[1%] m-2 lg:m-0 ${
                    isSmallDevice ? "w-[100%]" : ""
                  }  ${
                    activePage === name
                      ? "bg-mainLight text-white"
                      : "text-white lg:text-textLight hover:bg-mainLight "
                  }`}
                  onClick={() => handleLinkClick(name)}
                >
                  {name}
                </Link>
              ))}
              <div className="w-full lg:hidden">
                <LanguageDropdown />
              </div>
            </div>
          </nav>
          <div className="hidden lg:flex items-center gap-5">
            <LanguageDropdown />
            <ProfileDropdown />
            <button
              className="text-sm font-semibold leading-6 text-gray-900 p-3 transition-colors duration-200 ease-in-out hover:bg-mainLight hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-mainLight focus:ring-offset-2 rounded-lg"
              title="Logout"
              onClick={handleLogout}
            >
              {logoutIconSvg}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default BussinessHeader;

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
