"use client";
import SearchField from "../../../fields/SearchField";
import React from "react";
import BookingsFilter from "../../../dropdowns/BookingsFilter";
import StatusFilter from "../../../dropdowns/StatusFilter";

const TableUpper = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4 px-2 sm:px-4">
      <p className="text-[16px] font-bold text-blackTwo hidden sm:block w-[50%]">
        Orders
      </p>
      <div className="flex flex-col sm:flex-row gap-2 lg:gap-0 w-[50%] sm:w-auto">
        <StatusFilter />
        <BookingsFilter />
        <SearchField placeholder={"Search Booking"} />
      </div>
    </div>
  );
};

export default TableUpper;
