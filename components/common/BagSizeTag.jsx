import React from "react";
import { useSelector } from "react-redux";

const BagSizeTag = ({ bagSize, showIcon = true, showWorth = false, itemType = null, pricingId = null, className = "" }) => {
  const pricing = useSelector((state) => state.catalogue.pricing);

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

  // Calculate worth if showWorth is true and itemType is provided (match by itemType and optional pricingId)
  let worth = null;
  if (showWorth && itemType && Array.isArray(pricing)) {
    const idToMatch = pricingId != null ? String(pricingId) : 'default';
    const entry =
      pricing.find((e) => String(e.item_type) === String(itemType) && String(e.id ?? 'default') === idToMatch)
    if (entry?.bags && entry?.cuts) {
      const price = entry.bags[bagSize] || 0;
      const cut = entry.cuts[bagSize] || 0;
      worth = Math.round(3 * (price - cut));
    }
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
