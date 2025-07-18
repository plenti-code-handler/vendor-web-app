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
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="" className="text-base">
            All Orders
          </option>
          <option value="CREATED" className="text-base">
            Created
          </option>
          <option value="WAITING_FOR_PICKUP" className="text-base">
            Waiting for Pickup
          </option>
          <option value="READY_FOR_PICKUP" className="text-base">
            Ready for Pickup
          </option>
          <option value="PICKED_UP" className="text-base">
            Picked Up
          </option>
          <option value="NOT_PICKED_UP" className="text-base">
            Not Picked Up
          </option>
          <option value="CANCELLED" className="text-base">
            Cancelled
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
