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
import { crossIconWhiteSvg } from "../../svgs";
import { useEffect, useState } from "react";
import axiosClient from "../../AxiosClient";

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

      console.log("Withdraw response:", response);
      toast.success("Withdrawal request submitted successfully!");
      handleClose();
    } catch (error) {
      toast.error("Failed to process withdrawal. Please try again.");
      console.error("Error:", error);
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
    <div className="relative z-999999 bg-gradient-custom">
      <Dialog open={open} onClose={handleClose} className="relative z-999999">
        <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75" />
        <div className="fixed inset-0 overflow-hidden rounded-md">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-4">
              <DialogPanel className="pointer-events-auto relative w-screen max-w-md bg-white">
                <div className="flex h-full flex-col overflow-y-scroll py-5 shadow-xl bg-gradient-custom">
                  <DialogTitle className="flex px-4 sm:px-6 justify-between">
                    <p className="text-white font-semibold text-lg ml-2">
                      Withdraw Amount
                    </p>
                    <button
                      className="p-2 hover:bg-main rounded"
                      onClick={handleClose}
                    >
                      {crossIconWhiteSvg}
                    </button>
                  </DialogTitle>
                  <hr className="my-3 w-[90%] border-gray-300 ml-8" />
                  <div className="flex flex-col mt-3 pb-3 flex-1 px-4 sm:px-6 space-y-4 items-center gap-5">
                    <div className="flex flex-col items-center">
                      <p className="text-white text-sm">Current Balance</p>
                      <p className="text-white text-base font-bold">
                        {Number(balance).toFixed(2)}
                      </p>
                    </div>
                    <h2 className="text-white font-medium text-lg">
                      Enter Amount For Withdrawal
                    </h2>
                    <div className="w-full flex justify-center items-center">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.match(/^\d*\.?\d{0,2}$/)) {
                            setAmount(value);
                          }
                        }}
                        className="text-white text-4xl placeholder:text-4xl border-none bg-transparent outline-none w-full text-center"
                        placeholder="0"
                      />
                    </div>

                    {isInsufficient && (
                      <p className="text-red-500">Insufficient balance</p>
                    )}
                    <button
                      onClick={handleWithdraw}
                      disabled={loading}
                      className={`flex justify-center font-md py-2 rounded-3xl gap-2 w-[90%] mt-5 ${
                        loading
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-white text-black hover:bg-gray-200"
                      }`}
                    >
                      {loading ? "Processing..." : "Continue"}
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default WithdrawAmountDrawer;
