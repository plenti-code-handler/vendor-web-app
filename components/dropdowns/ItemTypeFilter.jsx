import { useEffect, useState } from "react";
import { arrowDownGray } from "../../svgs";

const ItemTypeFilter = ({ selectedFilter, onFilterChange }) => {
  return (
    <form className="w-full">
      <div className="relative">
        <select
          id="bags"
          className="bg-grayFive text-grayThree text-sm font-semibold rounded-lg focus:ring-grayTwo focus:border-grayTwo block w-full p-2.5 appearance-none"
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="" className="text-base">
            {`Item Type`}
          </option>
          <option value="MEAL" className="text-base">
            {`Meal`}
          </option>
          <option value="BAKED_GOODS" className="text-base">
            {`Baked Goods`}
          </option>
          <option value="SNACKS_AND_DESSERT" className="text-base">
            {`Snacks and desserts`}
          </option>
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          {arrowDownGray}
        </div>
      </div>
    </form>
  );
};

export default ItemTypeFilter;
