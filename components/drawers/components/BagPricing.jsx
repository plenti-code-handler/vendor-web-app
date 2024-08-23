import React from "react";

const BagPricing = ({
  pricing,
  setPricing,
  originalPrice,
  setOriginalPrice,
}) => {
  return (
    <>
      <p className="text-black font-bold text-[20px]">Pricing</p>
      <div className="relative flex items-center">
        <input
          className="block w-full placeholder:font-bold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Pricing for Bag"
          value={pricing}
          onChange={(e) => setPricing(e.target.value)}
        />
        <span className="absolute right-3 text-black font-bold">€</span>
      </div>
      <div className="relative flex items-center">
        <input
          className="block w-full placeholder:font-bold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Original Price"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
        />
        <span className="absolute right-3 text-black font-bold">€</span>
      </div>
    </>
  );
};

export default BagPricing;
