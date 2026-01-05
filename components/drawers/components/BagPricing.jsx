import React, { useEffect, useState } from "react";

const BagPricing = ({
  pricing,
  setPricing,
  originalPrice,
  setOriginalPrice,
}) => {
  const [countryCode, setCountryCode] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCountryCode = JSON.parse(localStorage.getItem("countryCode"));
      setCountryCode(storedCountryCode);
    }
  }, []);

  return (
    <>
      <p className="text-black font-semibold text-lg mt-5">Pricing</p>
      <div className="relative flex items-center">
        <input
          type="number"
          className="block w-full placeholder:font-semibold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Pricing for Bag"
          value={pricing}
          onChange={(e) => setPricing(e.target.value)}
        />
        {/* <span className="absolute right-3 text-black font-semibold">
          {countryCode ? countryCode : "SEK"}
        </span> */}
      </div>
      <div className="relative flex items-center">
        <input
          type="number"
          className="block w-full placeholder:font-semibold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Original Price"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
        />
        {/* <span className="absolute right-3 text-black font-semibold">
          {countryCode ? countryCode : "SEK"}
        </span> */}
      </div>
    </>
  );
};

export default BagPricing;
