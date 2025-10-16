"use client";

import React, { useState, useEffect } from "react";
import {
  bottomWalletBackground,
  leftWalletBackground,
  rightWalletBackground,
  topLeftWalletBackground,
  withdrawAmountSvg,
} from "../../../../svgs";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDrawer } from "../../../../redux/slices/withdrawAmountSlice";
import WithdrawAmountDrawer from "../../../drawers/WithdrawAmountDrawer";
import Loader from "../../../loader/loader";
import axiosClient from "../../../../AxiosClient";
import { fetchBalance } from "../../../../redux/slices/blanceSlice";

const Transactions = () => {
  const dispatch = useDispatch();
  const { value: balance } = useSelector((state) => state.balance);
  const [newbalance, setBalance] = useState(0);

  const [transactions, setTransactions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [activeTab, setActiveTab] = useState("transactions");
  const [loading, setLoading] = useState(true);
  const [paymentBreakdown, setPaymentBreakdown] = useState({
    total_captured_payments: 0,
    total_refund_payments: 0,
    total_payouts: 0,
    balance: 0
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(
          "/v1/vendor/payment/get?skip=0&limit=10"
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    dispatch(fetchBalance());
    fetchPaymentBreakdown();
  }, [dispatch]);

  const fetchPaymentBreakdown = async () => {
    try {
      const response = await axiosClient.get("/v1/vendor/me/balance");
      setPaymentBreakdown(response.data);
    } catch (error) {
      console.error("Error fetching payment breakdown:", error);
    }
  };

  // useEffect(() => {
  //   const fetchBalance = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axiosClient.get("/v1/vendor/me/balance");
  //       setBalance(response.data.balance);
  //     } catch (error) {
  //       console.error("Error fetching balance:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBalance();
  // }, []);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const response = await axiosClient.get(
          "/v1/vendor/payout/get?skip=0&limit=10"
        );
        setPayouts(response.data);
      } catch (error) {
        console.error("Error fetching payouts:", error);
      }
    };

    fetchPayouts();
  }, []);

  const handleWithdraw = () => {
    dispatch(setOpenDrawer(true));
  };

  const decideStyle = (status) => {
    switch (status) {
      case "PENDING":
      case "INITIATED":
      case "PROCESSING":
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
        {/* Wallet Balance Title */}
        <p className="text-xs text-white/60 font-medium uppercase tracking-wider z-0 mb-2">My Wallet Balance</p>
        

        {/* Payment Breakdown - Subtle */}
        <div className="flex items-center gap-1.5 z-0 mb-4 text-xs text-white/50">
          <span className="border border-white/20 rounded-lg px-2 py-1 text-white/80">₹{Number(paymentBreakdown.total_captured_payments).toFixed(2)} (Revenue)</span>
          <span>−</span>
          <span className="border border-white/20 rounded-lg px-2 py-1 text-white/80">₹{Number(paymentBreakdown.total_refund_payments).toFixed(2)} (Refunds)</span>
          <span>−</span>
          <span className="border border-white/20 rounded-lg px-2 py-1 text-white/80">₹{Number(paymentBreakdown.total_payouts).toFixed(2)} (Payouts)</span>
          <span>=</span>
        </div>

        {/* Main Balance Amount - Center Focus */}
        <p className="text-5xl font-bold text-white z-0 mb-3">
          ₹{Number(balance).toFixed(2)}
        </p>

        <button
          onClick={handleWithdraw}
          className="flex justify-center items-center bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 px-4 py-2 z-0 transition-all duration-200"
        >
          {withdrawAmountSvg}
          <span className="ml-2">Withdraw Amount</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex mt-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-4 py-2 text-sm font-semibold ${
            activeTab === "transactions"
              ? "text-primary  border-b-[2px] border-primary"
              : "text-gray-500"
          }`}
        >
          Transaction History
        </button>
        <button
          onClick={() => setActiveTab("payouts")}
          className={`ml-4 px-4 py-2 text-sm font-semibold ${
            activeTab === "payouts"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
          }`}
        >
          Payout History
        </button>
      </div>

      <div className="flex flex-col mt-4 p-3">
        {loading ? (
          <Loader />
        ) : activeTab === "transactions" ? (
          transactions.length > 0 ? (
            <div className="overflow-x-auto sm:overflow-x-visible">
              <div className="flex flex-col sm:flex-col gap-2 min-w-[350px] sm:min-w-0">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between items-center bg-white shadow-lg transform translate-y-[-5px] rounded-lg w-full p-4"
                  >
                    <div className="flex flex-col">
                      <p className="text-cardNumber text-base font-semibold">
                        {transaction.id}
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
                ))}
              </div>
            </div>
          ) : (
            <p>No transactions found.</p>
          )
        ) : payouts.length > 0 ? (
          <div className="overflow-x-auto sm:overflow-x-visible">
            <div className="flex flex-col sm:flex-col gap-2 min-w-[350px] sm:min-w-0">
              {payouts.map((payout) => (
                <div
                  key={payout.id}
                  className="flex justify-between items-center bg-white shadow-lg transform translate-y-[-5px] rounded-lg w-full p-4"
                >
                  <div className="flex flex-col">
                    <p className="text-cardNumber text-base font-semibold">
                      {payout.id}
                    </p>
                    <p className="text-date text-sm font-medium">
                      {payout.description}
                    </p>
                  </div>
                  <div className="flex gap-5 items-center">
                    <div
                      className={`${decideStyle(
                        payout.status
                      )} font-semibold rounded-full text-center border text-[12px] px-5 py-1`}
                    >
                      {payout.status}
                    </div>
                    <div className="text-amount text-xl font-semibold">
                      {Number(payout.amount).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No payouts found.</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
