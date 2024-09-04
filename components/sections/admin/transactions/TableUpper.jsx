"use client";
import SearchField from "../../../fields/SearchField";
import React, { useEffect } from "react";
import MonthFilter from "../../../dropdowns/MonthFilter";
import SortByAmount from "../../../dropdowns/SortByAmount";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../../../redux/slices/headerSlice";

const TableUpper = ({ setSearchTerm }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("Transactions"));
  }, [dispatch]);

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4 px-2 sm:px-4 ">
      <p className="text-[16px] font-bold text-blackTwo hidden md:block w-full basis-[15%]">
        Transactions
      </p>
      <div className="flex flex-col justify-end items-center gap-2 sm:flex-row w-full">
        <div className="flex flex-col sm:justify-end sm:flex-row gap-2 sm:gap-2 w-full">
          {/* <MonthFilter /> */}
          {/* <SortByAmount /> */}
          <SearchField
            setSearchTerm={setSearchTerm}
            placeholder={"Search By Restaurent"}
          />
        </div>
      </div>
    </div>
  );
};

export default TableUpper;
