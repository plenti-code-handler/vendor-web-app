import React, { useState } from "react";
import TextField from "../../../fields/TextField";

const PaymentInfo = () => {
  const [view, setView] = useState("initial");

  const handleAddPaymentClick = () => setView("addCard");
  const handleAddCardClick = () => setView("linkedCards");

  return (
    <div className="flex flex-col justify-center">
      {view === "initial" && (
        <div className="flex flex-col items-center gap-3">
          <p className="font-md text-[14px] text-gray-800 text-center">
            Add a payment method using our secure payment system.
          </p>
          <button
            onClick={handleAddPaymentClick}
            className="flex justify-center bg-pinkBgDark text-white font-md py-2 rounded hover:bg-pinkBgDarkHover2 gap-2 w-[60%]"
          >
            Add Payment Method +
          </button>
        </div>
      )}

      {view === "addCard" && (
        <div className="flex flex-col gap-5">
          <p className="text-blackFour font-semibold text-[15px]">
            Add Card Details
          </p>
          <div className="relative flex items-center flex-col gap-3">
            <input
              className="block w-full placeholder:font-bold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Card Holder Name"
            />
            <span className="absolute right-3 text-black font-bold mt-2">
              <img src="/masterCard.png" alt="MasterCard" />
            </span>
            <TextField placeholder="Card Number" />
          </div>
          <div className="flex justify-between gap-5">
            <input
              type="date"
              className="block placeholder:font-bold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black w-[100%]"
              placeholder="Select Date"
            />
            <input
              type="number"
              className="block placeholder:font-bold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black w-[100%]"
              placeholder="CVV"
            />
          </div>
          <div className="flex gap-10 pt-2">
            <button
              onClick={() => setView("initial")}
              className="flex justify-center bg-white text-black border border-black font-md py-2 rounded hover:bg-grayTwo gap-2 w-[100%]"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCardClick}
              className="flex justify-center bg-pinkBgDark text-white font-md py-2 rounded hover:bg-pinkBgDarkHover2 gap-2 w-[100%]"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {view === "linkedCards" && (
        <div className="flex flex-col">
          <p className="text-blackFour font-semibold text-[15px]">
            Linked Cards
          </p>
          <div className="flex justify-between items-center bg-white shadow-md rounded-lg mt-5 p-4 mb-4 transform translate-y-[-10px] hover:translate-y-[-12px] transition-transform">
            <div className="flex gap-2">
              <img src="/masterCard.png" alt="MasterCard" className="w-10" />
              <p>**** **** **** 42602</p>
            </div>
            <p className="underline-offset-2 text-[#EB001B] font-medium hover:cursor-pointer">
              Remove
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentInfo;
