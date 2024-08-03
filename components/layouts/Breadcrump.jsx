"use client";
import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { addUserSvg } from "../../svgs";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../redux/slices/headerSlice";
import { setOpenDrawer } from "../../redux/slices/addBagSlice";

const decidePath = (pathname, dispatch) => {
  const path = pathname.split("/").at(-1);

  switch (path) {
    case "business":
      dispatch(setActivePage("Dashboard"));
      return "My Dashboard";
    case "manage-bags":
      dispatch(setActivePage("Manage Bags"));
      return "Manage Bags";
    case "bookings":
      dispatch(setActivePage("Bookings"));
      return "Bookings";
    case "more":
      dispatch(setActivePage("More"));
      return "More Options";
    default:
      return "";
  }
};

const Breadcrumb = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleOpenDrawer = () => {
    dispatch(setOpenDrawer(true));
  };

  const currentPath = useMemo(
    () => decidePath(pathname, dispatch),
    [pathname, dispatch]
  );

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
    <div className="flex justify-between items-center m-4 lg:mr-auto lg:mt-4 lg:mb-4 lg:py-2 lg:w-[99%]">
      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-one">
        {currentPath}
      </p>
      {currentPath === "Manage Bags" && (
        <>
          <button
            onClick={() => handleOpenDrawer()}
            className="flex items-center justify-between bg-pinkBgDark text-white font-semibold py-2 px-4 rounded hover:bg-pinkBgDarkHover gap-2 lg:w-[15%]"
          >
            <span>New Bag</span>
            <span>{addUserSvg}</span>
          </button>
        </>
      )}
    </div>
  );

  return currentPath === "More Options" ? (
    <MoreOptionsContent />
  ) : (
    <>
      <DefaultContent />
    </>
  );
};

export default Breadcrumb;
