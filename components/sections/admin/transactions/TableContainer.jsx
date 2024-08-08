"use client";
import React from "react";
import TableUpper from "./TableUpper";
import TransactionsTable from "../../../sections/admin/transactions/TransactionsTable";

const TableContainer = () => {
  return (
    <>
      <TableUpper />
      <TransactionsTable />
    </>
  );
};

export default TableContainer;
