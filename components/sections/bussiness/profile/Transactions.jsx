"use client";

import React, { useState, useEffect } from "react";
import {
  bottomWalletBackground,
  leftWalletBackground,
  rightWalletBackground,
  topLeftWalletBackground,
  withdrawAmountSvg,
} from "../../../../svgs";
import { useDispatch } from "react-redux";
import { setOpenDrawer } from "../../../../redux/slices/withdrawAmountSlice";
import WithdrawAmountDrawer from "../../../drawers/WithdrawAmountDrawer";
import Loader from "../../../loader/loader";

const Transactions = () => {
  const dispatch = useDispatch();

  const [balance, setBalance] = useState(5000);

  const [withdrawals, setWithdrawals] = useState([
    {
      id: "1",
      withdrawalno: "12345",
      createdAt: { seconds: 1690000000 },
      status: "paid",
      amount: 150.0,
    },
    {
      id: "2",
      withdrawalno: "12346",
      createdAt: { seconds: 1690100000 },
      status: "pending",
      amount: 200.0,
    },
    {
      id: "3",
      withdrawalno: "12347",
      createdAt: { seconds: 1690200000 },
      status: "not paid",
      amount: 300.0,
    },
  ]);
  const [countryCode, setCountryCode] = useState("SEK");
  const [loader, setLoader] = useState(false);

  const handleWithdraw = () => {
    dispatch(setOpenDrawer(true));
  };

  return (
    <div className="flex flex-col w-[100%] lg:w-[50%] md:w-[60%] p-5 md:p-0">
      <WithdrawAmountDrawer
        balance={balance}
        setBalance={setBalance}
        withdrawals={withdrawals}
        setWithdrawals={setWithdrawals}
      />
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
        <p className="text-[40px] font-bold text-white z-0">
          {countryCode} {Number(balance).toFixed(2)}
        </p>
        <p className="text-base font-medium text-white z-0">My Wallet</p>

        <button
          onClick={handleWithdraw}
          className="flex justify-center items-center bg-black/5 text-white font-medium rounded hover:bg-main p-2 mt-4 z-0"
        >
          {withdrawAmountSvg}
          <span className="ml-2">Withdraw Amount</span>
        </button>
      </div>
      {loader ? (
        <Loader />
      ) : (
        <div className="flex flex-col mt-4 p-3">
          <p className="font-semibold text-2xl text-blackTwo mb-2">
            Transaction History
          </p>
          {withdrawals.length > 0 ? (
            withdrawals.map((withdrawal) => {
              const decideStyle = (status) => {
                switch (status) {
                  case "paid":
                    return "bg-green-200 border-green-500 text-green-500";
                  case "not paid":
                    return "bg-red-200 text-red-500 border-red-500";
                  case "pending":
                    return "bg-scheduledBg border-badgeScheduled text-badgeScheduled";
                  default:
                    return "";
                }
              };
              return (
                <div
                  key={withdrawal.id}
                  className="flex justify-between px-6 py-4 items-center bg-white shadow-lg transform translate-y-[-5px] p-2 rounded-lg mt-2 w-full"
                >
                  <div className="flex gap-2">
                    <div className="flex flex-col">
                      <p className="text-cardNumber text-base font-semibold">
                        #{withdrawal.withdrawalno}
                      </p>
                      <p className="text-date text-sm font-medium">
                        {new Intl.DateTimeFormat("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }).format(
                          new Date(withdrawal.createdAt.seconds * 1000)
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-5 items-center">
                    <div
                      className={`${decideStyle(
                        withdrawal.status
                      )} font-semibold rounded-full text-center border text-[12px] px-5 py-1`}
                    >
                      {withdrawal.status === "paid"
                        ? "Accepted"
                        : withdrawal.status === "not paid"
                        ? "Rejected"
                        : withdrawal.status === "pending"
                        ? "Pending"
                        : ""}
                    </div>
                    <div className="text-amount text-xl font-semibold">
                      {countryCode} {Number(withdrawal.amount).toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No withdrawals found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Transactions;
