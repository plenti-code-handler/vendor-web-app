"use client";

import React, { Fragment, useEffect, useState } from "react";
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
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/20/solid";
import { useDispatch } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/updatePasswordSlice";
import { setOpenDrawer as setDeleteDrawer } from "../../redux/slices/deleteAccountSlice";
import { useRouter } from "next/navigation";
import { getUserLocal } from "../../redux/slices/loggedInUserSlice";

const ProfileDropdown = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [user, setUser] = useState({});

  const handleOpenDrawer = () => {
    dispatch(setOpenDrawer(true));
  };

  const handleDeleteDrawer = () => {
    dispatch(setDeleteDrawer(true));
  };

  const handleProfileClick = () => {
    router.replace("/business/profile");
  };

  useEffect(() => {
    const user = getUserLocal();
    setUser(user);
  }, []);

  return (
    <Menu
      as="div"
      className="relative inline-block text-left"
      title="Your Profile"
    >
      <div>
        <MenuButton className="flex items-center h-9 w-9 sm:h-10 sm:w-10 lg:h-10 lg:w-10 rounded-md focus:outline-none focus:ring-2 focus:ring-white hover:ring-2 hover:ring-white">
          <img
            alt="User"
            src={user.imageUrl || "/User.png"}
            className="rounded-[6px] object-cover w-full h-full hover:cursor-pointer focus:outline-none"
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
        <MenuItems className="absolute right-0 mt-2 w-48 sm:w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
          <div className="px-1 py-1 ">
            <MenuItem>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-main text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-xs sm:text-sm`}
                  onClick={() => handleProfileClick()}
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
                  Update Password
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
            {/* This div is for small devices */}
            <MenuItem>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-main text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-xs sm:text-sm`}
                >
                  <ArrowRightOnRectangleIcon
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
