// vendor-web-app/components/navigation/BussinessHeader.jsx
"use client";
import axiosClient from "../../AxiosClient";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import ProfileDropdown from "../dropdowns/ProfileDropdown";
import { setActivePage } from "../../redux/slices/headerSlice";
import { menuItemsData } from "../../lib/business_menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { XMarkIcon, Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/outline";
import BetaBadge from "../common/BetaBadge";

/** Large screens: first N items in the bar; rest behind “More”. */
const DESKTOP_PRIMARY_NAV_COUNT = 4;

const BussinessHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activePage = useSelector((state) => state.header.activePage);
  const dispatch = useDispatch();
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const primaryNavItems = useMemo(
    () => menuItemsData.slice(0, DESKTOP_PRIMARY_NAV_COUNT),
    []
  );
  const overflowNavItems = useMemo(
    () => menuItemsData.slice(DESKTOP_PRIMARY_NAV_COUNT),
    []
  );
  const isOverflowNavActive = overflowNavItems.some(
    (item) => item.name === activePage
  );

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
      <header className="xl:px-[6%] py-2 justify-around bg-[#5f22d9] ">
        <div className="mx-auto flex items-center justify-between px-2">
          <div
            onClick={() => router.push("/business")}
            className="flex items-center cursor-pointer"
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
          <div className="flex lg:hidden gap-3 items-center">
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
                              className={`flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors ${
                                activePage === name
                                  ? "bg-[#5f22d9] text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                              onClick={() => {
                                handleLinkClick(name);
                                setIsMenuOpen(false);
                              }}
                            >
                              <span>{name}</span>
                              {name === "Reports" && <BetaBadge />}
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

          {/* Desktop: first 4 links + More dropdown */}
          <nav className="hidden lg:flex flex-row flex-wrap items-center gap-1">
            {primaryNavItems.map(({ name, href }) => {
              const isActive = activePage === name;
              const linkClass = `text-[14px] leading-6 rounded-xl flex items-center justify-center gap-1.5 px-3 py-2 m-2 ${
                isActive
                  ? "bg-[#7a48e3] font-semibold text-white"
                  : "text-white lg:text-textLight hover:bg-[#7a48e3] hover:opacity-100"
              }`;
              return (
                <Link
                  key={name}
                  href={href}
                  className={linkClass}
                  onClick={() => handleLinkClick(name)}
                >
                  <span>{name}</span>
                  {name === "Reports" && <BetaBadge className="px-2" />}
                </Link>
              );
            })}

            {overflowNavItems.length > 0 && (
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton
                    className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 m-2 text-[14px] leading-6 text-white lg:text-textLight transition-colors hover:bg-[#7a48e3] hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                      isOverflowNavActive
                        ? "bg-[#7a48e3] font-semibold text-white"
                        : ""
                    }`}
                    aria-label="More navigation"
                  >
                    More
                    <ChevronDownIcon className="h-4 w-4" aria-hidden />
                  </MenuButton>
                </div>
                  <MenuItems className="absolute left-0 p-2 z-[1001] mt-1 min-w-[200px] origin-top-left rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none animate-fade-down">
                    {overflowNavItems.map(({ name, href }) => (
                      <MenuItem key={name}>
                        {({ focus }) => (
                          <Link
                            href={href}
                            className={`block px-4 py-2.5 text-[14px]  ${
                              focus ? "bg-gray-100 rounded-xl" : ""
                            } ${
                              activePage === name
                                ? "font-semibold text-[#5f22d9]"
                                : "text-gray-800"
                            }`}
                            onClick={() => handleLinkClick(name)}
                          >
                            {name}
                          </Link>
                        )}
                      </MenuItem>
                    ))}
                  </MenuItems>
              </Menu>
            )}
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

