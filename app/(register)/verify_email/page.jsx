"use client";

import React, { useState } from "react";
import HeaderStyle from "../../../components/sections/auth/HeaderStyle";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { baseUrl } from "../../../utility/BaseURL";
import { toast } from "sonner";
import axiosClient from "../../../AxiosClient";
import Link from "next/link";

function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    console.log("inside API call");

    try {
      const otpResponse = await axiosClient.post(
        `/v1/vendor/me/email/send-otp?email=${data.email}`
      );

      if (otpResponse.status === 200) {
        toast.success("OTP sent successfully. Please verify.");
      } else {
        toast.error("Failed to send OTP. Please try again.");
        return;
      }

      localStorage.setItem("email", data.email);
      localStorage.setItem("password", data.password);
      router.push("/verify_otp");
    } catch (error) {
      console.error("Error during OTP or registration:", error);

      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col md:flex-row justify-between items-center px-6"
      style={{ backgroundImage: "url('/Background.png')" }}
    >
      {/* Left text and logo */}
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
              India'a first
            </h2>
            <h3 className="text-2xl text-white text-start ml-5">
              surplus Food Marketspace
            </h3>
          </div>
        </div>
      </div>

      {/* Right form card */}
      <div className="flex flex-col w-full md:w-[80%] lg:w-[40%] bg-white h-[90vh] max-h-[600px] rounded-[24px] justify-between shadow-lg overflow-hidden">
        <div className="flex justify-center items-center flex-1 px-6 pb-16 md:pb-28 lg:p-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full max-w-md space-y-5"
          >
            <div className="flex flex-col space-y-3">
              <p className="text-black font-semibold text-[28px]">
                Register Your Business
              </p>
              <p className="text-[#A1A5B7] text-sm">
                Enter your email and password to register
              </p>
            </div>

            {/* Email Input */}
            <div className="flex flex-col space-y-2">
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
            </div>

            {/* Password Input */}
            <div className="flex flex-col space-y-2">
              <input
                type="password"
                placeholder="Password"
                className="placeholder:font-bold rounded-md border border-gray-200 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="w-full flex justify-center">
              <button
                type="submit"
                className={`flex justify-center items-center bg-primary text-white font-semibold py-2 rounded hover:bg-[#8349f6] gap-2 w-[240px] md:w-[300px] ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Processing..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
