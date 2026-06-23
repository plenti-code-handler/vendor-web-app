"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import AuthPasswordField from "../../fields/AuthPasswordField";
import { useRouter } from "next/navigation";
import { baseUrl } from "../../../utility/BaseURL";
import BackButton from "./BackButton";
import { OTPInput } from "input-otp";

const ForgotPasswordContent = ({ refreshState }) => {
    const [step, setStep] = useState("email");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [otp, setOtp] = useState("");
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setError,
        reset,
    } = useForm({ mode: "onChange" });

    const onSubmitEmail = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${baseUrl}/v1/vendor/me/reset-password/send-otp?email=${data.email}`
            );
            toast.success(response.data.message);
            setEmail(data.email);
            setStep("otp");
        } catch (error) {
            setError("email", {
                type: "manual",
                message: "Failed to send OTP. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length === 6) {
            setLoading(true);
            try {
                const response = await axios.post(
                    `${baseUrl}/v1/vendor/me/email/verify-otp?email=${email}&otp=${otp}`
                );
                setToken(response.data.access_token);
                setStep("password");
            } catch (error) {
                toast.error(error.response?.data?.detail || "Invalid OTP");
            } finally {
                setLoading(false);
            }
        } else {
            toast.error("Please enter a valid 6-digit OTP");
        }
    };

    const handlePasswordReset = async (data) => {
        if (data.password !== data.confirmPassword) {
            setError("confirmPassword", {
                type: "manual",
                message: "Passwords do not match",
            });
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                `${baseUrl}/v1/vendor/me/reset-password/update?email=${email}&password=${data.password}&token=${token}`
            );
            toast.success("Password reset successful!");
            reset();
            // After success, go to login within the shell
            router.push("/");
        } catch (error) {
            toast.error("Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    if (step === "email") {
        return (
            <form onSubmit={handleSubmit(onSubmitEmail)} className="flex flex-col w-full max-w-md space-y-4">
                <p className="text-black font-semibold text-[28px]">Forgot Password</p>
                <p className="text-sm text-[#7E8299]">Enter your email to receive a reset link</p>
                <input
                    type="email"
                    placeholder="Email"
                    className="placeholder:font-semibold rounded-md border border-gray-200 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5F22D9]"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Please enter a valid email address",
                        },
                    })}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className={`bg-[#5F22D9] text-white py-3 rounded-xl font-semibold transition-all duration-200 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#4A1BB8]"}`}
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>
        );
    }

    if (step === "otp") {
        return (
            <div className="flex flex-col w-full max-w-md space-y-4">
                <p className="text-black font-semibold text-[28px]">Verify OTP</p>
                <p className="text-sm text-[#7E8299]">Enter the 6-digit code sent to {email}</p>
                <div className="flex justify-center py-1">
                    <OTPInput
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
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
                <button
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className={`bg-[#5F22D9] text-white py-3 rounded-xl font-semibold transition-all duration-200 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#4A1BB8]"}`}
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>
            </div>
        );
    }

    if (step === "password") {
        return (
            <form onSubmit={handleSubmit(handlePasswordReset)} className="flex flex-col w-full max-w-md space-y-4">
                <p className="text-black font-semibold text-[28px]">Set Password</p>
                <p className="text-sm text-[#7E8299]">For account: {email}</p>
                <AuthPasswordField register={register} name="password" placeholder="Password" />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                <AuthPasswordField name="confirmPassword" register={register} placeholder="Confirm Password" />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className={`bg-[#5F22D9] text-white py-3 rounded-xl font-semibold transition-all duration-200 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#4A1BB8]"}`}
                >
                    {loading ? "Resetting..." : "Submit"}
                </button>
            </form>
        );
    }

    return null;
};

export default ForgotPasswordContent;