import SearchField from "../../../fields/SearchField";
import React from "react";

const TableUpper = () => {
  return (
    <div className="flex justify-between items-center mb-4 px-2 truncate sm:px-2 flex-col lg:flex-row md:flex-row gap-2 lg:gap-0 md:gap-0">
      <p className="text-[16px] font-bold text-blackTwo">Recent Orders</p>
      <div className="flex flex-col lg:flex-row md:flex-row gap-2 lg:gap-3">
      <SearchField placeholder={"Search by Restaurent"} />
      <SearchField placeholder={"Search Order"} />
      </div>
    </div>
  );
};

export default TableUpper;
