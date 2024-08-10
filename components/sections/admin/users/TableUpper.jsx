"use client";

import SearchField from "../../../fields/SearchField";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../../../redux/slices/headerSlice";

const TableUpper = ({ activeTable, setActiveTable }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("Users"));
  }, [dispatch]);

  return (
    <div className="flex flex-col lg:flex-row md:flex-row justify-between items-center mb-4 px-2 sm:px-2 gap-2 lg:gap-0 md:gap-0 w-full">
      <p className="text-[20px] font-semibold text-blackTwo w-full lg:w-auto text-center lg:text-left">
        {activeTable === "business" ? "Businesses" : "Customers"}
      </p>
      <div className="flex flex-col lg:flex-row md:flex-row gap-2 lg:gap-2 w-full lg:w-[35%]">
        <SearchField placeholder={"Search User"} className="w-full" />
        <div className="flex gap-3 w-full lg:w-auto justify-center">
          <button
            onClick={() => setActiveTable("business")}
            className={`flex justify-center ${
              activeTable === "business"
                ? "bg-pinkBgDark text-white"
                : "bg-white text-gray-500"
            } font-bold rounded-[6px] hover:bg-pinkBgDarkHover hover:text-pinkBgDark w-full lg:w-[90px] h-[38px] text-[13px] items-center`}
          >
            Business
          </button>
          <button
            onClick={() => setActiveTable("customer")}
            className={`flex justify-center ${
              activeTable === "customer"
                ? "bg-pinkBgDark text-white"
                : "bg-white text-gray-500"
            } font-bold rounded-[6px] hover:bg-pinkBgDarkHover hover:text-pinkBgDark w-full lg:w-[90px] h-[38px] text-[13px] items-center`}
          >
            Customer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableUpper;
