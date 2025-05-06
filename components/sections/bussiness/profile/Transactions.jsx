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
import axiosClient from "../../../../AxiosClient";

const Transactions = () => {
  const dispatch = useDispatch();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(
          "/v1/vendor/payment/get?skip=0&limit=10"
        );

        console.log(response.data);
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleWithdraw = () => {
    dispatch(setOpenDrawer(true));
  };

  useEffect(() => {
    const currentBalance = localStorage.getItem("Totalrevenue");
    setBalance(currentBalance);
  }, []);

  const decideStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-scheduledBg border-badgeScheduled text-badgeScheduled";
      case "COMPLETED":
        return "bg-green-200 border-green-500 text-green-500";
      case "FAILED":
        return "bg-red-200 text-red-500 border-red-500";
      default:
        return "bg-gray-200 text-gray-500 border-gray-500";
    }
  };

  return (
    <div className="flex flex-col w-[100%] lg:w-[50%] md:w-[60%] p-5 md:p-0">
      <WithdrawAmountDrawer
        balance={balance}
        setBalance={setBalance}
        withdrawals={transactions}
        setWithdrawals={setTransactions}
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
          {Number(balance).toFixed(2)}
          <span className="text-base ml-1">{"INR ₹"}</span>
        </p>
        <p className="text-base font-medium text-white z-0">My Wallet</p>

        <button
          onClick={handleWithdraw}
          className="flex justify-center items-center bg-black/5 text-white font-medium rounded hover:bg-primary p-2 mt-4 z-0"
        >
          {withdrawAmountSvg}
          <span className="ml-2">Withdraw Amount</span>
        </button>
      </div>

      <div className="flex flex-col mt-4 p-3">
        <p className="font-semibold text-2xl text-blackTwo mb-2">
          Transaction History
        </p>
        {loading ? (
          <Loader />
        ) : transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between px-6 py-4 items-center bg-white shadow-lg transform translate-y-[-5px] p-2 rounded-lg mt-2 w-full"
            >
              <div className="flex gap-2">
                <div className="flex flex-col">
                  <p className="text-cardNumber text-base font-semibold">
                    {transaction.payment_order_id}
                  </p>
                  <p className="text-date text-sm font-medium">
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }).format(new Date(transaction.created_at * 1000))}
                  </p>
                </div>
              </div>
              <div className="flex gap-5 items-center">
                <div
                  className={`${decideStyle(
                    transaction.status
                  )} font-semibold rounded-full text-center border text-[12px] px-5 py-1`}
                >
                  {transaction.status}
                </div>
                <div className="text-amount text-xl font-semibold">
                  {Number(transaction.transaction_amount).toFixed(2)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
