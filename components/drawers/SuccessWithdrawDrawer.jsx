"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/withdrawSuccessSlice";
import { crossIconWhiteSvg, payPalSvg, warningSvg } from "../../svgs";
import { useState } from "react";

const SuccessWithdrawDrawer = ({ amount, iban }) => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.withdrawSuccess.drawerOpen);

  // const [amount, setAmount] = useState("");
  // const currentBalance = 3150.7;

  const handleClose = () => {
    dispatch(setOpenDrawer(false));
  };

  const handleContinue = () => {
    dispatch(setOpenDrawer(false));
  };

  return (
    <div className="relative z-999999 bg-gradient-custom">
      <Dialog open={open} onClose={handleClose} className="relative z-999999">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 overflow-hidden rounded-md">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-4">
              <DialogPanel
                transition
                className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700 bg-white"
              >
                <div className="flex h-full flex-col overflow-y-scroll py-5 shadow-xl bg-gradient-custom">
                  <DialogTitle className="flex px-4 sm:px-6 justify-between">
                    <p className="text-white font-semibold text-[18px]">
                      Successfull
                    </p>
                    <button
                      className="p-2 hover:bg-main rounded"
                      onClick={handleClose}
                    >
                      {crossIconWhiteSvg}
                    </button>
                  </DialogTitle>
                  <hr className="my-3 w-[90%] border-gray-300 ml-8" />
                  <div className="flex flex-col mt-3 pb-3 flex-1 px-4 sm:px-6 space-y-4 items-center">
                    <img
                      alt="Tick Icon"
                      src="/tick-mark.png"
                      className="h-25 w-25 "
                    />

                    <div className="flex flex-col gap-2 items-center">
                      <p className="text-white text-[14px]">
                        Your request has been received
                      </p>

                      <p className="text-white text-[50px] font-bold">
                        SEK {amount}
                      </p>

                      <p className="text-white text-[14px]">to account</p>
                    </div>

                    <div className="flex justify-between items-center bg-[#8adbbf] shadow-lg transform translate-y-[-5px] p-2 rounded-lg mt-2 lg:w-[80%]">
                      <div className="flex gap-2 items-center">
                        <p className="text-white text-[16px] font-medium">
                          {iban}
                        </p>
                      </div>
                    </div>

                    <div className="w-full flex items-center justify-center">
                      <button
                        onClick={handleContinue}
                        className="flex justify-center bg-transparent border border-white text-white font-md py-2 rounded-3xl hover:bg-mainLight gap-2 w-[90%] mt-5"
                      >
                        Go Back to Homepage
                      </button>
                    </div>
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

export default SuccessWithdrawDrawer;
