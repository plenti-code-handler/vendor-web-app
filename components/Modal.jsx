import React from "react";
import { XMarkIcon, ClockIcon, TagIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { formatDateTime } from "../utility/FormateTime";
import { useSelector } from "react-redux";
import { ITEM_TYPE_ICONS, ITEM_TYPE_DISPLAY_NAMES } from "../constants/itemTypes";

const Modal = ({ isOpen, onClose, item }) => {
  const { itemTypes } = useSelector((state) => state.catalogue);

  if (!isOpen || !item) return null;

  // Get prices from catalogue based on item type
  const getPrices = () => {
    const catalogueItem = itemTypes[item.item_type];
    console.log("catalogueItem", catalogueItem);
    if (catalogueItem && catalogueItem.bags) {
      return {
        small: catalogueItem.bags.SMALL || "N/A",
        medium: catalogueItem.bags.MEDIUM || "N/A",
        large: catalogueItem.bags.LARGE || "N/A"
      };
    }
    return { small: "N/A", medium: "N/A", large: "N/A" };
  };

  const prices = getPrices();
  const itemIcon = ITEM_TYPE_ICONS[item.item_type] || "🍽️";
  const itemDisplayName = ITEM_TYPE_DISPLAY_NAMES[item.item_type] || item.item_type.replace(/_/g, " ");

  // Format allergens for display
  const formatAllergens = (allergens) => {
    if (!allergens || allergens.length === 0) return "None";
    return allergens.join(", ");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="relative bg-white border-b border-gray-100 rounded-t-xl p-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{itemIcon}</div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{itemDisplayName}</h2>
              <p className="text-gray-500 text-sm">Item Details</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <TagIcon className="h-4 w-4 text-[#5F22D9]" />
              Description
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {item.description || "No description available"}
            </p>
          </div>

          {/* Servings Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#5F22D9]/30 transition-colors duration-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h3 className="font-medium text-gray-900 text-sm">Veg Servings Left</h3>
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {item.veg_servings_current || 0}
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#5F22D9]/30 transition-colors duration-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <h3 className="font-medium text-gray-900 text-sm">Non-Veg Servings Left</h3>
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {item.non_veg_servings_current || 0}
              </p>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <TagIcon className="h-4 w-4 text-[#5F22D9]" />
              Pricing
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-600 mb-1">Small</p>
                  <p className="text-lg font-semibold text-[#5F22D9]">
                  ₹{prices.small}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-600 mb-1">Medium</p>
                  <p className="text-lg font-semibold text-[#5F22D9]">
                  ₹{prices.medium}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-600 mb-1">Large</p>
                  <p className="text-lg font-semibold text-[#5F22D9]">
                  ₹{prices.large}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Allergens */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-[#5F22D9]" />
              Allergens
            </h3>
            <div className="flex flex-wrap gap-2">
              {item.allergens && item.allergens.length > 0 ? (
                item.allergens.map((allergen, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#5F22D9]/10 text-[#5F22D9] text-xs font-medium rounded-full border border-[#5F22D9]/20"
                  >
                    {allergen}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No allergens listed</span>
              )}
            </div>
          </div>

          {/* Timing Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-[#5F22D9]" />
              Timing Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Window Start:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDateTime(item.window_start_time) || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Window End:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDateTime(item.window_end_time) || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Best Before:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDateTime(item.best_before_time) || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Created:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDateTime(item.created_at) || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 rounded-b-xl p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#5F22D9] text-white font-medium rounded-lg hover:bg-[#4A1BB8] transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
