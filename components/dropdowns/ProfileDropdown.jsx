"use client";

import React, { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  PencilIcon,
  TrashIcon,
  UserIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/20/solid";
import { useDispatch } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/updatePasswordSlice";
import { setOpenDrawer as setDeleteDrawer } from "../../redux/slices/deleteAccountSlice";

const ProfileDropdown = () => {
  const dispatch = useDispatch();

  const handleOpenDrawer = () => {
    dispatch(setOpenDrawer(true));
  };
  const handleDeleteDrawer = () => {
    dispatch(setDeleteDrawer(true));
  };
  return (
    <Menu as="div" className="relative" title="Your Profile">
      <div>
        <MenuButton className="flex items-center rounded-md text-sm focus:outline-none mr-2 focus:ring-2 focus:ring-white hover:ring-2 hover:ring-white">
          <img
            alt="User"
            src="/User.png"
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
          <div className="px-1 py-1 ">
            <MenuItem>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-main text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-xs sm:text-sm`}
                >
                  <UserIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  Profile
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-main text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-xs sm:text-sm`}
                  onClick={() => handleOpenDrawer()}
                >
                  <PencilIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  Change Password
                </button>
              )}
            </MenuItem>
          </div>
          <div className="px-1 py-1">
            <MenuItem>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-red-800 text-red-100" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-xs sm:text-sm`}
                  onClick={() => handleDeleteDrawer()}
                >
                  <TrashIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  Delete Account
                </button>
              )}
            </MenuItem>
          </div>
          <div className="px-1 py-1 block sm:hidden">
            {" "}
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

export default ProfileDropdown;
