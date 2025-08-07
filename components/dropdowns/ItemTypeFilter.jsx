import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ALL_ITEM_TYPES, ITEM_TYPE_DISPLAY_NAMES, ITEM_TYPE_ICONS, ITEM_TYPE_DESCRIPTIONS } from '../../constants/itemTypes';
import { fetchCatalogue } from '../../redux/slices/catalogueSlice';
import { useRouter } from 'next/navigation';

const ItemTypeFilter = ({ selectedFilter, onFilterChange }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCatalogue()); 
  }, [dispatch]);

  const { itemTypes } = useSelector((state) => state.catalogue);
  const router = useRouter();

  const getAvailableCategories = () => {

    return ALL_ITEM_TYPES.filter(itemType => {
      const catalogueItem = itemTypes[itemType];
      console.log(catalogueItem);
      return catalogueItem && catalogueItem.bags && Object.keys(catalogueItem.bags).length > 0;
    });
  };

  const availableCategories = getAvailableCategories();

  if (availableCategories.length === 0) {
    return (
      <div className="text-center py-8">
        {/* Subtle Oops Logo */}
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>
          <p className="text-xs text-gray-400 font-medium">Oops!</p>
        </div>
        
        <p className="text-sm mb-4 text-gray-500">There are no categories activated for you.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Select Category</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {availableCategories.map((itemType) => {
          const isSelected = selectedFilter === itemType;
          return (
            <button
              key={itemType}
              onClick={() => onFilterChange(itemType)}
              className={`relative group transition-all duration-200 ${
                isSelected
                  ? 'transform translate-y-1'
                  : 'hover:transform hover:-translate-y-1'
              }`}
            >
              {/* Retro Lifted Button Design */}
              <div className={`relative rounded-2xl border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-[#5F22D9] bg-gradient-to-br from-[#722BFF] to-[#722BFF]  shadow-[0_6px_0_#4C1D95]'
                  : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white text-gray-700 shadow-[0_6px_0_#D1D5DB] hover:shadow-[0_8px_0_#9CA3AF] hover:border-gray-400'
              }`}>
                
                {/* Button Content */}
                <div className="p-4 text-center space-y-3 max-h-[100%] ">
                  {/* Icon */}
                  <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-2xl transition-all duration-200 ${
                    isSelected
                      ? 'bg-white/20 text-white shadow-inner'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-[#5F22D9]/10 group-hover:text-[#5F22D9] shadow-inner'
                  }`}>
                    {ITEM_TYPE_ICONS[itemType]}
                  </div>

                  {/* Title */}
                  <div>
                    <h4 className={`font-bold text-xs transition-colors duration-200 ${
                      isSelected ? 'text-white' : 'text-gray-900'
                    }`}>
                      {ITEM_TYPE_DISPLAY_NAMES[itemType]}
                    </h4>
  
                  </div>
                </div>
              </div>

              {/* Pressed State Shadow */}
              {/* {isSelected && (
                <div className="absolute inset-0 rounded-2xl bg-[#4C1D95] transform translate-y-2 -z-10"></div>
              )} */}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ItemTypeFilter;