import React, { useState } from "react";

const BagTypes = () => {
  const [selectedBagType, setSelectedBagType] = useState(null);
  const bagTypes = [
    {
      type: "Surprise",
      image: "/surprise.png",
    },
    {
      type: "Large",
      image: "/large.png",
    },
    {
      type: "Small",
      image: "/small.png",
    },
  ];

  const handleBagTypeClick = (type) => {
    setSelectedBagType(type);
  };

  return (
    <>
      <div className="flex flex-col pb-5">
        <p className="text-black font-bold text-[20px]">Choose Bag Type</p>
      </div>
      <div className="flex gap-5">
        {bagTypes.map((bag) => (
          <div
            key={bag.type}
            onClick={() => handleBagTypeClick(bag.type)}
            className={`flex flex-col h-[30%] w-[25%] p-2 items-center rounded-lg shadow-lg transform transition-transform hover:translate-y-[-5px] ${
              selectedBagType === bag.type
                ? "bg-mainLight opacity-90 border-2 border-main"
                : "bg-white"
            }`}
          >
            <img alt={bag.type} src={bag.image} className="rounded-md" />
            <p
              className={`text-[14px] font-semibold mt-2 ${
                selectedBagType === bag.type
                  ? "text-black font-bold"
                  : "text-black"
              }`}
            >
              {bag.type}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default BagTypes;
