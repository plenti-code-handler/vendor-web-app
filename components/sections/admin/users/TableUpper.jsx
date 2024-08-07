import SearchField from "../../../fields/SearchField";
import React from "react";

const TableUpper = ({ activeTable, setActiveTable }) => {
  return (
    <div className="flex justify-between items-center mb-4 px-2 truncate sm:px-2 flex-col lg:flex-row md:flex-row gap-2 lg:gap-0 md:gap-0">
      <p className="text-[16px] font-bold text-blackTwo">
        {activeTable === "business" ? "Business" : "Customer"}
      </p>
      <div className="flex flex-col lg:flex-row md:flex-row gap-2 lg:gap-0 lg:w-[50%]">
        <SearchField placeholder={"Search User"} />
        <div className="flex gap-1 lg:w-[120%]">
          <button
            onClick={() => setActiveTable("business")}
            className={`flex justify-center ${
              activeTable === "business"
                ? "bg-pinkBgDark text-white"
                : "bg-white text-gray-500"
            } font-bold border ${
              activeTable === "business"
                ? "border-pinkBgDark"
                : "border-gray-300"
            } font-md py-2 rounded hover:bg-pinkBgDarkHover gap-2 w-[100%]`}
          >
            Business
          </button>
          <button
            onClick={() => setActiveTable("customer")}
            className={`flex justify-center ${
              activeTable === "customer"
                ? "bg-pinkBgDark text-white"
                : "bg-white text-gray-500"
            } font-bold border ${
              activeTable === "customer"
                ? "border-pinkBgDark"
                : "border-gray-300"
            } font-md py-2 rounded hover:bg-pinkBgDarkHover gap-2 w-[100%]`}
          >
            Customer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableUpper;
