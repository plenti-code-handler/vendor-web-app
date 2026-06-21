"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { useBackToClose } from "../../hooks/useBackToCloseModal";

const FIELD_LABEL_CLASS =
  "text-xs font-medium uppercase tracking-wide text-slate-500";
const INPUT_CLASS =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-emerald-500/20 transition focus:border-emerald-600 focus:ring-2";
const CODE_LENGTH = 6;

const VerifyDineinCouponModal = ({
  open,
  onClose,
  onVerify,
  loading = false,
}) => {
  const [verifyCode, setVerifyCode] = useState("");
  const [billAmount, setBillAmount] = useState("");

  useBackToClose(open, onClose);

  useEffect(() => {
    if (open) {
      setVerifyCode("");
      setBillAmount("");
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify({ code: verifyCode, bill_amount: Number(billAmount) });
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 transition-opacity duration-300 data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex items-end justify-center">
        <DialogPanel
          transition
          className="w-full max-w-2xl p-2 pt-5 h-full max-h-[85vh] flex flex-col rounded-t-2xl bg-white shadow-xl transform transition duration-300 ease-out data-[closed]:translate-y-full"
        >
          <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-slate-900">
              Verify dine-in coupon
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
              <p className="text-sm text-slate-600">
                Ask the customer for their 6-digit coupon code in the app, then
                enter the bill total before applying the discount.
              </p>

              <label className="block space-y-2">
                <span className={FIELD_LABEL_CLASS}>6-digit code</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={CODE_LENGTH}
                  value={verifyCode}
                  onChange={(e) =>
                    setVerifyCode(
                      e.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH)
                    )
                  }
                  placeholder="123456"
                  className={INPUT_CLASS}
                  autoFocus
                />
              </label>

              <label className="block space-y-2">
                <span className={FIELD_LABEL_CLASS}>Bill amount (₹)</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  placeholder="500"
                  className={INPUT_CLASS}
                />
              </label>
            </div>

            <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  loading ||
                  verifyCode.length !== CODE_LENGTH ||
                  !billAmount ||
                  Number(billAmount) <= 0
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <CheckBadgeIcon className="h-4 w-4" />
                )}
                Verify & apply discount
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default VerifyDineinCouponModal;
