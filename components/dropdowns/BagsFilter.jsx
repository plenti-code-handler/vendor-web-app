import { useEffect, useState } from "react";
import { arrowDownGray } from "../../svgs";

const BagsFilter = ({ selectedFilter, onFilterChange }) => {
  return (
    <form className="w-auto min-w-[160px]">
      <div className="relative">
        <select
          id="bags"
          className="bg-grayFive text-grayThree text-sm font-semibold rounded-lg focus:ring-grayTwo focus:border-grayTwo block w-full p-2.5 appearance-none"
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="active" className="text-base">
            {`Active`}
          </option>
          <option value="expired" className="text-base">
            {`Expired`}
          </option>
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          {arrowDownGray}
        </div>
      </div>
    </form>
  );
};

export default BagsFilter;
