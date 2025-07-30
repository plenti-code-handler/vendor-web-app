import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ALL_ITEM_TYPES, ITEM_TYPE_DISPLAY_NAMES } from '../../constants/itemTypes';
import { fetchCatalogue } from '../../redux/slices/catalogueSlice';

const ItemTypeFilter = ({ selectedFilter, onFilterChange }) => {
  // Get catalogue data from Redux store
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCatalogue()); 
  }, [dispatch]);

  const { itemTypes } = useSelector((state) => state.catalogue);

  // Filter available categories based on catalogue data
  const getAvailableCategories = () => {
    console.log(itemTypes);
    if (!itemTypes || Object.keys(itemTypes).length === 0) {
      return ALL_ITEM_TYPES; // Show all if no catalogue data
    }

    // Only show categories that exist in the catalogue
    return ALL_ITEM_TYPES.filter(itemType => {
      const catalogueItem = itemTypes[itemType];
      console.log(catalogueItem);
      return catalogueItem && catalogueItem.bags && Object.keys(catalogueItem.bags).length > 0;
    });
  };

  const availableCategories = getAvailableCategories();

  return (
    <select
      value={selectedFilter || (availableCategories.length > 0 ? availableCategories[0] : '')}
      onChange={(e) => onFilterChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent"
      disabled={availableCategories.length === 0}
    >
      {availableCategories.length === 0 ? (
        <option value="" disabled>
          No categories available
        </option>
      ) : (
        availableCategories.map((itemType) => (
          <option key={itemType} value={itemType} className="text-base">
            {ITEM_TYPE_DISPLAY_NAMES[itemType]}
          </option>
        ))
      )}
    </select>
  );
};

export default ItemTypeFilter;