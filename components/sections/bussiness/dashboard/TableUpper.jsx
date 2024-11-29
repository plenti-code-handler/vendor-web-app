import SearchField from "../../../fields/SearchField";
import React from "react";

const TableUpper = ({ setSearchTerm }) => {
  return (
    <div className="flex justify-between items-center mb-4 px-2 truncate sm:px-2 flex-col lg:flex-row md:flex-row gap-2 lg:gap-0 md:gap-0">
      <p className="text-xl font-semibold text-blackTwo">Recent Orders</p>
      <SearchField placeholder={"Search Order"} setSearchTerm={setSearchTerm} />
    </div>
  );
};

export default TableUpper;
