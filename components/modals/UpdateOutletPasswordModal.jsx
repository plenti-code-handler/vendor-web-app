"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axiosClient from "../../AxiosClient";
import { baseUrl } from "../../utility/BaseURL";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
import { useBackToClose } from "../../hooks/useBackToCloseModal";
import { selectParentData } from "../../redux/slices/parentSlice";

const getErrorMessage = (err) => {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d?.msg || d).join(", ") || "Request failed";
  }
  return err?.message || "Something went wrong";
};

const UpdateOutletPasswordModal = ({ open, onClose, outlet }) => {
  const parentData = useSelector(selectParentData);
  const parentEmail = (parentData?.email || "").trim();

  const [step, setStep] = useState("send");
  const [otp, setOtp] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useBackToClose(open, onClose);

  useEffect(() => {
    if (!open) return;
    setStep("send");
    setOtp("");
    setVerificationToken("");
    setPassword("");
    setConfirmPassword("");
  }, [open, outlet?.vendor_id]);

  const handleClose = () => {
    onClose?.();
  };

  const handleSendOtp = async () => {
    if (!parentEmail) {
      toast.error("Parent account email is not available");
      return;
    }
    setSendOtpLoading(true);
    try {
      await axiosClient.post(
        "/v1/vendor/me/reset-password/send-otp",
        undefined,
        {
          params: { email: parentEmail },
          headers: { Accept: "application/json" },
        }
      );
      setStep("otp");
      toast.success("OTP sent to your email");
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err));
    } finally {
      setSendOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.trim();
    if (!/^\d{6}$/.test(code)) {
      toast.error("Enter the 6-digit OTP you received");
      return;
    }
    setVerifyLoading(true);
    try {
      const response = await axiosClient.post(
        "/v1/vendor/me/email/verify-otp",
        undefined,
        {
          params: { email: parentEmail, otp: code },
          headers: { Accept: "application/json" },
        }
      );
      const token = response.data?.access_token;
      if (!token) {
        toast.error("Could not verify OTP");
        return;
      }
      setVerificationToken(token);
      setStep("password");
      toast.success("Email verified");
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err));
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    const nextPassword = password.trim();
    const nextConfirm = confirmPassword.trim();
    if (!nextPassword) {
      toast.error("Enter a new password");
      return;
    }
    if (nextPassword !== nextConfirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (!outlet?.vendor_id || !verificationToken) {
      toast.error("Verify your email before updating the password");
      return;
    }

    setUpdateLoading(true);
    try {
      // Plain axios keeps an expired verification token from signing the parent out.
      await axios.post(
        `${baseUrl}/v1/vendor/parent/outlet/password/${outlet.vendor_id}`,
        { password: nextPassword },
        {
          params: { token: verificationToken },
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      toast.success("Outlet password updated");
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err));
    } finally {
      setUpdateLoading(false);
    }
  };

  const outletLabel = outlet?.vendor_name || outlet?.username || "this outlet";

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
            <div className="min-w-0">
              <h2 className="text-lg font-semibold">Update password</h2>
              <p className="text-xs text-gray-500 truncate">{outletLabel}</p>
            </div>
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
            {step === "send" && (
              <>
                <p className="text-sm text-gray-600">
                  We will send a verification code to your parent account
                  {parentEmail ? (
                    <>
                      {" "}
                      at <span className="font-medium text-gray-800">{parentEmail}</span>
                    </>
                  ) : null}
                  .
                </p>
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
                    Send OTP
                  </PrimaryButton>
                </div>
              </>
            )}

            {step === "otp" && (
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
                    disabled={verifyLoading}
                    className="w-full max-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-[16px] tracking-widest focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent disabled:bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    We sent a code to {parentEmail}
                  </p>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <SecondaryButton
                    type="button"
                    onClick={() => {
                      setStep("send");
                      setOtp("");
                    }}
                    disabled={verifyLoading}
                  >
                    Back
                  </SecondaryButton>
                  <PrimaryButton
                    type="button"
                    onClick={handleVerifyOtp}
                    loading={verifyLoading}
                    loadingText="Verifying..."
                  >
                    Verify
                  </PrimaryButton>
                </div>
              </>
            )}

            {step === "password" && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    New password
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    disabled={updateLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[16px] focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    disabled={updateLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[16px] focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <SecondaryButton
                    type="button"
                    onClick={() => {
                      setStep("otp");
                      setVerificationToken("");
                      setPassword("");
                      setConfirmPassword("");
                    }}
                    disabled={updateLoading}
                  >
                    Back
                  </SecondaryButton>
                  <PrimaryButton
                    type="button"
                    onClick={handleUpdatePassword}
                    loading={updateLoading}
                    loadingText="Updating..."
                  >
                    Update password
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

export default UpdateOutletPasswordModal;
