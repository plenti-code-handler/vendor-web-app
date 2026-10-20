"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  withdrawAmountSvg,
} from "../../../../svgs";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDrawer } from "../../../../redux/slices/withdrawAmountSlice";
import WithdrawAmountDrawer from "../../../drawers/WithdrawAmountDrawer";
import Loader from "../../../loader/loader";
import BeatLoader from "react-spinners/BeatLoader";

import axiosClient from "../../../../AxiosClient";
import { fetchBalance } from "../../../../redux/slices/blanceSlice";
import { formatDateTime } from "../../../../utility/FormatTime";

const ITEMS_PER_PAGE = 10;

const PAYOUT_STATUS = {
  INITIATED: {
    label: "Initiated",
    pill: "bg-amber-50 text-amber-700",
    dot: "bg-amber-400",
  },
  PROCESSING: {
    label: "Processing",
    pill: "bg-sky-50 text-sky-700",
    dot: "bg-sky-400",
  },
  COMPLETED: {
    label: "Completed",
    pill: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  FAILED: {
    label: "Failed",
    pill: "bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
};

const TransactionTile = ({ transaction, isExpanded, onToggle }) => {
  const {
    id,
    user_name,
    total_amount,
    vendor_cut,
    platform_cut,
    platform_fee_gst,
    item_gst,
    coupon_discount,
    contribution,
    refunded,
    created_at,
  } = transaction;

  const detailRows = [
    { label: "Payment ID", value: id },
    { label: "Vendor cut", value: `₹${Number(vendor_cut ?? 0).toFixed(2)}`, highlight: "green" },
    { label: "Platform fee", value: `₹${Number(platform_cut ?? 0).toFixed(2)}` },
    { label: "Platform GST", value: `₹${Number(platform_fee_gst ?? 0).toFixed(2)}` },
    { label: "Item GST", value: `₹${Number(item_gst ?? 0).toFixed(2)}` },
    { label: "Coupon discount", value: `₹${Number(coupon_discount ?? 0).toFixed(2)}` },
    { label: "Contribution", value: `₹${Number(contribution ?? 0).toFixed(2)}` },
  ];

  return (
    <div className="bg-white shadow-md rounded-xl w-full overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="w-full flex justify-between items-center gap-3 p-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-gray-900 truncate">
            {user_name || "Customer"}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            {formatDateTime(created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-lg font-bold text-[#00B877]">
            ₹{Number(vendor_cut ?? 0).toFixed(2)}
          </span>
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-400 transition-transform duration-300 ease-in-out ${
              isExpanded ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </div>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-3 border-t border-gray-100 space-y-2">
            {detailRows.map(({ label, value, highlight }) => (
              <div
                key={label}
                className="flex justify-between gap-4 text-xs text-gray-600"
              >
                <span>{label}</span>
                <span
                  className={`font-medium tabular-nums text-right ${
                    highlight === "green" ? "text-green-700" : "text-gray-900"
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}
            <div className="flex justify-between gap-4 text-xs pt-1 border-t border-gray-100">
              <span className="text-gray-600">Refunded</span>
              <span
                className={`font-semibold ${
                  refunded ? "text-red-600" : "text-green-600"
                }`}
              >
                {refunded ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PayoutTile = ({ payout }) => {
  const { id, amount, description, status } = payout;
  const statusMeta = PAYOUT_STATUS[status] ?? {
    label: status || "Unknown",
    pill: "bg-gray-100 text-gray-600",
    dot: "bg-gray-400",
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-colors duration-150 hover:bg-gray-50">
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-[13px] font-medium text-gray-900">
          {id}
        </p>
        {description ? (
          <p className="mt-0.5 truncate text-xs text-gray-500">{description}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusMeta.pill}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`} aria-hidden />
          {statusMeta.label}
        </span>
        <span className="min-w-[4.75rem] text-right text-sm font-semibold tabular-nums text-gray-900 sm:min-w-[5.5rem]">
          ₹{Number(amount ?? 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

const Transactions = () => {
  const dispatch = useDispatch();
  const { value: balance } = useSelector((state) => state.balance);
  const [newbalance, setBalance] = useState(0);

  const [transactions, setTransactions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [activeTab, setActiveTab] = useState("transactions");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [payoutsLoading, setPayoutsLoading] = useState(true);
  const [loadingMorePayouts, setLoadingMorePayouts] = useState(false);
  const [currentPayoutPage, setCurrentPayoutPage] = useState(0);
  const [hasMorePayouts, setHasMorePayouts] = useState(true);
  const [checkingPayout, setCheckingPayout] = useState(false);
  const [expandedTransactionId, setExpandedTransactionId] = useState(null);
  const [paymentBreakdown, setPaymentBreakdown] = useState({
    total_captured_payments: 0,
    total_refund_payments: 0,
    total_payouts: 0,
    balance: 0
  });

  const fetchTransactions = useCallback(async (reset = false, pageNum = 0) => {
    if (reset) {
      setCurrentPage(0);
      setTransactions([]);
      setHasMoreTransactions(true);
      setExpandedTransactionId(null);
    }

    const skip = reset ? 0 : pageNum * ITEMS_PER_PAGE;

    setLoading(reset);
    setLoadingMore(!reset);

    try {
      const response = await axiosClient.get(
        `/v1/vendor/payment/get?skip=${skip}&limit=${ITEMS_PER_PAGE}`
      );
      const newTransactions = response.data || [];

      setTransactions((prev) =>
        reset ? newTransactions : [...prev, ...newTransactions]
      );
      setCurrentPage(reset ? 1 : pageNum + 1);
      setHasMoreTransactions(newTransactions.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(true, 0);
  }, [fetchTransactions]);

  const handleLoadMoreTransactions = useCallback(() => {
    if (!loadingMore && hasMoreTransactions) {
      fetchTransactions(false, currentPage);
    }
  }, [loadingMore, hasMoreTransactions, currentPage, fetchTransactions]);

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


  const fetchPayouts = useCallback(async (reset = false, pageNum = 0) => {
    if (reset) {
      setCurrentPayoutPage(0);
      setPayouts([]);
      setHasMorePayouts(true);
    }

    const skip = reset ? 0 : pageNum * ITEMS_PER_PAGE;

    setPayoutsLoading(reset);
    setLoadingMorePayouts(!reset);

    try {
      const response = await axiosClient.get(
        `/v1/vendor/payout/get?skip=${skip}&limit=${ITEMS_PER_PAGE}`
      );
      const newPayouts = response.data || [];

      setPayouts((prev) => (reset ? newPayouts : [...prev, ...newPayouts]));
      setCurrentPayoutPage(reset ? 1 : pageNum + 1);
      setHasMorePayouts(newPayouts.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching payouts:", error);
      toast.error("Failed to fetch payouts");
    } finally {
      setPayoutsLoading(false);
      setLoadingMorePayouts(false);
    }
  }, []);

  useEffect(() => {
    fetchPayouts(true, 0);
  }, [fetchPayouts]);

  const handleLoadMorePayouts = useCallback(() => {
    if (!loadingMorePayouts && hasMorePayouts) {
      fetchPayouts(false, currentPayoutPage);
    }
  }, [loadingMorePayouts, hasMorePayouts, currentPayoutPage, fetchPayouts]);

  const handleWithdraw = async () => {
    setCheckingPayout(true);
    try {
      const response = await axiosClient.get("/v1/vendor/payout/eligibility");
      toast.success(response.data.detail);
      dispatch(setOpenDrawer(true));
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to check payout eligibility");
    } finally {
      setCheckingPayout(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <WithdrawAmountDrawer
        balance={balance}
        setBalance={setBalance}
        withdrawals={transactions}
        setWithdrawals={setTransactions}
      />
      <div className="flex flex-col justify-center bg-gradient-custom rounded-xl items-center shadow-lg p-6 w-full min-h-[255px] relative">

        {/* Wallet Balance Title */}
        <p className="text-xs text-white/60 font-medium uppercase tracking-wider z-0 mb-2">My Wallet Balance</p>
        

        {/* Payment Breakdown - Subtle */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 z-0 mb-4 text-xs text-white/50">
          <span className="border border-white/20 rounded-lg px-2 py-1 text-white/80">₹{Number(paymentBreakdown.total_captured_payments).toFixed(2)} (Revenue)</span>
          <span>−</span>
          <span className="border border-white/20 rounded-lg px-2 py-1 text-white/80">₹{Number(paymentBreakdown.total_refund_payments).toFixed(2)} (Refunds)</span>
          <span>−</span>
          <span className="border border-white/20 rounded-lg px-2 py-1 text-white/80">₹{Number(paymentBreakdown.total_payouts).toFixed(2)} (Payouts)</span>
          <span>=</span>
        </div>

        {/* Main Balance Amount - Center Focus */}
        <p className="text-5xl font-semibold text-white z-0 mb-3">
          ₹{Number(balance).toFixed(2)}
        </p>

        <button
          onClick={handleWithdraw}
          className="w-full max-w-64 h-10 flex justify-center items-center bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 px-4 py-2 z-0 transition-all duration-200"
        >
          {checkingPayout ? <BeatLoader color="#ffffff" size={8} /> : 
            <>
              {withdrawAmountSvg}
            </>
          }
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
        {activeTab === "transactions" ? (
          loading ? (
            <Loader />
          ) : transactions.length > 0 ? (
            <>
              <div className="flex flex-col gap-3">
                {transactions.map((transaction) => (
                  <TransactionTile
                    key={transaction.id}
                    transaction={transaction}
                    isExpanded={expandedTransactionId === transaction.id}
                    onToggle={() =>
                      setExpandedTransactionId((prev) =>
                        prev === transaction.id ? null : transaction.id
                      )
                    }
                  />
                ))}
              </div>
              {hasMoreTransactions && (
                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    onClick={handleLoadMoreTransactions}
                    disabled={loadingMore}
                    className={`px-4 py-2 rounded-md text-sm font-normal transition-colors duration-200 ${
                      loadingMore
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {loadingMore ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </div>
                    ) : (
                      "Load More Transactions"
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-sm">No transactions found.</p>
          )
        ) : payoutsLoading ? (
          <Loader />
        ) : payouts.length > 0 ? (
          <>
            <div className="flex flex-col gap-2">
              {payouts.map((payout) => (
                <PayoutTile key={payout.id} payout={payout} />
              ))}
            </div>
            {hasMorePayouts && (
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={handleLoadMorePayouts}
                  disabled={loadingMorePayouts}
                  className={`px-4 py-2 rounded-md text-sm font-normal transition-colors duration-200 ${
                    loadingMorePayouts
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {loadingMorePayouts ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    "Load More Payouts"
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500">No payouts found.</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
