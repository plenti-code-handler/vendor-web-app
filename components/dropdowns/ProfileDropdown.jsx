"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserLocal } from "../../redux/slices/loggedInUserSlice";

const ProfileDropdown = () => {
  const router = useRouter();
  const [user, setUser] = useState({});

  const handleProfileClick = () => {
    router.replace("/business/profile");
  };

  useEffect(() => {
    const user = getUserLocal();
    setUser(user);
  }, []);

  return (
    <div className="relative inline-block text-left" title="Your Profile">
      <button
        onClick={handleProfileClick}
        className="flex items-center h-9 w-9 sm:h-10 sm:w-10 lg:h-10 lg:w-10 rounded-md focus:outline-none focus:ring-2 focus:ring-white hover:ring-2 hover:ring-white"
      >
        <img
          alt="User"
          src="/User.png"
          className="rounded-[6px] object-cover w-full h-full hover:cursor-pointer focus:outline-none"
        />
      </button>
    </div>
  );
};

export default ProfileDropdown;
