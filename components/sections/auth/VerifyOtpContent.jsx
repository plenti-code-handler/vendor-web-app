"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import axiosClient from "../../../AxiosClient";
import BackButton from "./BackButton";

const LENGTH = 6;

const VerifyOtpContent = ({ onVerifySuccess, refreshState }) => {
    const [otpValue, setOtpValue] = useState("");
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);

    const router = useRouter();

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearInterval(timerId);
        }
        setIsResendDisabled(false);
    }, [timeLeft]);

    const handleVerify = async () => {
        if (otpValue.length !== LENGTH) {
            toast.error("Please enter all 6 digits");
            return;
        }

        setLoading(true);
        const email = localStorage.getItem("email");
        if (!email) {
            toast.error("Email not found. Please try again.");
            setLoading(false);
            return;
        }

        const otpCode = otpValue;

        try {
            const response = await axiosClient.post(
                `/v1/vendor/me/email/verify-otp?email=${email}&otp=${otpCode}`
            );

            if (response.status === 200) {
                toast.success("OTP Verified Successfully");
                const registerResponse = await axiosClient.post(
                    `/v1/vendor/me/register?token=${response.data.access_token}`,
                    {
                        email: localStorage.getItem("email"),
                        password: localStorage.getItem("password"),
                    }
                );

                if (registerResponse.status === 200) {
                    localStorage.setItem("token", registerResponse.data.access_token);
                    // If onVerifySuccess is provided, call it, otherwise redirect
                    if (onVerifySuccess) {
                        onVerifySuccess();
                    } else {
                        router.push("/onboard");
                    }
                } else {
                    toast.error("Registration failed. Please try again.");
                }
            } else {
                toast.error(response.data.message || "OTP verification failed");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.detail || "An error occurred. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        const email = localStorage.getItem("email");
        if (!email) {
            toast.error("Email not found. Please try again.");
            return;
        }

        try {
            setLoading(true);
            const otpResponse = await axiosClient.post(
                `/v1/vendor/me/email/send-otp?email=${email}`
            );

            if (otpResponse.status === 200) {
                toast.success("OTP sent successfully. Please verify.");
                setTimeLeft(60);
                setIsResendDisabled(true);
            } else {
                toast.error("Failed to send OTP. Please try again.");
            }
        } catch (error) {
            toast.error("Failed to resend OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col flex-grow items-center justify-center px-5 pb-10 w-full max-w-md">
            <p className="text-black font-semibold text-[28px]">Verify Account</p>
            <p className="text-neutral-500 text-sm mt-1">Enter the code sent to your email</p>

            <div className="flex justify-center py-1 mt-6">
                <OTPInput
                    maxLength={LENGTH}
                    value={otpValue}
                    onChange={setOtpValue}
                    disabled={loading}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern={REGEXP_ONLY_DIGITS}
                    containerClassName="flex items-center gap-2.5"
                    render={({ slots }) => (
                        <>
                            {slots.map((slot, idx) => (
                                <div
                                    key={idx}
                                    className={`relative flex h-12 w-11 items-center justify-center rounded-xl border bg-white text-lg font-semibold text-[#181C32] shadow-sm transition-all duration-200
                                        ${slot.isActive
                                            ? "border-[#5F22D9] ring-2 ring-[#5F22D9]/20 shadow-md shadow-[#5F22D9]/10"
                                            : slot.char
                                                ? "border-[#5F22D9]/35 bg-[#F8F5FF]"
                                                : "border-gray-200 hover:border-gray-300"}`}
                                >
                                    {slot.char}
                                    {slot.hasFakeCaret && (
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                            <div className="h-5 w-px animate-pulse bg-[#5F22D9]" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                />
            </div>
            <div className="flex items-center justify-center mt-5">
                <p className="text-[#494949] text-[12px] font-medium">
                    Didn't Receive Code?{" "}
                    <span
                        className={`underline ${isResendDisabled
                            ? "text-gray-400"
                            : "text-[#5F22D9] cursor-pointer underline-offset-2 hover:text-[#4A1BB8]"
                            }`}
                        onClick={handleResend}
                    >
                        Resend Code
                    </span>
                    <br />
                    <span className="block text-center mt-2">
                        Resend Code in{" "}
                        {`00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}
                    </span>
                </p>
            </div>

            <button
                onClick={handleVerify}
                className={`mt-5 bg-[#5F22D9] hover:bg-[#4A1BB8] text-white font-semibold py-3 rounded-xl w-full transition-all duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                disabled={loading}
            >
                {loading ? "Processing..." : "Verify"}
            </button>
        </div>
    );
};

export default VerifyOtpContent;
