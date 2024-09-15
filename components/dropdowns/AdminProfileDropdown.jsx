"use client";

import React, { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/20/solid";

const AdminProfileDropdown = ({ imageUrl }) => {
  return (
    <Menu as="div" className="relative" title="Your Profile">
      <div>
        <MenuButton className="flex items-center rounded-md text-sm focus:outline-none mr-2 focus:ring-2 focus:ring-secondary hover:ring-2 hover:ring-secondary">
          <img
            alt="User"
            src={imageUrl || "/User.png"}
            className="h-8 w-8 lg:h-9 lg:w-12 rounded-md hover:cursor-pointer focus:outline-none"
          />
        </MenuButton>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 mt-2 w-40 sm:w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
          <div className="px-1 py-1 block">
            {/* This div is for small devices */}
            <MenuItem>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-main text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-xs sm:text-sm`}
                >
                  <ArrowRightStartOnRectangleIcon
                    className="mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                  Log out
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default AdminProfileDropdown;
