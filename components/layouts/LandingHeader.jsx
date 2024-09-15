"use client";
import React, { useEffect, useState } from "react";
import { appLogoUrl } from "../../lib/constant_data";
import Link from "next/link";
import { menuItemsData } from "../../lib/landing_menu";
import { useDispatch, useSelector } from "react-redux";
import { rightArrowIcon } from "../../svgs";
import { setActivePage } from "../../redux/slices/headerSlice";
import { setOpenDrawer } from "../../redux/slices/contactUserSlice";
import LanguageDropdown from "../dropdowns/LanguageDropdown";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/16/solid";
import { MinusIcon } from "@heroicons/react/20/solid";

const LandingHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

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

  const handleMenuClick = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <header className="bg-white px-[2%] justify-around">
        <div className="mx-auto flex py-3 items-center justify-between">
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
            <div className="flex flex-col lg:justify-center items-start lg:flex-row p-6 lg:p-0 gap-5 lg:gap-0 ">
              {/* {menuItemsData.map(({ name, href }) => (
                <Link
                  key={name}
                  href={href}
                  className={`xl:text-[16px] font-semibold leading-6 transition-all rounded-md flex items-center justify-start lg:justify-center px-[3%] py-[1%]  ${
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
              ))} */}
              <Link
                href="/"
                className={`lg:text-[14px] font-semibold leading-6 transition-all rounded-md flex items-center justify-start lg:justify-center w-full lg:w-auto  lg:px-[2%]  py-[1%]  ${
                  activePage === "Home"
                    ? "text-mainLight"
                    : "text-graySix lg:text-graySix hover:bg-pink hover:text-mainLight"
                }`}
                onClick={() => handleLinkClick("Home")}
              >
                Home
              </Link>
              <div className="relative inline-block group lg:px-[2%]  w-full lg:w-auto py-[1%]">
                <button
                  onClick={handleMenuClick}
                  className="truncate lg:text-[14px] w-full lg:w-fit font-semibold leading-6 transition-all rounded-md flex items-center justify-between lg:justify-center   data-[focus]:outline-1 data-[focus]:outline-white"
                >
                  Business Solutions
                  {isOpen ? (
                    <MinusIcon className="size-6 fill-black lg:hidden block" />
                  ) : (
                    <PlusIcon className="size-6 fill-black lg:hidden block" />
                  )}
                  <ChevronDownIcon className="size-4 fill-black lg:block hidden" />
                </button>

                {/* Mobile Drop Down */}
                {isOpen && (
                  <div className="block lg:hidden w-52 border border-white/5 bg-white p-1 text-sm/6 text-black mt-1 focus:outline-none z-[10000] transition duration-100 ease-out">
                    <div>
                      <Link
                        href="/surprise"
                        className="group flex w-full items-center hover:text-mainLight gap-2 py-1.5 px-3"
                      >
                        Surprise Bags
                      </Link>
                    </div>
                    <div>
                      <Link
                        href="/small_medium_bags"
                        className="group flex w-full items-center hover:text-mainLight gap-2 py-1.5 px-3"
                      >
                        Small & Large Bags
                      </Link>
                    </div>
                  </div>
                )}

                {/* Desktop Drop Down */}
                <div className="hidden absolute top-full left-0 w-52 origin-top-right border drop-shadow-custom border-white/5 bg-white p-1 text-sm/6 text-black z-[10000] focus:outline-none transition duration-100 ease-out lg:group-hover:block">
                  <div>
                    <Link
                      href="/surprise"
                      className="group flex w-full items-center hover:text-mainLight gap-2 py-1.5 px-3"
                    >
                      Surprise Bag
                    </Link>
                  </div>
                  <div>
                    <Link
                      href="/small_medium_bags"
                      className="group flex w-full items-center hover:text-mainLight gap-2 py-1.5 px-3"
                    >
                      Small & Large Bag
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                href="/faqs"
                className={`lg:text-[14px] font-semibold leading-6 transition-all rounded-md flex items-center justify-start lg:justify-center w-full lg:w-auto  lg:px-[2%]   py-[1%]  ${
                  activePage === "FAQs"
                    ? "text-mainLight"
                    : "text-graySix lg:text-graySix hover:bg-pink hover:text-mainLight"
                }`}
                onClick={() => handleLinkClick("FAQs")}
              >
                FAQs
              </Link>

              <Link
                href="/about_us"
                className={`lg:text-[14px] font-semibold leading-6 transition-all rounded-md flex items-center justify-start lg:justify-center w-full lg:w-auto  lg:px-[2%]   py-[1%]  ${
                  activePage === "About Us"
                    ? "text-mainLight"
                    : "text-graySix lg:text-graySix hover:bg-pink hover:text-mainLight"
                }`}
                onClick={() => handleLinkClick("About Us")}
              >
                About Us
              </Link>

              <Link
                href="/contact_us"
                className={`lg:text-[14px] font-semibold leading-6 transition-all rounded-md flex items-center justify-start lg:justify-center w-full lg:w-auto  lg:px-[2%]  py-[1%]  ${
                  activePage === "Contact Us"
                    ? "text-mainLight"
                    : "text-graySix lg:text-graySix hover:bg-pink hover:text-mainLight"
                }`}
                onClick={() => handleLinkClick("Contact Us")}
              >
                Contact Us
              </Link>

              <div className="w-full lg:hidden flex flex-col gap-2">
                <LanguageDropdown
                  background="white"
                  textColor="black"
                  borderColor="grayLight"
                />
                <Link
                  href={"/login"}
                  className="mr-3 mt-2 lg:m-0 flex items-center w-full px-[10px] py-[10px] text-center justify-center bg-pinkBgDark text-white font-semibold rounded-[6px] hover:bg-pinkBgDarkHover2"
                >
                  <span className="mr-3 ml-2 font-semibold">Login</span>
                  <span>{rightArrowIcon}</span>
                </Link>
              </div>
            </div>
          </nav>
          <div className="hidden lg:flex items-center gap-5">
            <LanguageDropdown
              background="white"
              textColor="black"
              borderColor="grayLight"
            />

            <Link
              href={"/login"}
              className="mr-3 mt-2 lg:m-0 flex items-center min-w-[87px] bg-pinkBgDark text-white px-[10px] py-[10px] text-center justify-center font-semibold rounded-[8px]"
            >
              <span className="mr-3 ml-2 font-semibold">Login</span>
              <span>{rightArrowIcon}</span>
            </Link>
            {/* <button
              onClick={handleContactBtnClick}
              className="mr-3 mt-2 lg:m-0 flex items-center min-w-[150px] px-[12px] py-[16px] text-center justify-center bg-pinkBgDark text-white font-semibold rounded-[6px] hover:bg-pinkBgDarkHover2"
            >
              <span className="mr-3 ml-2 font-semibold">Contact us</span>
              <span>{rightArrowIcon}</span>
            </button> */}
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
