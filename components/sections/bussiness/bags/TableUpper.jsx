"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import BagsFilter from "../../../dropdowns/BagsFilter";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../../../redux/slices/headerSlice";
import ToggleOnlineOffline from "../../../sections/bussiness/profile/ToggleOnlineOffline";

const TableUpper = ({ selectedFilter, onFilterChange }) => {
  const dispatch = useDispatch();
  const onlineStatus = useSelector((state) => state.vendor.vendorData?.is_online);
  useEffect(() => {
    dispatch(setActivePage("Manage Bags"));
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 px-2 sm:px-4">
      <p className="text-xl font-bold text-blackTwo hidden sm:block">{`My Bags`}</p>
      <div className="flex w-full items-center justify-end gap-3 sm:w-auto sm:justify-end">
        <ToggleOnlineOffline/>
        <BagsFilter
          selectedFilter={selectedFilter}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
};

export default TableUpper;
