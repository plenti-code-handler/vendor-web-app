import SearchField from "../../../fields/SearchField";
import React from "react";

const TableUpper = () => {
  return (
    <div className="flex justify-between items-center mb-4 px-2 truncate sm:px-4">
      <p className="text-[16px] font-bold text-blackTwo">Recent Orders</p>
      <SearchField />
    </div>
  );
};

export default TableUpper;
