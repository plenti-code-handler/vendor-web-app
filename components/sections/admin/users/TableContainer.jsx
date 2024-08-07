"use client";
import React, { useState } from "react";
import TableUpper from "./TableUpper";
import BusinessesTable from "../../../sections/admin/users/BusinessesTable";
import CustomersTable from "../../../sections/admin/users/CustomersTable";

const TableContainer = () => {
  const [activeTable, setActiveTable] = useState("business");

  return (
    <div className="mt-4 w-full border border-gray-300 rounded-md p-6 sm:px-4">
      <TableUpper activeTable={activeTable} setActiveTable={setActiveTable} />
      {activeTable === "business" ? <BusinessesTable /> : <CustomersTable />}
    </div>
  );
};

export default TableContainer;
