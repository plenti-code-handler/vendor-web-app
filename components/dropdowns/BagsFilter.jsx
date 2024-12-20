import { useEffect, useState } from "react";
import { arrowDownGray } from "../../svgs";

const BagsFilter = ({ selectedFilter, onFilterChange }) => {
 

    

  return (
    <form className="max-w-lg w-full lg:w-60">
      <div className="relative">
        <select
          id="bags"
          className="bg-grayFive text-grayThree text-sm font-semibold rounded-lg focus:ring-grayTwo focus:border-grayTwo block w-full p-2.5 appearance-none"
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="" className="text-base">
            {`All bags`}
          </option>
          <option value="scheduled" className="text-base">
            {`Scheduled bags`}
          </option>
          <option value="active" className="text-base">
            {`Active bags`}
          </option>
          <option value="past" className="text-base">
            {`Past bags`}
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
