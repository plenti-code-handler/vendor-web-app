"use client";
import React, { useState } from "react";
import TableUpper from "./TableUpper";
import BagsTable from "./BagsTable";
import ScheduledBagsTable from "./ScheduledBagsTable";

const TableContainer = () => {
  const [filterType, setFilterType] = useState("All Bags");

  return (
    <div className="mt-4 w-full border border-gray-200 rounded-xl p-6 sm:px-4">
      {filterType === "All Bags" && <BagsTable />}
    </div>
  );
};

export default TableContainer;
