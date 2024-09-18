import SearchField from "../../../fields/SearchField";
import React from "react";

const TableUpper = ({ setSearchTerm }) => {
  return (
    <div className="flex justify-between mb-4 px-2 truncate sm:px-2 flex-col lg:flex-row md:flex-row gap-2 lg:gap-0 md:gap-0">
      <p className="text-[16px] font-bold text-blackTwo">Recent Orders</p>
      <div className="flex flex-col lg:flex-row md:flex-row gap-2 lg:gap-3">
        <SearchField
          setSearchTerm={setSearchTerm}
          placeholder={"Search By Customer or Deal"}
        />
      </div>
    </div>
  );
};

export default TableUpper;
