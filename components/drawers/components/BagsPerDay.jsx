import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { MinusIcon } from "@heroicons/react/20/solid";

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
          className="bg-white border border-gray-400  text-gray-800 p-1 rounded-xl hover:bg-gray-100"
        >
          <MinusIcon width={15} height={15} />
        </button>
        <span>{numberOfBags}</span>
        <button
          onClick={handleIncrease}
          className="bg-black text-white p-1 hover:bg-gray-800 rounded-xl"
        >
          <PlusIcon width={15} height={15} />
        </button>
      </div>
    </div>
  );
};

export default BagsPerDay;
