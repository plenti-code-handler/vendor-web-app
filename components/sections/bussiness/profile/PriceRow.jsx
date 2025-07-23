import React from "react";
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const PriceRow = ({
  bagSize,
  itemType,
  isEditing,
  isAdding,
  currentPrice,
  tempPrice,
  onEdit,
  onSave,
  onCancel,
  onAdd,
  onSaveAdd,
  onCancelAdd,
  setTempPrices,
}) => {
  // ✅ Add safety check for bagSize
  if (!bagSize) {
    return null;
  }

  const getSizeColor = (size) => {
    switch (size) {
      case 'SMALL': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LARGE': return 'bg-[#5F22D9]/10 text-[#5F22D9]';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // ✅ Safe string manipulation
  const displayName = bagSize ? bagSize.charAt(0) + bagSize.slice(1).toLowerCase() : 'Unknown';

  return (
    <div className="group hover:bg-gray-50 transition-colors duration-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`px-2 py-1 rounded-md text-xs font-medium ${getSizeColor(bagSize)}`}>
          <span className="text-xs">{displayName}</span>
        </div>
        <span className="text-xs text-gray-600">Bag Size</span>
      </div>
      
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">₹</span>
              <input
                type="number"
                value={tempPrice}
                onChange={(e) =>
                  setTempPrices((prev) => ({
                    ...prev,
                    [`${itemType}-${bagSize}`]: parseFloat(e.target.value) || 0,
                  }))
                }
                className="pl-6 pr-2 py-1 w-20 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
                min="0"
                step="0.01"
                autoFocus
              />
            </div>
            <button
              onClick={() => onSave(itemType, bagSize)}
              className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-all duration-200"
            >
              <CheckIcon className="w-3 h-3" />
            </button>
            <button
              onClick={() => onCancel(itemType, bagSize)}
              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-200"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          </div>
        ) : isAdding ? (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">₹</span>
              <input
                type="number"
                value={tempPrice}
                onChange={(e) =>
                  setTempPrices((prev) => ({
                    ...prev,
                    [`${itemType}-${bagSize}`]: parseFloat(e.target.value) || 0,
                  }))
                }
                className="pl-6 pr-2 py-1 w-20 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
                min="0"
                step="0.01"
                placeholder="0.00"
                autoFocus
              />
            </div>
            <button
              onClick={() => onSaveAdd(itemType, bagSize)}
              className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-all duration-200"
            >
              <CheckIcon className="w-3 h-3" />
            </button>
            <button
              onClick={() => onCancelAdd(itemType, bagSize)}
              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-200"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          </div>
        ) : currentPrice !== undefined ? (
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-900">
                ₹{currentPrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => onEdit(itemType, bagSize)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <PencilIcon className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 italic text-xs">Not set</span>
            <button
              onClick={() => onAdd(itemType, bagSize)}
              className="p-1 text-[#5F22D9] hover:text-[#4A1BB8] hover:bg-[#5F22D9]/10 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <PlusIcon className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceRow;