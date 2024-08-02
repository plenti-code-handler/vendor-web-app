"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { addUserSvg } from "../../svgs";

const Breadcrumb = () => {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    const decidePath = () => {
      switch (pathname.split("/").at(-1)) {
        case "business":
          setCurrentPath("My Dashboard");
          break;
        case "manage-bags":
          setCurrentPath("Manage Bags");
          break;
        case "bookings":
          setCurrentPath("Bookings");
          break;
        case "more":
          setCurrentPath("More");
          break;
        default:
          setCurrentPath("IDK");
          break;
      }
    };
    decidePath();
  }, [pathname]);

  return (
    <div className="flex justify-between items-center m-4 lg:mr-auto lg:mt-4 lg:mb-4 lg:py-2 lg:w-[99%]">
      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-one">
        {currentPath}
      </p>
      {currentPath === "Manage Bags" && (
        <button className="flex items-center justify-between bg-pinkBgDark text-white font-semibold py-2 px-4 rounded hover:bg-pinkBgDarkHover gap-2 lg:w-[15%]">
          <span>New Bag</span>
          <span>{addUserSvg}</span>
        </button>
      )}
    </div>
  );
};

export default Breadcrumb;
