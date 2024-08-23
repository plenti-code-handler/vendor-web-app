import React, { useState } from "react";

const BagsPerDay = ({ numberOfBags, setNumberOfBags }) => {
  const handleIncrease = () => {
    setNumberOfBags((prevCount) => prevCount + 1);
  };

  const handleDecrease = () => {
    setNumberOfBags((prevCount) => Math.max(prevCount - 1, 0));
  };
  return (
    <div className="flex justify-between items-center mt-3 pl-1 pr-1">
      <p className="text-black font-semibold text-[16px]">Bags per day</p>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          className="bg-white border border-gray-400  text-gray-800 px-2 rounded-xl hover:bg-gray-100"
        >
          -
        </button>
        <span>{numberOfBags}</span>
        <button
          onClick={handleIncrease}
          className="bg-black text-white px-2 rounded-xl hover:bg-gray-800"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default BagsPerDay;
