"use client";
import SearchField from "../../../fields/SearchField";
import React, { useEffect } from "react";
import ApprovalsFilter from "../../../dropdowns/ApprovalsFilter";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../../../redux/slices/headerSlice";

const TableUpper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("Approvals"));
  }, [dispatch]);

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4 px-2 sm:px-4">
      <p className="text-[20px] font-bold text-blackTwo hidden sm:block">
        Total Approvals
      </p>
      <div className="flex flex-col sm:flex-row w-full sm:w-auto">
        <ApprovalsFilter />
        <SearchField placeholder={"Search People"} />
      </div>
    </div>
  );
};

export default TableUpper;
