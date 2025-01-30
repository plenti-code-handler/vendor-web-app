"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { collection, getDocs, query, where } from "firebase/firestore";

const ForgetPasswordScreen = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleContinue = async (data) => {
    router.push("/resetPassword");
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      {/* Left Side */}
      <div className="flex flex-col lg:w-[45%] items-center text-center justify-center w-full lg:h-screen bg-gray-100 p-6">
        <a href="/">
          <img
            alt="Plenti Logo"
            src="/Logo.png"
            className="max-w-[180px] md:max-w-[240px]"
          />
        </a>
        <div className="flex flex-col gap-4 mt-4 lg:mt-6">
          <p className="text-[40px] font-bold text-gray-800">
            Stop waste, save food!
          </p>
          <p className="text-sm font-medium text-[#7E8299] leading-6 px-[8%]">
            Choose from curated meal bags small, large, or surprise prepared by
            your favorite restaurants. Fast, easy, and always delicious.
            Download the app and grab your meal today!
          </p>
        </div>
      </div>

      {/* Right Side - Forget Password Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[55%] p-8">
        <form
          onSubmit={handleSubmit(handleContinue)}
          className="flex flex-col w-[390px] space-y-5"
        >
          <div className="flex flex-col space-y-3">
            <p className="text-black font-semibold text-[28px]">
              Forget Password
            </p>
            <p className="text-[#A1A5B7] text-sm">
              Enter your email associated with your account.
            </p>
            <p className="text-[#A1A5B7] text-sm">
              A code will be sent to your account for verification.
            </p>
          </div>
          <input
            className="placeholder:font-bold rounded-md border border-gray-200 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Email"
            name="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
          )}
          <button
            type="submit"
            className="flex justify-center bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 gap-2 w-full"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPasswordScreen;
