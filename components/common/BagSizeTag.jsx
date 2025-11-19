import React from "react";
import { useSelector } from "react-redux";

const BagSizeTag = ({ bagSize, showIcon = true, showWorth = false, itemType = null, className = "" }) => {
  const itemTypes = useSelector((state) => state.catalogue.itemTypes);
  
  const sizeConfig = {
    SMALL: {
      color: 'bg-blue-100 text-blue-700',
      icon: '👜'
    },
    MEDIUM: {
      color: 'bg-yellow-100 text-yellow-700',
      icon: '🛍️'
    },
    LARGE: {
      color: 'bg-green-100 text-green-700',
      icon: '🛒'
    }
  };

  const config = sizeConfig[bagSize] || sizeConfig.SMALL;

  // Calculate worth if showWorth is true and itemType is provided
  let worth = null;
  if (showWorth && itemType && itemTypes && itemTypes[itemType]) {
    const itemData = itemTypes[itemType];
    const price = itemData.bags?.[bagSize] || 0;
    const cut = itemData.cuts?.[bagSize] || 0;
    worth = Math.round(3 * (price - cut));
  }

  return (
    <span 
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${config.color} ${className}`}
    >
      {showIcon && config.icon}
      {showIcon && ' '}
      {bagSize}
      {showWorth && worth !== null && (
        <span className="ml-1 opacity-75">
          (worth ₹{worth})
        </span>
      )}
    </span>
  );
};

export default BagSizeTag;
