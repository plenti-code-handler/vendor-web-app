import React, { useState } from "react";

const BagTypes = () => {
  const [selectedBagType, setSelectedBagType] = useState(null);
  const bagTypes = ["Surprise", "Large", "Small"];

  const handleBagTypeClick = (type) => {
    setSelectedBagType(type);
  };
  return (
    <>
      <div className="flex flex-col pb-5">
        <p className="text-black font-bold text-[20px]">Choose Bag Type</p>
      </div>
      <div className="flex gap-5">
        {bagTypes.map((type) => (
          <div
            key={type}
            onClick={() => handleBagTypeClick(type)}
            className={`flex flex-col h-30 w-30 pr-5 pl-5 pb-3 pt-3 items-center rounded-lg shadow-lg transform transition-transform hover:translate-y-[-5px] ${
              selectedBagType === type
                ? "bg-mainLight opacity-90 border-2 border-main"
                : "bg-white"
            }`}
          >
            <img alt="Bag" src="/bag.png" className="rounded-md" />
            <p
              className={`text-[14px] font-semibold mt-2 ${
                selectedBagType === type ? "text-black font-bold" : "text-black"
              }`}
            >
              {type}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default BagTypes;
