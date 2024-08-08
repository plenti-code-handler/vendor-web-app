"use client";
import SearchField from "../../../fields/SearchField";
import React, { useEffect } from "react";
import MonthFilter from "../../../dropdowns/MonthFilter";
import SortByAmount from "../../../dropdowns/SortByAmount";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../../../redux/slices/headerSlice";

const TableUpper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("Transactions"));
  }, [dispatch]);

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4 px-2 sm:px-4 ">
      <p className="text-[16px] font-bold text-blackTwo hidden sm:block w-full sm:w-auto">
        Bags Made
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-0 w-full sm:w-auto space-x-8">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0  lg:w-[150%] lg:space-x-8">
        <MonthFilter />
        <SortByAmount />
        </div>
        <div className="w-full sm:w-auto lg:w-[100%]">
          <SearchField placeholder={"Search By Restaurent"} />
        </div>
      </div>
    </div>
  );
};

export default TableUpper;
