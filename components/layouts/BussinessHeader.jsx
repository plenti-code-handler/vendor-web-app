// vendor-web-app/components/layouts/BussinessHeader.jsx
"use client";
import axiosClient from "../../AxiosClient";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutIconSvg } from "../../svgs";
import Link from "next/link";
import LanguageDropdown from "../dropdowns/LanguageDropdown";
import ProfileDropdown from "../dropdowns/ProfileDropdown";
// ✅ Remove the import - no longer needed
import { setActivePage } from "../../redux/slices/headerSlice";
import { appLogoUrl } from "../../lib/constant_data";
import { menuItemsData } from "../../lib/business_menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const BussinessHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activePage = useSelector((state) => state.header.activePage);
  const dispatch = useDispatch();
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Fixed - Load user info with proper redirect logic
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.log("No token found");
          router.push("/");
          return;
        }

        const response = await axiosClient.get("/v1/vendor/me/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        
        if (response.status === 200) {
          console.log(response.data.is_active, "is_active");
          
          // ✅ Correct - Check if vendor is inactive and redirect
          if (!response.data.is_active) {
            console.log("Vendor account is not active, redirecting to processing page");
            router.push("/accountProcessing");
            return;
          }
          
          localStorage.setItem("user", JSON.stringify(response.data));
          localStorage.setItem("logo", response.data.logo_url);
          console.log("User info loaded successfully");
        }
      } catch (error) {
        console.error("Error loading user info:", error);
        if (error.response?.status === 401) {
          localStorage.clear();
          router.push("/");
        }
        toast.error("Failed to load user information");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, [router]);

  useEffect(() => {
    const checkIsMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 1024);
      }
    };

    checkIsMobile();

    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

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


  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className=" xl:px-[6%] py-2 py-4 justify-around bg-[#5f22d9] ">
        <div className="mx-auto flex items-center justify-between ">
          <div
            onClick={() => router.push("/business")}
            className="flex items-center cursor-pointer ml-5"
          >
            <img
              alt="Vendor App Icon"
              src="/icons/icon-150.png"
              className="w-10 h-10 rounded-xl border border-white/40 shadow-sm"
            />
            <img
              alt="Plenti Logo"
              src="/splash-logo.png"
              className="w-20 h-auto"
            />
          </div>
          <div className="flex lg:hidden gap-3 items-center mr-3">
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
            } absolute top-16 left-0 mt-14 lg:mt-0 w-full h-full bg-primary  font-base shadow-md transition-transform transform ${
              isMenuOpen ? "translate-y-0" : "-translate-y-full"
            } lg:static lg:block lg:bg-transparent lg:shadow-none lg:translate-y-0 xl:ml-[6%] lg:ml-[3%]`}
            style={{
              zIndex: isSmallDevice ? 1000 : 0,
            }}
          >
            <div className="flex flex-col  justify-center items-start lg:flex-row lg:p-0 gap-2">
              {menuItemsData.map(({ name, href }) => (
                <Link
                  key={name}
                  href={href}
                  className={`lg:text-[12px] xl:text-base font-semibold leading-6 transition-all rounded-md flex items-center justify-start lg:justify-center px-[2%] py-2 m-2 lg:m-0 ${
                    isSmallDevice ? "w-[100%]" : ""
                  }  ${
                    activePage === name
                      ? "bg-[#7a48e3]  text-white"
                      : "text-white lg:text-textLight  hover:bg-[#7a48e3] "
                  }`}
                  onClick={() => {
                    handleLinkClick(name);
                    if (isMobile) {
                      toggleMenu();
                    }
                  }}
                >
                  {name}
                </Link>
              ))}
              <div className="w-full lg:hidden"></div>
            </div>
          </nav>
          <div className="hidden lg:flex items-center gap-5">
            <ProfileDropdown />
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
