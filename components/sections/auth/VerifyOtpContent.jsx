"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axiosClient from "../../../AxiosClient";
import { Input } from "@headlessui/react";
import BackButton from "./BackButton";

const LENGTH = 6;

const VerifyOtpContent = ({ onVerifySuccess, refreshState }) => {
    const [otpValue, setOtpValue] = useState("");
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const inputId = "otp-input";
    const inputRef = useRef(null);

    const router = useRouter();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);



    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearInterval(timerId);
        }
        setIsResendDisabled(false);
    }, [timeLeft]);

    const handleOtpChange = (e) => {
        const v = e.target.value.replace(/\D/g, "").slice(0, LENGTH);
        setOtpValue(v);
    };

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

            {/* Headless UI OTP input: single field, 6-cell display */}
            <label
                htmlFor={inputId}
                className="flex gap-1.5 sm:gap-2 mt-6 cursor-text select-none"
            >
                <Input
                    id={inputId}
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={LENGTH}
                    value={otpValue}
                    onChange={handleOtpChange}
                    className="sr-only"
                    aria-label="One-time code"
                />
                {Array.from({ length: LENGTH }).map((_, i) => {
                    const isActive = i === Math.min(otpValue.length, LENGTH - 1);
                    return (
                        <div
                            key={i}
                            className={`
                w-10 h-12 sm:w-12 sm:h-14 rounded-lg border flex items-center justify-center
                text-lg sm:text-xl font-medium tabular-nums transition-colors
                ${isActive ? "border-[#5F22D9] ring-2 ring-[#5F22D9]/20 bg-white" : "border-gray-200 bg-gray-50/50"}
                ${otpValue[i] ? "text-gray-900" : "text-transparent"}
              `}
                        >
                            {otpValue[i] || ""}
                        </div>
                    );
                })}
            </label>
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
