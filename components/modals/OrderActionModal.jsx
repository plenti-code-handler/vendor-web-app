"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { formatTime, formatDateTime } from "../../utility/FormatTime";
import BagSizeTag from "../common/BagSizeTag";
import DietIcon from "../common/DietIcon";
import { ITEM_TYPE_DISPLAY_NAMES } from "../../constants/itemTypes";
import { normalizeOrderStatus } from "../../constants/orderStatus";
import { useBackToClose } from "../../hooks/useBackToCloseModal";
import axiosClient from "../../AxiosClient";
import { toast } from "sonner";
import OrderStatusBadge from "../common/OrderStatusBadge";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

const OTP_LENGTH = 5;

const maskPhone = (phone) =>
  phone ? `${String(phone).slice(0, -3)}***` : null;

const OrderActionModal = ({
  open,
  onClose,
  order,
  orderDetails,
  loadingDetails,
  onVerifySuccess,
}) => {
  console.log(orderDetails, "order details checking");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef([]);

  const isReadyForPickup =
    normalizeOrderStatus(order?.current_status) === "READY_FOR_PICKUP";
  const orderData = orderDetails?.orderData ?? order;
  const items = orderDetails?.items ?? [];

  useBackToClose(open, onClose);

  useEffect(() => {
    if (!open) return;

    setOtp(Array(OTP_LENGTH).fill(""));
    setVerifying(false);

    if (normalizeOrderStatus(order?.current_status) !== "READY_FOR_PICKUP") return;

    const focusTimer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);

    return () => clearTimeout(focusTimer);
  }, [open, order?.order_id, order?.current_status]);

  const handleOtpChange = useCallback((value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e, currentIndex) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pastedText.length >= OTP_LENGTH) {
      const newOtp = pastedText.slice(0, OTP_LENGTH).split("");
      setOtp(newOtp);
      inputRefs.current[OTP_LENGTH - 1]?.focus();
    } else {
      const newOtp = [...otp];
      for (let i = 0; i < pastedText.length && currentIndex + i < OTP_LENGTH; i++) {
        newOtp[currentIndex + i] = pastedText[i];
      }
      setOtp(newOtp);

      const nextIndex = currentIndex + pastedText.length;
      if (nextIndex < OTP_LENGTH) {
        inputRefs.current[nextIndex]?.focus();
      }
    }
  }, [otp]);

  const handleVerifyCode = useCallback(async () => {
    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      toast.error(`Please enter a ${OTP_LENGTH}-digit code`);
      return;
    }

    setVerifying(true);

    try {
      const response = await axiosClient.patch(
        `/v1/vendor/order/pickup/${order.order_id}?order_code=${code}`
      );

      if (response.status === 200) {
        toast.success("Order code verified successfully");
        onClose();
        onVerifySuccess?.();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify order code");
    } finally {
      setVerifying(false);
    }
  }, [otp, order?.order_id, onClose, onVerifySuccess]);

  const transactionAmount = orderData?.transaction_amount || 0;
  const vendorCut = orderData?.vendor_cut || 0;
  const platformCut = orderData?.platform_cut || 0;
  const couponDiscount = orderData?.coupon_discount || 0;
  const platformFeeGst = orderData?.platform_fee_gst || 0;

  const orderAllergens = orderData?.allergens?.filter(Boolean) ?? [];

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 transition-opacity duration-300 data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex items-end justify-center">
        <DialogPanel
          transition
          className="w-full max-w-3xl h-full max-h-[85vh] flex flex-col rounded-t-2xl bg-white shadow-xl transform transition duration-300 ease-out data-[closed]:translate-y-full"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <XMarkIcon className="h-6 w-6 text-gray-400 hover:text-gray-900" />
            </button>
          </div>

          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {isReadyForPickup && (
              <div className="shrink-0 px-6 pt-4 pb-2">
                <div className="rounded-xl border border-green-200 bg-green-50/50 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Verify Pickup</h3>
                  <p className="text-xs text-gray-600 mb-4">
                    Enter the {OTP_LENGTH}-digit order code from the customer.
                  </p>
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        ref={(el) => (inputRefs.current[i] = el)}
                        onChange={(e) => handleOtpChange(e.target.value, i)}
                        onPaste={(e) => handlePaste(e, i)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-12 h-12 border-2 text-center text-xl rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                        aria-label={`Digit ${i + 1}`}
                        style={{
                          borderColor: digit ? "#5F22D9" : "#D1D5DB",
                          backgroundColor: "#F9FAFB",
                          color: digit ? "#111827" : "#6B7280",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={verifying}
                      className={`px-6 py-2 rounded-lg font-medium text-white transition ${
                        verifying
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {verifying ? "Verifying..." : "Verify"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Fixed: status + items */}
            <div className="shrink-0 px-6 py-3 border-b border-gray-100 space-y-3">
              {orderData && (
                <OrderStatusBadge status={orderData.current_status} />
              )}

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Items
                </h3>
                {loadingDetails ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
                  </div>
                ) : items.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {items.map((item, index) => {
                      const itemTypeLabel =
                        ITEM_TYPE_DISPLAY_NAMES[item.item_type] ||
                        item.item_type.replace(/_/g, " ");
                      const tagsLabel =
                        item.tags
                          ?.map(
                            (tag) =>
                              tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
                          )
                          .join(", ") || null;
                      const bestBefore = item.best_before_time
                        ? formatTime(item.best_before_time)
                        : formatTime(item.window_end_time + 3600);

                      return (
                        <div
                          key={item.item_id || index}
                          className="flex gap-3 py-3 first:pt-0 last:pb-0"
                        >
                          <img
                            src={item.image_url}
                            alt=""
                            className="h-14 w-14 shrink-0 rounded-lg object-cover bg-gray-100 border border-gray-200"
                          />
                          <div className="min-w-0 flex-1 space-y-1">
                            {item.description && (
                              <div className="flex items-center gap-x-1.5 gap-y-0.5">
                                <DocumentTextIcon className="bg-gray-100 rounded-md p-0.5 h-4 w-4 text-gray-800" />
                                <p className="text-gray-800 text-sm font-medium">
                                  {item.description}
                                </p>
                              </div>
                            )}
                            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm leading-snug">
                              <DietIcon diet={item.diet} size="xs" />
                              <span className="text-xs text-gray-900">{itemTypeLabel}</span>
                              <BagSizeTag
                                bagSize={item.bag_size}
                                showIcon={true}
                                showWorth={true}
                                itemType={item.item_type}
                                pricingId={item.pricing_id}
                                quantity={item.quantity}
                              />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                              {tagsLabel && (
                                <>
                                  <span className="text-gray-300" aria-hidden>·</span>
                                  <span className="line-clamp-1">{tagsLabel}</span>
                                </>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              <span className="text-gray-500">Pickup window: </span>
                              {formatTime(item.window_start_time)}
                              <span className="mx-1 text-gray-500">to</span>
                              {formatTime(item.window_end_time)}
                              <span className="mx-1.5 text-gray-500">·</span>
                              <span className="font-medium text-[#5F22D9]">
                                Best by {bestBefore}
                              </span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-gray-500">
                    No order items found.
                  </p>
                )}
              </div>
            </div>

            {/* Scrollable: order details + payment */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
              {orderData && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Order Details
                    </h3>
                    <span
                      className="block text-[10px] text-gray-400 font-mono truncate"
                      title={orderData.order_id}
                    >
                      #{orderData.order_id ? orderData.order_id : "—"}
                    </span>
                    <div className="space-y-1 text-xs text-gray-600">
                      {(orderData.user_name || orderData.user_phone_number) && (
                        <p>
                          <span className="text-gray-500">Customer </span>
                          <span className="text-gray-900">
                            {orderData.user_name || "—"}
                            {orderData.user_phone_number && (
                              <>
                                <span className="text-gray-300 mx-1">·</span>
                                {maskPhone(orderData.user_phone_number)}
                              </>
                            )}
                          </span>
                        </p>
                      )}
                      <p>
                        <span className="text-gray-500">Placed </span>
                        <span className="text-gray-900">
                          {formatDateTime(orderData.created_at)}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-500">Pickup </span>
                        <span className="text-gray-900">
                          {formatTime(orderData.window_start_time)}
                          <span className="mx-1 text-gray-300">–</span>
                          {formatTime(orderData.window_end_time)}
                        </span>
                      </p>
                      {orderAllergens.length > 0 && (
                        <p>
                          <span className="text-gray-500">Allergens </span>
                          <span className="text-gray-900 capitalize">
                            {orderAllergens.join(", ")}
                          </span>
                        </p>
                      )}
                      <p>
                        <span className="text-gray-500">You get </span>
                        <span className="font-medium text-green-700 tabular-nums">
                          ₹{Number(vendorCut).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                      Payment
                    </h3>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between gap-4 text-gray-600">
                        <span>Total</span>
                        <span className="font-semibold text-gray-900 tabular-nums">
                          ₹{transactionAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4 pt-1.5 border-t border-gray-100 text-gray-600">
                        <span>Vendor cut</span>
                        <span className="font-medium text-green-700 tabular-nums">
                          ₹{vendorCut.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4 text-gray-600">
                        <span>PLENTI fee</span>
                        <span className="font-medium text-gray-900 tabular-nums">
                          ₹{platformCut.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4 text-gray-600">
                        <span>Coupon</span>
                        <span className="font-medium text-gray-900 tabular-nums">
                          ₹{couponDiscount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4 text-gray-600">
                        <span>Platform GST</span>
                        <span className="font-medium text-gray-900 tabular-nums">
                          ₹{platformFeeGst.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end px-6 py-4 border-t bg-gray-50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
            >
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default OrderActionModal;
