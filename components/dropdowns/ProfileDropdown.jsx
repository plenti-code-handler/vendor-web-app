import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const ProfileDropdown = () => {
  return (
    <Menu as="div" className="relative">
      <div>
        <MenuButton className="flex items-center rounded-md text-sm focus:outline-none mr-2 focus:ring-2 focus:ring-white">
          <img
            alt="User"
            src="/User.png"
            className="h-8 w-8 lg:h-9 lg:w-12 rounded-md"
          />
        </MenuButton>
      </div>
      <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-opacity focus:outline-none">
        <MenuItem>
          {({ active }) => (
            <a
              href="#"
              className={`block px-4 py-2 text-sm ${
                active ? "bg-gray-100 text-gray-900" : "text-gray-700"
              }`}
            >
              Profile
            </a>
          )}
        </MenuItem>
        <MenuItem>
          {({ active }) => (
            <a
              href="#"
              className={`block px-4 py-2 text-sm ${
                active ? "bg-gray-100 text-gray-900" : "text-gray-700"
              }`}
            >
              Change Password
            </a>
          )}
        </MenuItem>
        <MenuItem>
          {({ active }) => (
            <a
              href="#"
              className={`block px-4 py-2 text-sm ${
                active ? "bg-gray-100 text-gray-900" : "text-gray-700"
              }`}
            >
              Delete Account
            </a>
          )}
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};

export default ProfileDropdown;
