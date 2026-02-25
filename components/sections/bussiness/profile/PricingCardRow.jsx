"use client";

import React from "react";
import PriceCard from "./PriceCard";

/**
 * Row of 3 price cards (small, medium, large). Reusable in PricingForm and AddPricingModal.
 * @param {Object} prices - From calculatePrices(asp, itemType): { small, medium, large } each with { price, cut, serves }
 * @param {boolean} showCards - Whether to animate cards in (default true)
 * @param {string} className - Optional wrapper class
 */
const PricingCardRow = ({ prices, showCards = true, className = "" }) => {
  if (!prices) return null;

  return (
    <div className={`flex items-center justify-center gap-3 px-2 sm:px-4 ${className}`}>
      <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl">
        {["small", "medium", "large"].map((size, index) => (
          <div key={size} className="w-full">
            <PriceCard
              size={size}
              prices={prices}
              isMedium={size === "medium"}
              showCards={showCards}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingCardRow;
