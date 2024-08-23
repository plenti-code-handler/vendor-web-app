import React, { useState } from "react";

const BagTypes = ({ selectedBagType, setSelectedBagType }) => {
  const bagTypes = [
    {
      type: "Surprise",
      image: "/surprise.png",
      img: "https://firebasestorage.googleapis.com/v0/b/foodie-finder-ee1d8.appspot.com/o/box1.png?alt=media&token=1786ee59-09c2-46ba-a4a6-8aeab31d4535",
    },
    {
      type: "Large",
      image: "/large.png",
      img: "https://firebasestorage.googleapis.com/v0/b/foodie-finder-ee1d8.appspot.com/o/box2.png?alt=media&token=f7fdb328-c8db-4130-9d5d-7206bbfee479",
    },
    {
      type: "Small",
      image: "/small.png",
      img: "https://firebasestorage.googleapis.com/v0/b/foodie-finder-ee1d8.appspot.com/o/box3.png?alt=media&token=f70fb9b4-390d-4d7b-9b98-546ca588a867",
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
