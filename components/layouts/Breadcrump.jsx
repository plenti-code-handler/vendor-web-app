"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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
    <div className="flex items-center m-4 lg:py-2">
      <p className=" text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-one">
        {currentPath}
      </p>
    </div>
  );
};

export default Breadcrumb;
