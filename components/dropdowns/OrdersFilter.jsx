import { useState } from "react";
import { arrowDownGray } from "../../svgs";

const OrdersFilter = ({ selectedFilter, onFilterChange }) => {
  return (
    <form className="max-w-lg w-44 lg:w-60">
      <div className="relative">
        <select
          id="orders"
          className="bg-grayFive text-grayThree text-sm font-semibold rounded-lg focus:ring-grayTwo focus:border-grayTwo block w-full p-2.5 appearance-none"
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value === 'true' ? true : e.target.value === 'false' ? false : null)}
        >
          <option value="true" className="text-base">
            Active Orders
          </option>
          <option value="false" className="text-base">
            Completed Orders
          </option>
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          {arrowDownGray}
        </div>
      </div>
    </form>
  );
};

export default OrdersFilter;