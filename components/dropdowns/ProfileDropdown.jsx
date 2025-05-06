"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProfileDropdown = () => {
  const router = useRouter();
  const [logo, setLogo] = useState("");

  const handleProfileClick = () => {
    router.replace("/business/profile");
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const vendorLogo = localStorage.getItem("logo");
      if (vendorLogo) {
        setLogo(vendorLogo);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative inline-block text-left" title="Your Profile">
      <button
        onClick={handleProfileClick}
        className="flex items-center h-9 w-9 sm:h-10 sm:w-10 lg:h-10 lg:w-10 rounded-full focus:outline-none "
      >
        <img
          alt="User"
          src={logo || "/User.png"}
          className="rounded-[6px] object-cover w-full h-full rounded-full hover:cursor-pointer focus:outline-none"
        />
      </button>
    </div>
  );
};

export default ProfileDropdown;
