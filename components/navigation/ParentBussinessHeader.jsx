"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import ParentProfileDropdown from "./ParentProfileDropdown";
import { parentMenuItemsData } from "../../lib/parent_business_menu";

const ParentBussinessHeader = () => {
  const [logoFallbackError, setLogoFallbackError] = useState(false);
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoSrc = useMemo(() => {
    return logoFallbackError ? "/logo-without-text.png" : "/logo-admin.png";
  }, [logoFallbackError]);

  const isActive = (href) => pathname === href;

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
    <header className="bg-white w-full">
      <div className="mx-auto flex items-center justify-between px-[7%] py-4 gap-3">
        <Link
          href="/parent/dashboard"
          className="flex items-center cursor-pointer flex-shrink-0"
        >
          <img
            alt="Parent Admin Logo"
            src={logoSrc}
            onError={() => setLogoFallbackError(true)}
            className="h-8 sm:h-9 md:h-10 w-auto object-contain"
          />
        </Link>

        <div className="flex lg:hidden gap-2 items-center flex-shrink-0">
          <ParentProfileDropdown />
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-lg text-gray-900 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
            aria-label="Open menu"
            type="button"
          >
            <Bars3Icon className="w-6 h-6 text-[#5F22D9]" />
          </button>
        </div>

        {/* Mobile: slide-from-right drawer (Dialog) */}
        {/**
         * Keep this lightweight: just show the 2 menu items.
         */}
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
                      {parentMenuItemsData.map(({ name, href }) => (
                        <Link
                          key={name}
                          href={href}
                          className={`rounded-xl px-4 py-3 text-[15px] font-medium transition-colors ${
                            isActive(href)
                              ? "bg-[#5F22D9] text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
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

        {/* Desktop: horizontal nav */}
        <nav className="hidden md:flex items-center gap-3 flex-1 justify-center min-w-0">
          {parentMenuItemsData.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive(href)
                  ? "bg-[#5F22D9] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {name}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <ParentProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default ParentBussinessHeader;

