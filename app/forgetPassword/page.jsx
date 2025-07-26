"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import HeaderStyle from "../../components/sections/auth/HeaderStyle";
import axios from "axios";
import { toast } from "sonner";
import AuthPasswordField from "../../components/fields/AuthPasswordField";
import { useRouter } from "next/navigation";
import Link from "next/link";

function ForgetpasswordScreen() {
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const otpRefs = useRef([]);

  // ✅ Add mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    watch,
    getValues,
    reset,
  } = useForm({ mode: "onChange" });

  // Send OTP
  const onSubmitEmail = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://api.plenti.co.in/v1/vendor/me/reset-password/send-otp?email=${data.email}`
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
    const formateOTP = otp.join("");

    if (formateOTP.length === 6) {
      setLoading(true);
      try {
        const response = await axios.post(
          `https://api.plenti.co.in/v1/vendor/me/email/verify-otp?email=${email}&otp=${formateOTP}`
        );
        setToken(response.data.access_token);
        setStep("password");
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.detail);
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
        `https://api.plenti.co.in/v1/vendor/me/reset-password/update?password=${data.password}&token=${token}`
      );
      toast.success("Password reset successful!");
      reset();
      router.push("/");
    } catch (error) {
      toast.error("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Safe OTP input handler
  const handleOtpChange = (idx, value) => {
    if (!mounted) return; // Prevent execution during SSR
    
    const newOtp = [...otp];
    newOtp[idx] = value.replace(/\D/, "");
    setOtp(newOtp);
    
    // ✅ Use refs instead of document.getElementById
    if (value && idx < 5 && otpRefs.current[idx + 1]) {
      otpRefs.current[idx + 1].focus();
    }
  };

  const renderForm = () => {
    if (step === "email") {
      return (
        <form
          onSubmit={handleSubmit(onSubmitEmail)}
          className="flex flex-col w-full max-w-md space-y-4"
        >
          <p className="text-black font-semibold text-[28px]">Forgot Password</p>
          <p className="text-sm text-[#7E8299]">
            Enter your email to receive a reset link
          </p>

          <input
            type="email"
            placeholder="Email"
            className="placeholder:font-bold rounded-md border border-gray-200 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`bg-[#5F22D9] text-white py-2 rounded font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
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
          <p className="text-sm text-[#7E8299]">
            Enter the 6-digit code sent to {email}
          </p>

          <div className="flex justify-center space-x-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => (otpRefs.current[idx] = el)}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                className="w-10 h-12 text-center border border-gray-300 rounded text-xl focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent"
              />
            ))}
          </div>
          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className={`bg-[#5F22D9] text-white py-2 rounded font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
      );
    }

    if (step === "password") {
      return (
        <form
          onSubmit={handleSubmit(handlePasswordReset)}
          className="flex flex-col w-full max-w-md space-y-4"
        >
          <p className="text-black font-semibold text-[28px]">Set Password</p>
          <p className="text-sm text-[#7E8299]">For account: {email}</p>

          <AuthPasswordField
            register={register}
            name="password"
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <AuthPasswordField
            name="confirmPassword"
            register={register}
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`bg-[#5F22D9] text-white py-2 rounded font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Resetting..." : "Submit"}
          </button>
        </form>
      );
    }
  };

  // ✅ Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className="flex flex-col md:flex-row justify-between items-center min-h-screen px-6 lg:px-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/Background.png')" }}
      >
        <div className="flex lg:w-[45%] items-center justify-center text-center h-full">
          <div className="flex">
            <Link href="/">
              <img
                alt="Plenti Logo"
                src={"/splash-logo.png"}
                className="max-w-[180px] md:max-w-[240px] cursor-pointer"
              />
            </Link>
            <div className="bg-white w-1 h-20 mt-2"></div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl text-white text-start ml-5 mt-2">
                India's first
              </h2>
              <h3 className="text-2xl text-white text-start ml-5">
                surplus Food Marketspace
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full md:w-[80%] lg:w-[40%] bg-white h-[90vh] max-h-[600px] rounded-[24px] justify-between shadow-lg overflow-hidden">
          <div className="flex justify-center items-center flex-1 px-6 pb-16 md:pb-28 lg:p-6">
            <div className="flex flex-col w-full max-w-md space-y-4">
              <p className="text-black font-semibold text-[28px]">Forgot Password</p>
              <p className="text-sm text-[#7E8299]">
                Enter your email to receive a reset link
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col md:flex-row justify-between items-center min-h-screen px-6 lg:px-20 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/Background.png')" }}
    >
      <div className="flex lg:w-[45%] items-center justify-center text-center h-full">
        <div className="flex">
          <Link href="/">
            <img
              alt="Plenti Logo"
              src={"/splash-logo.png"}
              className="max-w-[180px] md:max-w-[240px] cursor-pointer"
            />
          </Link>
          <div className="bg-white w-1 h-20 mt-2"></div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl text-white text-start ml-5 mt-2">
              India's first
            </h2>
            <h3 className="text-2xl text-white text-start ml-5">
              surplus Food Marketspace
            </h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full md:w-[80%] lg:w-[40%] bg-white h-[90vh] max-h-[600px] rounded-[24px] justify-between shadow-lg overflow-hidden">
        <div className="flex justify-center items-center flex-1 px-6 pb-16 md:pb-28 lg:p-6">
          {renderForm()}
        </div>
      </div>
    </div>
  );
}

export default ForgetpasswordScreen;