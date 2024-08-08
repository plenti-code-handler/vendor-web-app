"use client";
import SearchField from "../../../fields/SearchField";
import React from "react";
import BookingsFilter from "../../../dropdowns/BookingsFilter";
import StatusFilter from "../../../dropdowns/StatusFilter";

const DetailsTableUpper = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4 px-2 sm:px-4">
      <p className="text-[16px] font-bold text-blackTwo hidden sm:block w-full sm:w-auto">
        Bags Made
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-0 w-full sm:w-auto">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 w-full sm:w-auto lg:w-[150%]">
          <StatusFilter />
          <BookingsFilter />
        </div>
        <div className="w-full sm:w-auto lg:w-[80%]">
          <SearchField placeholder={"Search Booking"} />
        </div>
      </div>
    </div>
  );
};

export default DetailsTableUpper;
