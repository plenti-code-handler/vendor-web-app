"use client";
import SearchField from "../../../fields/SearchField";
import React, { useEffect } from "react";
import ApprovalsFilter from "../../../dropdowns/ApprovalsFilter";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../../../redux/slices/headerSlice";

const TableUpper = ({ setSearchTerm, userFilter, onUserFilterChange }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("Approvals"));
  }, [dispatch]);

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4 w-full">
      <p className="text-xl font-bold text-blackTwo w-full sm:w-auto text-center sm:text-left hidden sm:block">
        Total Approvals
      </p>
      <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-4 sm:w-auto">
        <ApprovalsFilter
          selectedFilter={userFilter}
          onFilterChange={onUserFilterChange}
          className="w-full sm:w-auto"
        />
        <SearchField
          placeholder={"Search People"}
          className="w-full sm:w-auto"
          setSearchTerm={setSearchTerm}
        />
      </div>
    </div>
  );
};

export default TableUpper;
