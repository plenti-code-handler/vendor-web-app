import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ALL_ITEM_TYPES, ITEM_TYPE_DISPLAY_NAMES, ITEM_TYPE_ICONS, ITEM_TYPE_DESCRIPTIONS } from '../../constants/itemTypes';
import { fetchCatalogue } from '../../redux/slices/catalogueSlice';
import { useRouter } from 'next/navigation';
import { getAvailableCategories } from '../../utility/bagDrawerUtils';
import PrimaryButton from '../buttons/PrimaryButton';

const ItemTypeFilter = ({ selectedFilter, onFilterChange, selectedPricingId, onPricingChange }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCatalogue()); 
  }, [dispatch]);

  const pricing = useSelector((state) => state.catalogue.pricing);
  const router = useRouter();

  const availableCategories = getAvailableCategories(pricing);

  const pricingsForType = useMemo(() => {
    if (!selectedFilter || !Array.isArray(pricing)) return [];
    return pricing.filter((e) => String(e.item_type) === String(selectedFilter));
  }, [pricing, selectedFilter]);

  // Auto-select first available category if selectedFilter is empty or invalid
  useEffect(() => {
    if (availableCategories.length > 0) {
      const isValidFilter = selectedFilter && availableCategories.includes(selectedFilter);
      if (!isValidFilter) {
        onFilterChange(availableCategories[0]);
      }
    }
  }, [availableCategories, selectedFilter, onFilterChange]);

  // When category or pricing list changes, keep selectedPricingId in sync (default to first or "default")
  useEffect(() => {
    if (pricingsForType.length === 0 || !onPricingChange) return;
    const ids = pricingsForType.map((e) => e.id ?? 'default');
    const defaultId = ids.includes('default') ? 'default' : ids[0];
    if (!selectedPricingId || !ids.includes(selectedPricingId)) {
      onPricingChange(defaultId);
    }
  }, [pricingsForType, selectedPricingId, onPricingChange]);

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
            <PrimaryButton
              key={itemType}
              type="button"
              onClick={() => onFilterChange(itemType)}
              className={`
                flex-row gap-2 px-2 rounded-lg transition-all duration-200
                ${isSelected
                  ? 'shadow-sm'
                  : '!bg-white !border-gray-200 border !text-gray-900 hover:!bg-gray-50 hover:!border-gray-300 hover:!shadow-none hover:scale-100 focus:ring-gray-200'
                }
              `}
              style={{
                animation: `fadeIn 0.15s ease-out ${index * 0.03}s both`
              }}
            >
              <div className="text-3xl">
                {ITEM_TYPE_ICONS[itemType]}
              </div>
              <h4 className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                {ITEM_TYPE_DISPLAY_NAMES[itemType]}
              </h4>
            </PrimaryButton>
          );
        })}
      </div>

      {/* Pricing cards for selected category - same style as AllergensSection */}
        <div className="space-y-2 animate-fade-down">
          <h3 className="text-base font-medium text-gray-900">Select Pricing</h3>
          <div className="flex flex-wrap gap-2">
            {pricingsForType.map((entry) => {
              const pid = entry.id ?? 'default';
              const isSelected = selectedPricingId === pid;
              return (
                <button
                  key={`${entry.item_type}:${pid}`}
                  type="button"
                  onClick={() => onPricingChange?.(pid)}
                  className={`
                    w-fit flex flex-col items-start justify-center px-2.5 py-1.5 rounded-lg border transition-all duration-200 text-left
                    ${isSelected
                      ? 'bg-[#5F22D9]/100 border-[#5F22D9] text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-sm font-bold truncate">{entry.name || pid}</span>
                  <span className={`text-[8px] bg-yellow-200 px-1 py-1 rounded-lg font-medium
                  ${isSelected ? 'text-[#5F22D9]' : 'text-gray-600'}`}>Worth <span className="font-semibold text-xs">₹{entry.asp != null ? entry.asp : '–'}</span></span>
                </button>
              );
            })}
          </div>
        </div>
    </div>
  );
};

export default ItemTypeFilter;