"use client";
import SearchField from "../../../fields/SearchField";
import React from "react";
import BookingsFilter from "../../../dropdowns/BookingsFilter";
import StatusFilter from "../../../dropdowns/StatusFilter";

const TableUpper = ({
  setSearchTerm,
  // selectedFilter,
  // onFilterChange,
  bookingFilter,
  onBookingFilterChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4 px-2 sm:px-4">
      <p className="text-xl font-bold text-blackTwo hidden sm:mr-5 sm:block w-full sm:w-auto">
        Orders
      </p>
      <div className="flex flex-col items-center gap-2 sm:flex-row w-full sm:w-auto">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* <StatusFilter
            selectedFilter={selectedFilter}
            onFilterChange={onFilterChange}
          /> */}
          <BookingsFilter
            selectedFilter={bookingFilter}
            onFilterChange={onBookingFilterChange}
          />
        </div>
        <div className="w-full sm:w-auto lg:w-[80%]">
          <SearchField
            placeholder={"Search Booking"}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </div>
    </div>
  );
};

export default TableUpper;
