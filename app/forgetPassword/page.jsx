"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import HeaderStyle from "../../components/sections/auth/HeaderStyle";
import axios from "axios";
import { toast } from "sonner";
import AuthPasswordField from "../../components/fields/AuthPasswordField";
import { useRouter } from "next/navigation";

function ForgetpasswordScreen() {
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const router = useRouter();

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
      router.push("/login");
    } catch (error) {
      toast.error("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (step === "email") {
      return (
        <form
          onSubmit={handleSubmit(onSubmitEmail)}
          className="flex flex-col w-full max-w-md space-y-5"
        >
          <div className="flex flex-col space-y-3">
            <p className="text-black font-semibold text-[28px]">
              Forget Password
            </p>
            <p className="text-[#A1A5B7] text-sm">
              Enter your email associated with your account.
            </p>
          </div>
          <input
            type="email"
            placeholder="Email"
            className="rounded-md border border-gray-200 py-3 px-3 text-sm"
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
            className="bg-[#5F22D9] text-white py-2 rounded font-semibold"
            disabled={loading || !isValid}
          >
            {loading ? "Sending OTP..." : "Continue"}
          </button>
        </form>
      );
    }

    if (step === "otp") {
      return (
        <div className="flex flex-col w-full max-w-md space-y-5">
          <p className="text-black font-semibold text-[28px]">Enter OTP</p>
          <p className="text-sm text-[#7E8299]">OTP sent to {email}</p>
          <div className="flex gap-2 justify-center">
            {otp.map((value, idx) => (
              <input
                key={idx}
                maxLength={1}
                value={value}
                onChange={(e) => {
                  const newOtp = [...otp];
                  newOtp[idx] = e.target.value.replace(/\D/, "");
                  setOtp(newOtp);
                  if (e.target.value && idx < 5) {
                    document.getElementById(`otp-${idx + 1}`)?.focus();
                  }
                }}
                id={`otp-${idx}`}
                className="w-10 h-12 text-center border border-gray-300 rounded text-xl"
              />
            ))}
          </div>
          <button
            onClick={handleVerifyOtp}
            className="bg-[#5F22D9] text-white py-2 rounded font-semibold"
          >
            Verify
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
            className="bg-[#5F22D9] text-white py-2 rounded font-semibold"
          >
            Submit
          </button>
        </form>
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between h-screen px-6 items-center">
      <div className="flex flex-col lg:w-1/2 text-center lg:text-left">
        <a href="/">
          <img
            alt="Plenti Logo"
            src="/Logo.png"
            className="max-w-[180px] md:max-w-[240px] mx-auto lg:mx-0"
          />
        </a>
        <div className="space-y-4 mt-6">
          <p className="text-[40px] font-bold text-gray-800">
            Stop waste, save food!
          </p>
          <p className="text-sm font-medium text-[#7E8299] leading-6">
            Choose from curated meal bags... Download the app today!
          </p>
        </div>
      </div>

      <div className="flex flex-col w-full md:w-[80%] lg:w-[40%] bg-white h-[90vh] max-h-[600px] rounded-[24px] justify-between shadow-lg overflow-hidden">
        <HeaderStyle />
        <div className="flex justify-center items-center flex-1 px-6 pb-16 md:pb-28 lg:p-6">
          {renderForm()}
        </div>
      </div>
    </div>
  );
}

export default ForgetpasswordScreen;
