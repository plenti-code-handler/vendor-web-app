import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ALL_ITEM_TYPES, ITEM_TYPE_DISPLAY_NAMES, ITEM_TYPE_ICONS, ITEM_TYPE_DESCRIPTIONS } from '../../constants/itemTypes';
import { fetchCatalogue } from '../../redux/slices/catalogueSlice';
import { useRouter } from 'next/navigation';
import { getAvailableCategories } from '../../utility/bagDrawerUtils';

const ItemTypeFilter = ({ selectedFilter, onFilterChange }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCatalogue()); 
  }, [dispatch]);

  const { itemTypes } = useSelector((state) => state.catalogue);
  const router = useRouter();

  const availableCategories = getAvailableCategories(itemTypes);

  // Auto-select first available category if selectedFilter is empty or invalid
  useEffect(() => {
    if (availableCategories.length > 0) {
      const isValidFilter = selectedFilter && availableCategories.includes(selectedFilter);
      if (!isValidFilter) {
        onFilterChange(availableCategories[0]);
      }
    }
  }, [availableCategories, selectedFilter, onFilterChange]);

  if (availableCategories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full mb-3">
          <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-600 mb-1">No Categories Available</p>
        <p className="text-xs text-gray-400">Please activate categories to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium text-gray-900">Select Category</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {availableCategories.map((itemType, index) => {
          const isSelected = selectedFilter === itemType;
          return (
            <button
              key={itemType}
              onClick={() => onFilterChange(itemType)}
              className={`
                relative flex flex-col items-center gap-3 px-4 py-5 rounded-lg border transition-all duration-200
                ${isSelected 
                  ? 'bg-[#5F22D9] border-[#5F22D9] shadow-sm' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
              style={{
                animation: `fadeIn 0.15s ease-out ${index * 0.03}s both`
              }}
            >
              {/* Icon */}
              <div className="text-3xl">
                {ITEM_TYPE_ICONS[itemType]}
              </div>

              {/* Title */}
              <h4 className={`
                font-medium text-sm transition-colors duration-200
                ${isSelected ? 'text-white' : 'text-gray-900'}
              `}>
                {ITEM_TYPE_DISPLAY_NAMES[itemType]}
              </h4>

            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ItemTypeFilter;