import React from "react";

const PriceRow = ({ bagSize, currentPrice, currentCut }) => {
  if (!bagSize) return null;

  const getSizeColor = (size) => {
    switch (size) {
      case 'SMALL': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LARGE': return 'bg-[#5F22D9]/10 text-[#5F22D9]';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const displayName = bagSize.charAt(0) + bagSize.slice(1).toLowerCase();

  return (
    <div className="group hover:bg-gray-50 transition-colors duration-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`px-2 py-1 rounded-md text-xs font-medium ${getSizeColor(bagSize)}`}>
          <span className="text-xs">{displayName}</span>
        </div>
        <span className="text-xs text-gray-600">Bag Size</span>
      </div>
      
      <div className="flex items-center space-x-2">
        {currentPrice !== undefined ? (
          <div className="text-right">
            <div className="flex flex-col items-end">
              <span className="text-m font-semibold text-gray-900">
                ₹{currentPrice.toFixed(2)}
              </span>
              {currentCut !== undefined && (
                <span className="text-[10px] text-gray-500">
                  Platform cut: ₹{currentCut.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-gray-400 italic text-xs">Not set</span>
        )}
      </div>
    </div>
  );
};

export default PriceRow;