"use client";
import SearchField from "../../../fields/SearchField";
import React from "react";
import BagsFilter from "../../../dropdowns/BagsFilter";

const TableUpper = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4 px-2 sm:px-4">
      <p className="text-[16px] font-bold text-blackTwo hidden sm:block">
        My Bags
      </p>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <BagsFilter />
        <SearchField placeholder={"Search Bag"} />
      </div>
    </div>
  );
};

export default TableUpper;
