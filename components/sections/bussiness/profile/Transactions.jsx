import React from "react";
import { payPalSvg, withdrawAmountSvg } from "../../../../svgs";

const Transactions = () => {
  return (
    <div className="flex flex-col w-[100%] lg:w-[50%] md:w-[60%]">
      <div
        className="flex flex-col bg-mainLight rounded-xl md:max-w-sm items-center shadow-lg transform translate-y-[-10px] p-6"
        style={{ width: "100%", maxWidth: "480px", height: "190px" }}
      >
        <p className="text-[40px] font-bold text-white">$9,540</p>
        <p className="text-[16px] font-medium text-white">My Wallet</p>
        <button className="flex justify-center items-center bg-[#8adbbf] text-white font-semibold rounded hover:bg-main p-2 mt-4">
          {withdrawAmountSvg}
          <span className="ml-2">Withdraw Amount</span>
        </button>
      </div>
      <div className="flex flex-col mt-4 p-3">
        <p className="font-semibold text-[24px] text-blackTwo mb-2">
          Transaction History
        </p>
        <div className="flex justify-between items-center bg-white shadow-lg transform translate-y-[-5px] p-2 rounded-lg mt-2 lg:w-[90%]">
          <div className="flex gap-2">
            <span className="mt-2">{payPalSvg}</span>
            <div className="flex flex-col">
              <p className="text-cardNumber text-[16px] font-semibold">
                xxxx xxxx xxxx 0354
              </p>
              <p className="text-date text-[14px] font-medium">
                2 Jan, 24 - 12:00
              </p>
            </div>
          </div>
          <p className="text-amount text-[20px] font-semibold">€55.00</p>
        </div>
        
      </div>
    </div>
  );
};

export default Transactions;
