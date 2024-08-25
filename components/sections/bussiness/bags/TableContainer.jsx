"use client";
import React, { useState } from "react";
import TableUpper from "./TableUpper";
import BagsTable from "./BagsTable";
import ScheduledBagsTable from "./ScheduledBagsTable";

const TableContainer = () => {
  const [filterType, setFilterType] = useState("All Bags");

  return (
    <div className="mt-4 w-full border border-gray-200 rounded-xl p-6 sm:px-4">
      {/* <TableUpper selectedFilter={filterType} onFilterChange={setFilterType} /> */}
      {filterType === "All Bags" && <BagsTable />}
      {filterType === "Scheduled Bags" && <ScheduledBagsTable />}
    </div>
  );
};

export default TableContainer;
