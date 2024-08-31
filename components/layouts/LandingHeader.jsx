"use client";
import React, { useEffect, useState } from "react";
import { appLogoUrl } from "../../lib/constant_data";
import Link from "next/link";
import { menuItemsData } from "../../lib/landing_menu";
import { useDispatch, useSelector } from "react-redux";
import { rightArrowIcon } from "../../svgs";
import { setActivePage } from "../../redux/slices/headerSlice";
import { setOpenDrawer } from "../../redux/slices/contactUserSlice";

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const activePage = useSelector((state) => state.header.activePage);

  const dispatch = useDispatch();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = (page) => {
    dispatch(setActivePage(page));
  };

  const handleContactBtnClick = () => {
    dispatch(setOpenDrawer(true));
  };

  // useEffect(() => {
  //   dispatch(setActivePage("Home"));
  // }, [dispatch]);

  return (
    <>
      <header className="bg-white xl:px-[4%] justify-around">
        <div className="mx-auto flex p-2 items-center justify-between py-5">
          <img alt="Foodie Finder Logo" src={appLogoUrl} />
          <div className="flex lg:hidden gap-3 items-center">
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
            } absolute top-16 left-0 w-full h-full bg-white font-base shadow-md transition-transform transform${
              isMenuOpen ? "translate-y-0" : "-translate-y-full"
            } lg:static lg:block lg:bg-transparent lg:shadow-none lg:translate-y-0`}
            style={{ zIndex: 1000 }}
          >
            <div className="flex flex-col lg:justify-center items-start lg:flex-row p-6 lg:p-0 ">
              {menuItemsData.map(({ name, href }) => (
                <Link
                  key={name}
                  href={href}
                  className={`xl:text-[20px] font-semibold leading-6 transition-all rounded-md flex items-center justify-start lg:justify-center px-[3%] py-[1%] m-2 lg:m-0 ${
                    isSmallDevice ? "w-[100%]" : ""
                  }  ${
                    activePage === name
                      ? "text-mainLight"
                      : "text-graySix lg:text-graySix hover:bg-pink hover:text-mainLight"
                  }`}
                  onClick={() => handleLinkClick(name)}
                >
                  {name}
                </Link>
              ))}
              <div className="w-full lg:hidden">
                {/* <LanguageDropdown /> */}
                <button
                  onClick={handleContactBtnClick}
                  className="mr-3 mt-2 lg:m-0 flex items-center w-full px-[12px] py-[16px] text-center justify-center bg-pinkBgDark text-white font-semibold rounded-[6px] hover:bg-pinkBgDarkHover2"
                >
                  <span className="mr-3 ml-2 font-semibold">Contact us</span>
                  <span>{rightArrowIcon}</span>
                </button>
              </div>
            </div>
          </nav>
          <div className="hidden lg:flex items-center gap-5">
            <Link
              href={"/login"}
              className="mr-3 mt-2 lg:m-0 flex items-center min-w-[150px] px-[12px] bg-pinkBgDark hover:border-2 text-white border-pinkBgDark border-2 py-[16px] text-center justify-center hover:border-pinkBgDark font-semibold rounded-[6px] hover:text-pinkBgDark hover:bg-white"
            >
              <span className="mr-3 ml-2 font-semibold">Login</span>
            </Link>
            <button
              onClick={handleContactBtnClick}
              className="mr-3 mt-2 lg:m-0 flex items-center min-w-[150px] px-[12px] py-[16px] text-center justify-center bg-pinkBgDark text-white font-semibold rounded-[6px] hover:bg-pinkBgDarkHover2"
            >
              <span className="mr-3 ml-2 font-semibold">Contact us</span>
              <span>{rightArrowIcon}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default LandingHeader;

const closeSvg = (
  <svg
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-menuItem"
  >
    <path
      d="M14.2547 12.9612C14.6451 13.3533 14.6451 13.9416 14.2547 14.3337C14.0594 14.5298 13.8642 14.6278 13.5713 14.6278C13.2785 14.6278 13.0832 14.5298 12.888 14.3337L7.71419 9.13764L2.54038 14.3337C2.34515 14.5298 2.14991 14.6278 1.85705 14.6278C1.56419 14.6278 1.36895 14.5298 1.17372 14.3337C0.78324 13.9416 0.78324 13.3533 1.17372 12.9612L6.34753 7.76509L1.17372 2.56901C0.78324 2.17685 0.78324 1.58862 1.17372 1.19646C1.56419 0.804305 2.14991 0.804305 2.54038 1.19646L7.71419 6.39254L12.888 1.19646C13.2785 0.804305 13.8642 0.804305 14.2547 1.19646C14.6451 1.58862 14.6451 2.17685 14.2547 2.56901L9.08086 7.76509L14.2547 12.9612Z"
      fill="#5E6278"
    />
  </svg>
);

const hamburgerIcon = (
  <svg
    className="w-6 h-6 text-menuItem"
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
