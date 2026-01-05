"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/withdrawAmountSlice";
import { useEffect, useState } from "react";
import axiosClient from "../../AxiosClient";
import { fetchBalance } from "../../redux/slices/blanceSlice";
import { XMarkIcon, ArrowRightIcon, BanknotesIcon } from "@heroicons/react/24/outline";

const WithdrawAmountDrawer = ({ balance }) => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.withdrawAmount.drawerOpen);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const isInsufficient = parseFloat(amount) > balance;

  const handleClose = () => {
    dispatch(setOpenDrawer(false));
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0 || isInsufficient) {
      toast.error("Enter a valid amount.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosClient.post(
        "/v1/vendor/payout/create",
        {
          amount: parseFloat(amount),
          description: "Withdrawal request",
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      // console.log("Withdraw response:", response);
      dispatch(fetchBalance());
      toast.success("Withdrawal request submitted successfully!");
      handleClose();
    } catch (error) {
      toast.error(error.response.data.detail);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setAmount("");
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop 
        transition
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out data-[closed]:opacity-0" 
      />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel 
              transition
              className="pointer-events-auto relative w-screen max-w-md transform transition duration-300 ease-out data-[closed]:translate-x-full"
            >
              <div className="flex h-full flex-col bg-white shadow-2xl">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                      Withdraw Funds
                    </DialogTitle>
                    <button
                      onClick={handleClose}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-200"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col px-6 py-8 space-y-8">
                  {/* Balance Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <p className="text-3xl font-semibold text-primary">
                      ₹{Number(balance).toFixed(2)}
                    </p>
                    <p className="text-sm font-medium text-primary">Available Balance</p>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Withdrawal Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-2xl font-medium">₹</span>
                      </div>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.match(/^\d*\.?\d{0,2}$/)) {
                            setAmount(value);
                          }
                        }}
                        className={`w-full pl-12 pr-4 py-4 text-3xl font-semibold border-2 rounded-xl transition-all duration-200 outline-none ${
                          isInsufficient
                            ? "border-red-300 bg-red-50 text-red-600 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                            : amount
                            ? "border-purple-300 bg-purple-50 text-primary focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-purple-300 focus:ring-4 focus:ring-purple-50"
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {isInsufficient && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span>⚠</span>
                        <span>Amount exceeds available balance</span>
                      </p>
                    )}
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quick Select</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[2000, 5000, 10000, 20000].map((quickAmount) => (
                        <button
                          key={quickAmount}
                          onClick={() => setAmount(quickAmount.toString())}
                          disabled={quickAmount > balance}
                          className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                            quickAmount > balance
                              ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                              : "bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:text-primary active:scale-95"
                          }`}
                        >
                          ₹{quickAmount}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={handleWithdraw}
                    disabled={loading || !amount || parseFloat(amount) <= 0 || isInsufficient}
                    className={`group relative w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 ${
                      loading || !amount || parseFloat(amount) <= 0 || isInsufficient
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-hoverPrimary shadow-lg hover:shadow-xl active:scale-[0.98]"
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Withdraw ₹{amount || "0.00"}</span>
                        <ArrowRightIcon className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default WithdrawAmountDrawer;
