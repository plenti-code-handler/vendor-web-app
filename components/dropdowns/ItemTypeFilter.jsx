import React from "react";
import { ALL_ITEM_TYPES, ITEM_TYPE_DISPLAY_NAMES } from "../../constants/itemTypes";

const ItemTypeFilter = ({ selectedFilter, onFilterChange }) => {
  return (
    <select
      value={selectedFilter || ALL_ITEM_TYPES[0]}
      onChange={(e) => onFilterChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent"
    >
      {ALL_ITEM_TYPES.map((itemType) => (
        <option key={itemType} value={itemType} className="text-base">
          {ITEM_TYPE_DISPLAY_NAMES[itemType]}
        </option>
      ))}
    </select>
  );
};

export default ItemTypeFilter;
