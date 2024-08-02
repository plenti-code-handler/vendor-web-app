import SearchField from "../../../fields/SearchField";
import React from "react";

const TableUpper = () => {
  return (
    <div className="flex justify-between items-center mb-4 px-2 truncate sm:px-2">
      <p className="text-[16px] font-bold text-blackTwo">Recent Orders</p>
      <SearchField placeholder={"Search Order"} />
    </div>
  );
};

export default TableUpper;
