"use client";

import React, { useEffect } from "react";
import {
  bottomWalletBackground,
  leftWalletBackground,
  payPalSvg,
  rightWalletBackground,
  topLeftWalletBackground,
  withdrawAmountSvg,
} from "../../../../svgs";
import { useDispatch } from "react-redux";
import { setOpenDrawer } from "../../../../redux/slices/withdrawAmountSlice";
import { setActivePage } from "../../../../redux/slices/headerSlice";

const Transactions = () => {
  const dispatch = useDispatch();
  const handleWithdraw = () => {
    dispatch(setOpenDrawer(true));
  };

  useEffect(() => {
    dispatch(setActivePage(""));
  }, [dispatch]);

  return (
    <div className="flex flex-col w-[100%] lg:w-[50%] md:w-[60%]">
      <div
        className="flex flex-col justify-center bg-gradient-custom rounded-xl items-center shadow-lg p-6"
        style={{ width: "100%", height: "255px", position: "relative" }}
      >
        <div className="absolute bottom-[0%] left-[40%] -z-0">
          {bottomWalletBackground}
        </div>
        <div className="absolute left-[0px] -z-0">{leftWalletBackground}</div>
        <div className="absolute top-[0%] right-[5%] -z-0">
          {rightWalletBackground}
        </div>
        <div className="absolute top-[0%] left-[15%] -z-0">
          {topLeftWalletBackground}
        </div>
        <p className="text-[40px] font-bold text-white z-0">$9,540</p>
        <p className="text-[16px] font-medium text-white z-0">My Wallet</p>

        <button
          onClick={() => handleWithdraw()}
          className="flex justify-center items-center bg-black/5 text-white font-medium rounded hover:bg-main p-2 mt-4 z-0"
        >
          {withdrawAmountSvg}
          <span className="ml-2">Withdraw Amount</span>
        </button>
      </div>
      <div className="flex flex-col mt-4 p-3">
        <p className="font-semibold text-[24px] text-blackTwo mb-2">
          Transaction History
        </p>
        <div className="flex justify-between items-center bg-white shadow-lg transform translate-y-[-5px] p-2 rounded-lg mt-2 w-full">
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
