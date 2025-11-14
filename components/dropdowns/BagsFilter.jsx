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
          <option value="" className="text-base">
            {`All bags`}
          </option>
          <option value="BAKED GOODS" className="text-base">
            {`Baked`}
          </option>
          <option value="SNACKS AND DESSERT" className="text-base">
            {`Snacks and Desserts`}
          </option>
          <option value="Meal" className="text-base">
            {`Meal`}
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
