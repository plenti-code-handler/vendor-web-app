"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  dashboardIconSvgWhite,
  dashboardIconSvgActive,
  logoutIconSvg,
  usersIconSvgActive,
  usersIconSvgWhite,
  approvalSvgActive,
  approvalSvgWhite,
  transactionSvgActive,
  transactionSvgWhite,
  categoriesSvgActive,
  categoriesSvgWhite,
  logoutIconAdminSvg,
} from "../../svgs";
import Link from "next/link";
import AdminProfileDropdown from "../dropdowns/AdminProfileDropdown";
import { setActivePage } from "../../redux/slices/headerSlice";

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const activePage = useSelector((state) => state.header.activePage);
  const dispatch = useDispatch();

  const menuItemsData = [
    {
      name: "Dashboard",
      href: "/admin",
      activeSvg: dashboardIconSvgActive,
      inactiveSvg: dashboardIconSvgWhite,
    },
    {
      name: "Users",
      href: "/admin/users",
      activeSvg: usersIconSvgActive,
      inactiveSvg: usersIconSvgWhite,
    },
    {
      name: "Approvals",
      href: "/admin/approvals",
      activeSvg: approvalSvgActive,
      inactiveSvg: approvalSvgWhite,
    },
    {
      name: "Transactions",
      href: "/admin/transactions",
      activeSvg: transactionSvgActive,
      inactiveSvg: transactionSvgWhite,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      activeSvg: categoriesSvgActive,
      inactiveSvg: categoriesSvgWhite,
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = (page) => {
    dispatch(setActivePage(page));
  };

  return (
    <>
      <header className="bg-white border-b-2 lg:pl-[8%] lg:pr-[2%] justify-around">
        <div className="mx-auto flex max-w-8xl items-center justify-between p-2">
          <img
            alt="Foodie Finder Logo"
            src="https://firebasestorage.googleapis.com/v0/b/foodie-finder-ee1d8.appspot.com/o/app_logo.png?alt=media&token=8e779e74-bdc7-4dc6-8634-55a30110bc98"
            className="h-10 w-auto"
          />
          <div className="flex lg:hidden items-center">
            <AdminProfileDropdown />
            <button
              onClick={toggleMenu}
              className="text-gray-900 hover:text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? closeSvg : hamburgerIcon}
            </button>
          </div>
          {/* Menu Items Section */}
          <nav
            className={`${
              isMenuOpen ? "block" : "hidden"
            } absolute top-16 left-0 w-full h-full bg-white font-base shadow-md transition-transform transform${
              isMenuOpen ? "translate-y-0" : "-translate-y-full"
            } lg:static lg:block lg:bg-transparent lg:shadow-none lg:translate-y-0 lg:ml-20`}
            style={{ zIndex: 1000 }}
          >
            <div className="flex flex-col lg:flex-row lg:gap-x-8 p-6 lg:p-0">
              {menuItemsData.map(({ name, href, activeSvg, inactiveSvg }) => (
                <Link
                  key={name}
                  href={href}
                  className={`lg:text-[15px] font-semibold leading-6 transition-all rounded-md pt-3 pb-3 pl-4 pr-4 lg:w-[14%] lg:h-[15%] ${
                    activePage === name
                      ? "bg-secondary text-white"
                      : "text-menuItem lg:text-menuItem hover:underline decoration-mainLight underline-offset-8"
                  }`}
                  onClick={() => handleLinkClick(name)}
                >
                  <span className="flex lg:flex-col items-center gap-3 lg:gap-1">
                    {activePage === name ? inactiveSvg : activeSvg}
                    {name}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
          {/* User Profile Section */}
          <div className="hidden lg:flex border-2 border-dashed	rounded-xl p-2 justify-between w-[30%] mr-20">
            <div className="flex gap-2">
              <img
                alt="User"
                src="/User.png"
                className="lg:h-11 lg:w-11 rounded-md hover:cursor-pointer focus:outline-none"
              />
              <div className="flex flex-col">
                <p className="text-[14px] font-semibold text-black">
                  Jacob Jones
                </p>
                <p className="text-[12px] font-semibold text-gray-400">Admin</p>
              </div>
            </div>
            <button
              className="p-2 transition-colors duration-200 ease-in-out hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded-lg"
              title="Logout"
            >
              {logoutIconAdminSvg}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;

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
