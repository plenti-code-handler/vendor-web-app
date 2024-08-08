"use client";
import React, { useMemo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { addUserSvg, backButtonSvg } from "../../svgs";
import { useDispatch } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/addBagSlice";

const decidePath = (pathname) => {
  // Check for specific patterns
  if (pathname.match(/\/admin\/users\/business\/[a-z0-9]+/)) {
    return "Business Details";
  } else if (pathname.match(/\/admin\/users\/customer\/[a-z0-9]+/)) {
    return "Customer Details";
  }

  // Check the last part of the path for general cases
  const path = pathname.split("/");
  const lastPath = path.at(-1);

  switch (lastPath) {
    case "business":
      return "My Dashboard";
    case "manage-bags":
      return "Manage Bags";
    case "bookings":
      return "Bookings";
    case "more":
      return "More Options";
    case "profile":
      return "My Profile";
    case "admin":
      return "Admin Dashboard";
    case "users":
      return "Users";
    default:
      return "";
  }
};

const Breadcrumb = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleOpenDrawer = useCallback(() => {
    dispatch(setOpenDrawer(true));
  }, [dispatch]);

  const handleBackClick = useCallback(() => {
    router.replace("/admin/users");
  }, [router]);

  const currentPath = useMemo(() => decidePath(pathname), [pathname]);

  const MoreOptionsContent = () => (
    <div className="flex flex-col items-center">
      <img
        alt="Foodie Finder Logo"
        src="https://firebasestorage.googleapis.com/v0/b/foodie-finder-ee1d8.appspot.com/o/app_logo.png?alt=media&token=8e779e74-bdc7-4dc6-8634-55a30110bc98"
        className="lg:h-[25%] lg:w-[25%]"
      />
      <p className="text-lg sm:text-sm md:text-2xl lg:text-[20px] font-semibold text-graySix">
        {currentPath}
      </p>
    </div>
  );

  const DefaultContent = () => (
    <div className="flex justify-between items-center lg:mr-auto lg:mt-4 lg:mb-4 lg:py-2 lg:w-[99%]">
      <p className="m-4 text-lg sm:m-0 sm:text-xl md:text-2xl lg:text-3xl font-bold text-one">
        {currentPath}
      </p>
      {currentPath === "Manage Bags" && (
        <button
          onClick={handleOpenDrawer}
          className="mr-3 mt-2 lg:m-0 flex items-center text-center justify-center bg-pinkBgDark text-white font-semibold py-2 px-4 rounded hover:bg-pinkBgDarkHover lg:w-[15%]"
        >
          <span className="mr-3 ml-2">New Bag</span>
          <span>{addUserSvg}</span>
        </button>
      )}
    </div>
  );

  const DetailsContent = ({ content }) => (
    <div className="flex items-center gap-4 m-4 lg:m-0 lg:mr-auto lg:mt-4 lg:mb-4 lg:py-2 lg:w-[99%]">
      <button
        onClick={handleBackClick}
        className="bg-gray-100 p-1 rounded-full border border-gray-400 hover:bg-gray-200"
      >
        {backButtonSvg}
      </button>
      <p className="m-4 text-lg sm:m-0 sm:text-xl md:text-2xl lg:text-3xl font-bold text-one">
        {content}
      </p>
    </div>
  );

  if (currentPath === "More Options") {
    return <MoreOptionsContent />;
  } else if (currentPath === "Business Details" || currentPath === "Customer Details") {
    return <DetailsContent content={currentPath} />;
  } else {
    return <DefaultContent />;
  }
};

export default Breadcrumb;
