import React, { useEffect, useState } from "react";
import { appLogoUrl } from "../../lib/constant_data";
import Link from "next/link";
import { menuItemsData } from "../../lib/landing_menu";
import { useSelector } from "react-redux";
import { rightArrowIcon } from "../../svgs";

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const activePage = useSelector((state) => state.header.activePage);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header className="bg-white xl:px-[4%] justify-around">
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
          </div>
          <nav
            className={`${
              isMenuOpen ? "block" : "hidden"
            } absolute top-16 left-0 mt-3 lg:mt-0 w-full h-full bg-main font-base shadow-md transition-transform transform ${
              isMenuOpen ? "translate-y-0" : "-translate-y-full"
            } lg:static lg:block lg:bg-transparent lg:shadow-none lg:translate-y-0 mx-auto`}
            style={{ zIndex: isSmallDevice ? 1000 : 0 }}
          >
            <div className="flex flex-col lg:justify-center items-start lg:flex-row p-6 lg:p-0 ">
              {menuItemsData.map(({ name, href }) => (
                <Link
                  key={name}
                  href={href}
                  className={`lg:text-[12px] xl:text-[20px] font-semibold leading-6 transition-all rounded-md flex items-center justify-start lg:justify-center px-[3%] py-[1%] m-2 lg:m-0 ${
                    isSmallDevice ? "w-[100%]" : ""
                  }  ${
                    activePage === name
                      ? "bg-mainLight text-mainLight"
                      : "text-graySix lg:text-graySix hover:bg-pink hover:text-mainLight"
                  }`}
                  onClick={() => handleLinkClick(name)}
                >
                  {name}
                </Link>
              ))}
              <div className="w-full lg:hidden">
                {/* <LanguageDropdown /> */}
              </div>
            </div>
          </nav>
          <div className="hidden lg:flex items-center gap-5">
            <button className="mr-3 mt-2 lg:m-0 flex items-center min-w-[150px] px-[12px] py-[16px] text-center justify-center bg-pinkBgDark text-white font-semibold rounded-[6px] hover:bg-pinkBgDarkHover2">
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
