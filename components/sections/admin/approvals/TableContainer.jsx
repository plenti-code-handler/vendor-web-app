"use client";
import React, { useState } from "react";
import TableUpper from "./TableUpper";
import ApprovalsTable from "../../../sections/admin/approvals/ApprovalsTable";

const TableContainer = () => {
  return (
    <>
      <TableUpper />
      <ApprovalsTable />
    </>
  );
};

export default TableContainer;
