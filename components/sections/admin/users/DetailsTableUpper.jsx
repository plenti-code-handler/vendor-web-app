"use client";
import SearchField from "../../../fields/SearchField";
import React from "react";
import BookingsFilter from "../../../dropdowns/BookingsFilter";
import StatusFilter from "../../../dropdowns/StatusFilter";
const DetailsTableUpper = ({
  setSearchTerm,
  bookingFilter,
  onBookingFilterChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4 px-2 sm:px-4 lg:w-[100%]">
      <p className="text-[20px] font-bold text-blackTwo hidden sm:block w-full sm:w-auto lg:w-[40%]">
        Bags Made
      </p>
      <div className="flex flex-col justify-end items-center gap-2 sm:flex-row w-full">
        <div className="flex flex-col sm:justify-end sm:flex-row gap-2 sm:gap-2 w-full">
          {/* <StatusFilter /> */}
          <BookingsFilter
            selectedFilter={bookingFilter}
            onFilterChange={onBookingFilterChange}
          />
        </div>
        <div className="lg:w-[40%]">
          <SearchField
            setSearchTerm={setSearchTerm}
            placeholder={"Search Booking"}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailsTableUpper;
