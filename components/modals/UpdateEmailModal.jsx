"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import axiosClient from "../../AxiosClient";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
import { useBackToClose } from "../../hooks/useBackToCloseModal";

const emailLooksValid = (value) => {
  const v = value.trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
};

const getErrorMessage = (err) => {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d?.msg || d).join(", ") || "Request failed";
  }
  return err?.message || "Something went wrong";
};

const UpdateEmailModal = ({ open, onClose, vendorId, onSuccess }) => {
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useBackToClose(open, onClose);

  useEffect(() => {
    if (open) {
      setNewEmail("");
      setOtp("");
      setOtpSent(false);
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const handleSendOtp = async () => {
    const email = newEmail.trim();
    if (!emailLooksValid(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    setSendOtpLoading(true);
    try {
      await axiosClient.post(
        "/v1/vendor/me/email/send-otp",
        undefined,
        {
          params: { email },
          headers: { Accept: "application/json" },
        }
      );
      setOtpSent(true);
      toast.success("OTP sent to your email");
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err));
    } finally {
      setSendOtpLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    const email = newEmail.trim();
    const code = otp.trim();
    if (!emailLooksValid(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      toast.error("Enter the 6-digit OTP you received");
      return;
    }
    setUpdateLoading(true);
    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      if (vendorId) {
        headers["X-Vendor-ID"] = vendorId;
      }
      await axiosClient.post(
        "/v1/vendor/me/email/update",
        { email, otp: code },
        { headers }
      );
      toast.success("Email updated successfully");
      onSuccess?.();
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err));
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
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
            <h2 className="text-lg font-semibold">Update email</h2>
            <button
              type="button"
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                New email
              </label>
              <input
                type="email"
                autoComplete="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={sendOtpLoading || otpSent}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[16px] focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            {!otpSent ? (
              <div className="flex justify-end gap-2 pt-2">
                <SecondaryButton type="button" onClick={handleClose}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  type="button"
                  onClick={handleSendOtp}
                  loading={sendOtpLoading}
                  loadingText="Sending..."
                >
                  Submit
                </PrimaryButton>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="6-digit code"
                    disabled={updateLoading}
                    className="w-full max-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-[16px] tracking-widest focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent disabled:bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    We sent a code to {newEmail.trim()}
                  </p>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <SecondaryButton
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                    disabled={updateLoading}
                  >
                    Back
                  </SecondaryButton>
                  <PrimaryButton
                    type="button"
                    onClick={handleUpdateEmail}
                    loading={updateLoading}
                    loadingText="Updating..."
                  >
                    Submit
                  </PrimaryButton>
                </div>
              </>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default UpdateEmailModal;
