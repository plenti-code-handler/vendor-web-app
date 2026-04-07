// vendor-web-app/components/navigation/BussinessHeader.jsx
"use client";
import axiosClient from "../../AxiosClient";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutIconSvg } from "../../svgs";
import Link from "next/link";
import LanguageDropdown from "../dropdowns/LanguageDropdown";
import ProfileDropdown from "../dropdowns/ProfileDropdown";
import { setActivePage } from "../../redux/slices/headerSlice";
import { appLogoUrl } from "../../lib/constant_data";
import { menuItemsData } from "../../lib/business_menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";

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
            console.log(
              "Vendor account is not active, redirecting to processing page"
            );
            router.push("/onboard");
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
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-5 h-5 text-white" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-white" />
              )}
            </button>
          </div>

          {/* Mobile: slide-from-right drawer (Dialog) */}
          {isSmallDevice && (
            <Dialog
              open={isMenuOpen}
              onClose={setIsMenuOpen}
              className="relative z-[1000]"
            >
              <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/30 transition-opacity duration-300 ease-out data-[closed]:opacity-0"
              />
              <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-4">
                    <DialogPanel
                      transition
                      className="pointer-events-auto w-[300px] h-full transform bg-white shadow-xl transition duration-300 ease-out data-[closed]:translate-x-full"
                    >
                      <div className="flex h-full flex-col py-6 pl-2 pr-4">
                        <div className="flex items-center justify-between px-4 mb-4">
                          <span className="text-sm font-semibold text-gray-500">
                            Menu
                          </span>
                          <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
                            aria-label="Close menu"
                          >
                            <XMarkIcon className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>
                        <nav className="flex flex-col gap-1">
                          {menuItemsData.map(({ name, href }) => (
                            <Link
                              key={name}
                              href={href}
                              className={`rounded-xl px-4 py-3 text-[15px] font-medium transition-colors ${
                                activePage === name
                                  ? "bg-[#5f22d9] text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                              onClick={() => {
                                handleLinkClick(name);
                                setIsMenuOpen(false);
                              }}
                            >
                              {name}
                            </Link>
                          ))}
                        </nav>
                      </div>
                    </DialogPanel>
                  </div>
                </div>
              </div>
            </Dialog>
          )}

          {/* Desktop: horizontal nav */}
          <nav className="hidden lg:flex flex-col justify-center items-start lg:flex-row gap-4">
            {menuItemsData.map(({ name, href }) => (
              <Link
                key={name}
                href={href}
                className={`text-base leading-6 rounded-xl flex items-center justify-start lg:justify-center px-4 py-2 m-2 ${
                  activePage === name
                    ? "bg-[#7a48e3] font-semibold text-white animate-fade-in"
                    : "text-white lg:text-textLight hover:bg-[#7a48e3] hover:opacity-100"
                }`}
                onClick={() => handleLinkClick(name)}
              >
                {name}
              </Link>
            ))}
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

